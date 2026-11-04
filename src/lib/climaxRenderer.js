// Canvas drawing for the climax scene (keys, bars, code lines, circuit traces, particles).
// No React in here: the component hands over the scroll progress (0..1 across the whole
// scene) and a clock, and this draws one frame. The colored light behind the canvas is CSS
// (see ClimaxScene), which the browser composites for free.
//
// Timeline (progress):
//   0.02-0.12  the piano keys fade in alone
//   0.10-0.45  build-up: they glow and vibrate more and more
//   0.45       DROP: black keys pop away, white keys lift and become bars, first big burst
//   0.45-0.58  keys -> equalizer bars; more bursts of light as you keep scrolling
//   0.60-0.74  the bars lie down and become lines of code
//   0.70-0.84  circuit traces draw out from the lines to rails on both sides
//   0.86-1.00  everything calms and fades out as Work comes in

export const DROP_AT = 0.45;
export const BARS_BY = 0.58; // the keys have fully become bars by here
export const LANDING_AT = 0.8; // everything calms; the music drops to its soft loop

// Forward-scroll thresholds that fire a burst of light, and the palette color each one uses.
// With sound on, chord changes fire the bursts instead (see `burst` and `externalBursts`).
const BURSTS = [
  { at: 0.452, color: 0, big: true },
  { at: 0.5, color: 1 },
  { at: 0.565, color: 3 },
  { at: 0.635, color: 2 },
  { at: 0.7, color: 0 },
];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

const KEY_WHITE = [245, 245, 247];
const KEY_BLACK = [11, 11, 13];
const RAIL = [161, 161, 166];
// Black keys sit after these white keys, in a repeating group of 7 (C D E F G A B).
const BLACK_AFTER = [true, true, false, true, true, true, false];
// What the bars become: widths (% of the block) and indents (in steps) of the code lines.
const CODE_WIDTH = [46, 70, 54, 78, 38, 62, 30];
const CODE_INDENT = [0, 1, 1, 2, 2, 1, 0];

export function createClimaxRenderer({ canvas, palette, light = false }) {
  const ctx = canvas.getContext('2d');
  const colors = palette.map(hexToRgb);
  const whiteCount = light ? 9 : 15;
  let w = 0;
  let h = 0;

  // Particle pool: fixed size, reused, so nothing is allocated while animating.
  const capacity = light ? 260 : 720;
  const px = new Float32Array(capacity);
  const py = new Float32Array(capacity);
  const pvx = new Float32Array(capacity);
  const pvy = new Float32Array(capacity);
  const plife = new Float32Array(capacity);
  const pmax = new Float32Array(capacity);
  const psize = new Float32Array(capacity);
  const pcolor = new Uint8Array(capacity);
  let cursor = 0;
  let live = 0;

  let lastTime = null;
  let lastProgress = null;
  // Where the bar tops are this frame, used as the origin of the big burst.
  const barTopX = new Float32Array(whiteCount);
  const barTopY = new Float32Array(whiteCount);

  function resize(width, height) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = width;
    h = height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function roundedRect(x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, width, height, r);
    else ctx.rect(x, y, width, height);
  }

  function clearParticles() {
    plife.fill(0);
    live = 0;
  }

  function emit(x, y, colorIndex, speed) {
    const i = cursor;
    cursor = (cursor + 1) % capacity;
    const angle = Math.random() * Math.PI * 2;
    const v = speed * (0.35 + Math.random() * 0.65);
    px[i] = x;
    py[i] = y;
    pvx[i] = Math.cos(angle) * v;
    pvy[i] = Math.sin(angle) * v - speed * 0.25; // a little upward bias
    pmax[i] = plife[i] = 0.9 + Math.random() * 0.9;
    psize[i] = (light ? 1.5 : 1.8) + Math.random() * (light ? 2.4 : 3);
    // Mostly the burst's own color, with some from the rest of the palette.
    pcolor[i] = Math.random() < 0.65 ? colorIndex : Math.floor(Math.random() * colors.length);
    live = Math.min(capacity, live + 1);
  }

  // A burst of light. `big` fires from the top of every bar; the others from a random spot.
  function burst(colorIndex, big = false) {
    const speed = big ? 560 : 440;
    if (big) {
      const perBar = light ? 3 : 6;
      for (let i = 0; i < whiteCount; i += 1) {
        for (let k = 0; k < perBar; k += 1)
          emit(barTopX[i], barTopY[i], (colorIndex + i) % colors.length, speed);
      }
      return;
    }
    const count = light ? 26 : 64;
    const cx = w * (0.2 + Math.random() * 0.6);
    const cy = h * (0.3 + Math.random() * 0.35);
    for (let k = 0; k < count; k += 1) emit(cx, cy, colorIndex, speed);
  }

  function drawParticles(dt) {
    if (live === 0) return;
    const drag = Math.exp(-1.7 * dt);
    ctx.globalCompositeOperation = 'lighter';
    let alive = 0;
    for (let i = 0; i < capacity; i += 1) {
      if (plife[i] <= 0) continue;
      plife[i] -= dt;
      if (plife[i] <= 0) continue;
      alive += 1;
      pvx[i] *= drag;
      pvy[i] = pvy[i] * drag + 380 * dt;
      px[i] += pvx[i] * dt;
      py[i] += pvy[i] * dt;
      const k = Math.pow(plife[i] / pmax[i], 0.7);
      const c = colors[pcolor[i]];
      const r = psize[i] * (0.5 + 0.5 * k);
      ctx.fillStyle = rgba(c, 0.95 * k);
      ctx.beginPath();
      ctx.arc(px[i], py[i], r, 0, 6.2832);
      ctx.fill();
      if (i % 3 === 0) {
        ctx.fillStyle = rgba(c, 0.16 * k);
        ctx.beginPath();
        ctx.arc(px[i], py[i], r * 3.2, 0, 6.2832);
        ctx.fill();
      }
    }
    live = alive;
    ctx.globalCompositeOperation = 'source-over';
  }

  // Turns the analyser's frequency bins into one 0..1 value per bar: low bars listen to the
  // kick and bass, high bars to the highs (log spaced, never sharing a bin). Each bar is
  // normalized against its own recent peak, so every bar dances instead of the loud ones
  // sitting at the top.
  const peaks = new Float32Array(whiteCount).fill(0.2);
  let edges = null;
  let edgesFor = 0;
  function spectrumFor(spectrum, i) {
    if (edgesFor !== spectrum.length) {
      const top = Math.floor(spectrum.length * 0.45); // about 10 kHz
      edges = [1];
      for (let k = 1; k <= whiteCount; k += 1) {
        edges.push(Math.max(edges[k - 1] + 1, Math.round(top ** (k / whiteCount))));
      }
      edgesFor = spectrum.length;
    }
    let sum = 0;
    for (let k = edges[i]; k < edges[i + 1]; k += 1) sum += spectrum[k];
    const value = sum / (edges[i + 1] - edges[i]) / 255;
    peaks[i] = Math.max(value, peaks[i] * 0.994, 0.12);
    return clamp((value / peaks[i]) ** 1.8);
  }

  // `still` draws one calm frame (no vibration, no particles), used for prefers-reduced-motion.
  // `spectrum` (analyser bytes) makes the bars follow the real music; without it they follow the
  // scroll. `externalBursts` means the audio fires the bursts, so the scroll thresholds stay quiet.
  function draw({ progress: p, time: t, still = false, spectrum = null, externalBursts = false }) {
    ctx.clearRect(0, 0, w, h);
    const dt = lastTime === null ? 0 : Math.min(0.05, Math.max(0, t - lastTime));
    lastTime = t;

    const fadeOut = 1 - smooth(0.86, 1, p);
    if (fadeOut <= 0.001) {
      clearParticles();
      lastProgress = p;
      return;
    }
    ctx.globalAlpha = fadeOut;

    const enter = smooth(0.02, 0.12, p);
    const build = smooth(0.1, DROP_AT, p);
    const drop = smooth(DROP_AT, BARS_BY, p);
    const drift = still ? 0 : t;

    // Layout: keys sit on a baseline in the lower part of the screen, leaving the top for the line.
    const stageW = Math.min(w * 0.92, light ? w : 980);
    const keyW = stageW / whiteCount;
    const left = (w - stageW) / 2;
    const keyH = h * (light ? 0.24 : 0.3);
    const baseY = h * 0.78;
    const maxBar = h * (light ? 0.34 : 0.4);
    // The code block the bars lie down into, with a circuit rail on each side.
    const blockW = light ? Math.min(w * 0.64, 280) : Math.min(w * 0.46, 520);
    const blockLeft = (w - blockW) / 2;
    const blockTop = h * 0.36;
    const blockBottom = h * (light ? 0.76 : 0.8);
    const rowGap = (blockBottom - blockTop) / (whiteCount - 1);
    const rowH = light ? 8 : 11;
    const railL = blockLeft - (light ? 22 : 40);
    const railR = blockLeft + blockW + (light ? 22 : 40);

    // Vibration grows with the build-up and eases off once the keys have become bars.
    const shake = (light ? 2 : 3.2) * build * build * (1 - drop * 0.85) * (still ? 0 : 1);
    // Bar heights follow scroll position until the bars start lying down, then they freeze.
    const pb = Math.min(p, 0.6);

    // White keys, which become bars, which become lines of code.
    for (let i = 0; i < whiteCount; i += 1) {
      const dx = Math.sin(drift * 58 + i * 1.9) * shake * 0.5;
      const dy = Math.sin(drift * 47 + i * 2.7) * shake;

      // A made-up "spectrum" driven by scroll position (real audio replaces it later).
      const s = spectrum
        ? spectrumFor(spectrum, i)
        : 0.35 + 0.65 * Math.abs(Math.sin(pb * 55 + i * 0.8) * Math.cos(pb * 23 - i * 0.45));
      const barH = maxBar * (0.28 + 0.72 * s);

      let width = lerp(keyW - 3, keyW * 0.58, drop);
      let height = lerp(keyH, barH, drop);
      let cx = left + (i + 0.5) * keyW + dx;
      let cy = baseY - drop * h * 0.05 + dy - height / 2;
      barTopX[i] = cx;
      barTopY[i] = cy - height / 2;

      // Bars -> lines of code: each bar lies down into its own row, a little after the one before.
      const lie = smooth(0.6 + i * 0.003, 0.74 + i * 0.003, p);
      if (lie > 0) {
        const rowW = (blockW * CODE_WIDTH[i % 7]) / 100;
        const rowLeft = blockLeft + CODE_INDENT[i % 7] * blockW * 0.07;
        width = lerp(width, rowW, lie);
        height = lerp(height, rowH, lie);
        cx = lerp(cx, rowLeft + rowW / 2, lie);
        cy = lerp(cy, blockTop + i * rowGap, lie);
      }

      const color = mix(KEY_WHITE, colors[i % colors.length], drop);
      ctx.fillStyle = rgba(color, enter);
      roundedRect(cx - width / 2, cy - height / 2, width, height, lerp(7, 99, drop));
      ctx.fill();

      // Circuit traces: from the end of each line out to a rail, even rows right, odd rows left.
      const trace = smooth(0.7 + i * 0.004, 0.79 + i * 0.004, p);
      if (trace > 0.001) {
        const toRight = i % 2 === 0;
        const startX = toRight ? cx + width / 2 : cx - width / 2;
        const endX = lerp(startX, toRight ? railR : railL, trace);
        ctx.strokeStyle = rgba(colors[i % colors.length], 0.85);
        ctx.lineWidth = light ? 1.5 : 2;
        ctx.beginPath();
        ctx.moveTo(startX, cy);
        ctx.lineTo(endX, cy);
        ctx.stroke();
        if (trace > 0.98) {
          ctx.fillStyle = rgba(colors[i % colors.length], 1);
          ctx.beginPath();
          ctx.arc(toRight ? railR : railL, cy, light ? 3 : 4, 0, 6.2832);
          ctx.fill();
        }
      }
    }

    // The two rails the traces connect to, drawn top to bottom.
    const rail = smooth(0.72, 0.84, p);
    if (rail > 0.001) {
      ctx.strokeStyle = rgba(RAIL, 0.55);
      ctx.lineWidth = light ? 1.5 : 2;
      ctx.beginPath();
      ctx.moveTo(railL, blockTop - 14);
      ctx.lineTo(railL, lerp(blockTop - 14, blockBottom + 14, rail));
      ctx.moveTo(railR, blockTop - 14);
      ctx.lineTo(railR, lerp(blockTop - 14, blockBottom + 14, rail));
      ctx.stroke();
    }

    // Black keys: they pop away at the drop.
    const blackAlpha = enter * (1 - smooth(DROP_AT, DROP_AT + 0.05, p));
    if (blackAlpha > 0.01) {
      for (let i = 0; i < whiteCount - 1; i += 1) {
        if (!BLACK_AFTER[i % 7]) continue;
        const dx = Math.sin(drift * 58 + i * 1.9 + 1) * shake * 0.5;
        const dy = Math.sin(drift * 47 + i * 2.7 + 1) * shake;
        const width = keyW * 0.6;
        const height = keyH * 0.6 * (1 - smooth(DROP_AT, DROP_AT + 0.05, p) * 0.4);
        ctx.fillStyle = rgba(KEY_BLACK, blackAlpha);
        roundedRect(left + (i + 1) * keyW - width / 2 + dx, baseY - keyH + dy, width, height, 4);
        ctx.fill();
      }
    }

    // Baseline, which appears with the bars and goes away as they lie down.
    const baseline = drop * (1 - smooth(0.6, 0.68, p));
    if (baseline > 0.01) {
      ctx.fillStyle = rgba(colors[0], 0.5 * baseline);
      ctx.fillRect(left, baseY - drop * h * 0.05 + 6, stageW, 2);
    }

    // Light bursts and particles (not in the reduced-motion frame).
    if (!still) {
      if (!externalBursts && lastProgress !== null && p > lastProgress) {
        BURSTS.forEach((b) => {
          if (lastProgress < b.at && p >= b.at) burst(b.color, b.big);
        });
      }
      if (p < DROP_AT - 0.02) clearParticles(); // scrolled back above the drop: start over
      drawParticles(dt);
    }
    lastProgress = p;

    ctx.globalAlpha = 1;
  }

  return { resize, draw, burst };
}
