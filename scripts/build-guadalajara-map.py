#!/usr/bin/env python3
"""Builds src/data/guadalajaraMap.js: a simplified SVG map of the Guadalajara metro area.

Data: OpenStreetMap contributors, ODbL (https://www.openstreetmap.org/copyright), fetched from the
Overpass API once, at build time of this file. The site itself loads nothing external.

Usage: python3 scripts/build-guadalajara-map.py [cache_dir]
  cache_dir (optional) holds bounds.json / roads.json from an earlier run to skip the download.
Only the standard library is needed.
"""
import json, math, os, sys, time, urllib.parse, urllib.request

W, H = 600, 400
LAT_MIN, LAT_MAX = 20.50, 20.82
LAT_C = (LAT_MIN + LAT_MAX) / 2
# Same km per unit on both axes, so the 3:2 frame is not distorted.
LNG_SPAN = (LAT_MAX - LAT_MIN) * (W / H) / math.cos(math.radians(LAT_C))
LNG_CENTER = -103.40
LNG_MIN, LNG_MAX = LNG_CENTER - LNG_SPAN / 2, LNG_CENTER + LNG_SPAN / 2
OVERPASS = 'https://overpass-api.de/api/interpreter'
BBOX = '20.40,-103.75,20.95,-103.05'
NAMES = 'Guadalajara|Zapopan|San Pedro Tlaquepaque|Tlaquepaque|Tonalá|Tlajomulco de Zúñiga|El Salto|Ixtlahuacán de los Membrillos|Juanacatlán'
LABELS = {'San Pedro Tlaquepaque': 'Tlaquepaque', 'Tlajomulco de Zúñiga': 'Tlajomulco',
          'Ixtlahuacán de los Membrillos': 'Ixtlahuacán', 'El Salto': 'El Salto', 'Juanacatlán': 'Juanacatlán'}


def project(lat, lng):
    return ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN) * W, (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * H)


def fetch(name, query, cache):
    path = os.path.join(cache, name + '.json') if cache else None
    if path and os.path.exists(path):
        return json.load(open(path))
    data = urllib.parse.urlencode({'data': query}).encode()
    for attempt in range(1, 5):
        try:
            req = urllib.request.Request(OVERPASS, data, {'User-Agent': 'portfolio-map-build/1.0'})
            return json.load(urllib.request.urlopen(req, timeout=150))
        except Exception as e:  # server busy: back off and retry
            print('retry', name, attempt, e)
            time.sleep(8 * attempt)
    sys.exit('could not download ' + name)


def simplify(points, tol):
    """Douglas-Peucker, iterative. Closed rings are split at the farthest point first."""
    if len(points) < 3:
        return points
    if points[0] == points[-1]:
        far = max(range(len(points)), key=lambda i: math.hypot(points[i][0] - points[0][0], points[i][1] - points[0][1]))
        return simplify(points[:far + 1], tol) + simplify(points[far:], tol)[1:]
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = points[a], points[b]
        dx, dy = bx - ax, by - ay
        norm = math.hypot(dx, dy) or 1e-9
        best, idx = 0, None
        for i in range(a + 1, b):
            d = abs(dy * points[i][0] - dx * points[i][1] + bx * ay - by * ax) / norm
            if d > best:
                best, idx = d, i
        if idx is not None and best > tol:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(points, keep) if k]


def clip_polygon(poly, xmin, ymin, xmax, ymax):
    """Sutherland-Hodgman against a rectangle."""
    def clip(pts, inside, intersect):
        out = []
        for i, cur in enumerate(pts):
            prev = pts[i - 1]
            if inside(cur):
                if not inside(prev):
                    out.append(intersect(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(intersect(prev, cur))
        return out

    def ix(x):
        return lambda p, q: (x, p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]))

    def iy(y):
        return lambda p, q: (p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]), y)

    for inside, inter in [(lambda p: p[0] >= xmin, ix(xmin)), (lambda p: p[0] <= xmax, ix(xmax)),
                          (lambda p: p[1] >= ymin, iy(ymin)), (lambda p: p[1] <= ymax, iy(ymax))]:
        if not poly:
            break
        poly = clip(poly, inside, inter)
    return poly


def area_centroid(poly):
    a = cx = cy = 0.0
    for i, (x0, y0) in enumerate(poly):
        x1, y1 = poly[(i + 1) % len(poly)]
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    a /= 2
    return abs(a), (cx / (6 * a), cy / (6 * a)) if a else (0, (0, 0))


def rings_from_ways(ways):
    ways = [list(w) for w in ways if len(w) > 1]
    rings = []
    while ways:
        ring = ways.pop(0)
        grew = True
        while grew and ring[0] != ring[-1]:
            grew = False
            for i, w in enumerate(ways):
                if w[0] == ring[-1]: ring += w[1:]
                elif w[-1] == ring[-1]: ring += w[::-1][1:]
                elif w[-1] == ring[0]: ring = w[:-1] + ring
                elif w[0] == ring[0]: ring = w[::-1][:-1] + ring
                else: continue
                ways.pop(i); grew = True; break
        rings.append(ring)
    return rings


def path(points, close):
    d = 'M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in points)
    return d + ('Z' if close else '')


def main():
    cache = sys.argv[1] if len(sys.argv) > 1 else None
    bounds = fetch('bounds', f'[out:json][timeout:120];relation["boundary"="administrative"]["admin_level"="6"]["name"~"^({NAMES})$"]({BBOX});out geom;', cache)
    roads = fetch('roads', f'[out:json][timeout:120];way["highway"~"^(motorway|trunk)$"]({BBOX});out geom;', cache)

    munis = []
    for rel in bounds['elements']:
        ways = [[project(p['lat'], p['lon']) for p in m['geometry']] for m in rel['members']
                if m['type'] == 'way' and m['role'] == 'outer' and m.get('geometry')]
        biggest, best = None, 0
        parts = []
        for ring in rings_from_ways([[(round(x, 4), round(y, 4)) for x, y in w] for w in ways]):
            ring = simplify(ring, 0.5)
            clipped = clip_polygon(ring, -8, -8, W + 8, H + 8)
            if len(clipped) < 3:
                continue
            area, cen = area_centroid(clipped)
            parts.append(path(clipped, True))
            if area > best:
                best, biggest = area, clipped
        if not parts or best < 300:
            continue
        name = rel['tags']['name']
        # Label spot: centroid of the part inside the frame, kept off the edges.
        inside = clip_polygon(biggest, 0, 0, W, H)
        _, (lx, ly) = area_centroid(inside)
        munis.append({'name': LABELS.get(name, name), 'd': ''.join(parts),
                      'label': {'x': round(min(max(lx, 60), W - 60), 1), 'y': round(min(max(ly, 24), H - 24), 1)}})

    runs = []
    for way in roads['elements']:
        pts = [project(p['lat'], p['lon']) for p in way.get('geometry', [])]
        run = []
        for p in pts:
            if -8 <= p[0] <= W + 8 and -8 <= p[1] <= H + 8:
                run.append(p)
            elif len(run) > 1:
                runs.append(run); run = []
            else:
                run = []
        if len(run) > 1:
            runs.append(run)
    road_d = ''.join(path(simplify(r, 0.6), False) for r in runs if len(simplify(r, 0.6)) > 1)

    out = f"""// GENERATED by scripts/build-guadalajara-map.py. Do not edit by hand.
// Municipal boundaries and motorways/trunk roads of the Guadalajara metro area, simplified.
// Data: © OpenStreetMap contributors, ODbL (https://www.openstreetmap.org/copyright).
// Projection: plain lat/lng onto a {W}x{H} frame; `bounds` lets other code place points on it.

export const guadalajaraMap = {json.dumps({'width': W, 'height': H, 'bounds': {'latMin': LAT_MIN, 'latMax': LAT_MAX, 'lngMin': round(LNG_MIN, 5), 'lngMax': round(LNG_MAX, 5)}})[:-1]},
  municipalities: {json.dumps(munis, ensure_ascii=False)},
  roads: {json.dumps(road_d)},
}};
"""
    # `bounds` etc. are inside one object literal; normalise the manual splice above.
    open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'guadalajaraMap.js'), 'w').write(out)
    print('municipalities:', [m['name'] for m in munis])
    print('size KB:', round(len(out) / 1024, 1), '| roads KB:', round(len(road_d) / 1024, 1))


main()
