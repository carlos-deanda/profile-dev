import { useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import * as M from 'motion/react-m';
import { Container, SectionTitle, Eyebrow, TrackLabel } from './ui';
import Reveal from './Reveal';
import { places, tracks } from '../data/profile';
import { guadalajaraMap } from '../data/guadalajaraMap';

const { width: VIEW_W, height: VIEW_H, bounds } = guadalajaraMap;

// Real coordinates onto the map's frame, as percentages (for the HTML pins).
function withPins(items) {
  return items.map((place) => ({
    ...place,
    pin: {
      x: ((place.coords.lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100,
      y: ((bounds.latMax - place.coords.lat) / (bounds.latMax - bounds.latMin)) * 100,
      labelSide: place.labelSide,
    },
  }));
}

const PINNED = withPins(places.items);

// Keeps municipality names from hiding under the pin labels: if a name would overlap a pin
// (dot + label pill), it moves up or down until it is clear.
function placeMunicipalityLabels() {
  const pinBoxes = PINNED.map((p) => {
    const x = (p.pin.x / 100) * VIEW_W;
    const y = (p.pin.y / 100) * VIEW_H;
    const labelW = 40 + p.short.length * 7.5;
    return p.pin.labelSide === 'left'
      ? { x0: x - labelW - 8, x1: x + 16, y0: y - 24, y1: y + 24 }
      : { x0: x - 16, x1: x + labelW + 8, y0: y - 24, y1: y + 24 };
  });
  return guadalajaraMap.municipalities.map((m) => {
    const halfW = m.name.length * 4.2;
    const clear = (y) =>
      pinBoxes.every(
        (b) =>
          m.label.x + halfW < b.x0 || m.label.x - halfW > b.x1 || y + 6 < b.y0 || y - 10 > b.y1,
      );
    const y = [0, 40, -40, 80, -80].map((d) => m.label.y + d).find(clear) ?? m.label.y;
    return { ...m, label: { ...m.label, y } };
  });
}

const LABELLED = placeMunicipalityLabels();
const PLACE_AREAS = new Set(places.items.map((p) => p.area));

// Municipal borders and main roads from OpenStreetMap, simplified into the repo (see
// scripts/build-guadalajara-map.py). Nothing is loaded from the network. Municipalities that
// contain one of my places get a faint wine tint.
function Backdrop() {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      {guadalajaraMap.municipalities.map((m) => (
        <path
          key={m.name}
          d={m.d}
          strokeWidth="2.5"
          strokeLinejoin="round"
          className={`stroke-white ${PLACE_AREAS.has(m.name) ? 'fill-[#f1e3e7]' : 'fill-[#efeff2]'}`}
        />
      ))}
      <path
        d={guadalajaraMap.roads}
        fill="none"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-[#d2d2d7]"
      />
      {LABELLED.map((m) => (
        <text
          key={m.name}
          x={m.label.x}
          y={m.label.y}
          textAnchor="middle"
          className="fill-[#5f5f64] text-[10px] font-semibold tracking-[0.1em] uppercase"
        >
          {m.name}
        </text>
      ))}
      <text x="572" y="34" textAnchor="middle" className="fill-muted text-[15px] font-semibold">
        N
      </text>
      <path
        d="M572 42 L572 62 M565 50 L572 41 L579 50"
        fill="none"
        strokeWidth="2"
        className="stroke-muted"
      />
    </svg>
  );
}

function PlaceCard({ place, headingId, onClose }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Eyebrow accent>{place.area}</Eyebrow>
          <h3 id={headingId} className="text-2xl leading-tight font-bold tracking-[-0.015em]">
            {place.name}
          </h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-ink-2 outline-offset-2 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
          >
            {places.closeLabel}
          </button>
        )}
      </div>
      <p className="text-[17px] leading-normal text-ink-2">{place.summary}</p>
      <ul className="flex flex-col gap-2.5">
        {place.points.map((point) => (
          <li key={point} className="flex gap-3 text-base leading-normal text-ink-2">
            <span
              aria-hidden="true"
              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pin({ place, selected, onOpen, buttonRef }) {
  const { x, y, labelSide } = place.pin;
  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onOpen}
      onFocus={onOpen}
      aria-expanded={selected}
      aria-controls="place-card"
      aria-label={`${place.short}, ${place.area}`}
      // Anchor on the dot (12px in from the button edge), not on the middle of dot + label.
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform:
          labelSide === 'left' ? 'translate(calc(-100% + 12px), -50%)' : 'translate(-12px, -50%)',
      }}
      className={`group absolute flex min-h-11 items-center gap-2.5 rounded-full px-1 outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent ${
        labelSide === 'left' ? 'flex-row-reverse' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`block h-4 w-4 shrink-0 rounded-full border-2 border-white bg-accent transition-shadow duration-200 ${
          selected
            ? 'shadow-[0_0_0_6px_rgba(155,28,58,0.22)]'
            : 'group-hover:shadow-[0_0_0_5px_rgba(155,28,58,0.18)]'
        }`}
      />
      <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-ink shadow-sm">
        {place.short}
      </span>
    </button>
  );
}

function InteractiveMap() {
  const [openId, setOpenId] = useState(null);
  const pins = useRef({});
  const reduced = useReducedMotion();
  const open = PINNED.find((p) => p.id === openId);

  const close = () => {
    const id = openId;
    setOpenId(null);
    pins.current[id]?.focus({ preventScroll: true });
  };

  const Panel = reduced ? 'div' : M.div;
  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      };

  return (
    <div
      className="hidden gap-8 md:grid md:grid-cols-[1.25fr_1fr]"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && openId) close();
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-[#efeff2]">
          <Backdrop />
          {PINNED.map((place) => (
            <Pin
              key={place.id}
              place={place}
              selected={openId === place.id}
              onOpen={() => setOpenId(place.id)}
              buttonRef={(el) => {
                pins.current[place.id] = el;
              }}
            />
          ))}
        </div>
        <p className="text-[13px] text-muted">
          {places.mapNote}{' '}
          <a href={places.mapCredit.href} target="_blank" rel="noreferrer" className="underline">
            {places.mapCredit.text}
          </a>
        </p>
      </div>

      <div
        id="place-card"
        role="region"
        aria-live="polite"
        aria-label={open ? open.name : places.hint}
        className="flex min-h-[260px] items-center rounded-3xl bg-white p-8"
      >
        {open ? (
          <Panel key={open.id} className="w-full" {...motionProps}>
            <PlaceCard place={open} headingId={`place-${open.id}`} onClose={close} />
          </Panel>
        ) : (
          <p className="text-[17px] leading-normal text-muted">{places.hint}</p>
        )}
      </div>
    </div>
  );
}

// Phones: no map, just the same content as a list.
function PlaceList() {
  return (
    <ul aria-label={places.listLabel} className="flex flex-col gap-6 md:hidden">
      {places.items.map((place) => (
        <li key={place.id} className="rounded-3xl bg-white p-7">
          <PlaceCard place={place} headingId={`list-${place.id}`} />
        </li>
      ))}
    </ul>
  );
}

export default function CityMap() {
  return (
    <section id="places" className="bg-mist py-24 md:py-30">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-col gap-3.5">
          <TrackLabel track={tracks.places} />
          <SectionTitle>{places.title}</SectionTitle>
        </Reveal>
        <Reveal className="flex flex-col gap-6">
          <InteractiveMap />
          <PlaceList />
        </Reveal>
      </Container>
    </section>
  );
}
