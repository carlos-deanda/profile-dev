import { useRef, useState } from 'react';
import { footer } from '../data/profile';

// One octave, C4 to C5, in pitch order. `midi` drives the frequency,
// `letter` is the computer-keyboard key that plays it (same layout as a DAW).
const NOTES = [
  { name: 'C4', midi: 60, letter: 'a' },
  { name: 'C sharp 4', midi: 61, letter: 'w', black: true, after: 0 },
  { name: 'D4', midi: 62, letter: 's' },
  { name: 'D sharp 4', midi: 63, letter: 'e', black: true, after: 1 },
  { name: 'E4', midi: 64, letter: 'd' },
  { name: 'F4', midi: 65, letter: 'f' },
  { name: 'F sharp 4', midi: 66, letter: 't', black: true, after: 3 },
  { name: 'G4', midi: 67, letter: 'g' },
  { name: 'G sharp 4', midi: 68, letter: 'y', black: true, after: 4 },
  { name: 'A4', midi: 69, letter: 'h' },
  { name: 'A sharp 4', midi: 70, letter: 'u', black: true, after: 5 },
  { name: 'B4', midi: 71, letter: 'j' },
  { name: 'C5', midi: 72, letter: 'k' },
];

const WHITE_COUNT = NOTES.filter((n) => !n.black).length;
const WHITE_WIDTH = 100 / WHITE_COUNT; // percent
const BLACK_WIDTH = 8.5; // percent

// Horizontal placement of every key, computed once.
let whitesSeen = 0;
const LAYOUT = NOTES.map((note) => {
  if (note.black) {
    return {
      left: `${(note.after + 1) * WHITE_WIDTH - BLACK_WIDTH / 2}%`,
      width: `${BLACK_WIDTH}%`,
    };
  }
  const left = `${whitesSeen * WHITE_WIDTH}%`;
  whitesSeen += 1;
  return { left, width: `${WHITE_WIDTH}%` };
});

let audioCtx = null;

// The context is created on the first key press, so the page never makes a sound by itself.
function getContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playNote(midi) {
  const ctx = getContext();
  if (!ctx) return;
  const freq = 440 * 2 ** ((midi - 69) / 12);
  const t = ctx.currentTime;

  // Soft attack, long decay: a plucked-piano feel without samples.
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  env.connect(ctx.destination);

  [
    ['triangle', freq, 1],
    ['sine', freq * 2, 0.3],
  ].forEach(([type, f, level]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    gain.gain.value = level;
    osc.connect(gain).connect(env);
    osc.start(t);
    osc.stop(t + 1.5);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  });
}

export default function Piano() {
  const [pressed, setPressed] = useState(() => new Set());
  const [active, setActive] = useState(0); // roving tabindex: one Tab stop for the whole piano
  const buttons = useRef([]);

  const press = (index) => {
    playNote(NOTES[index].midi);
    setPressed((prev) => new Set(prev).add(index));
  };

  const release = (index) => {
    setPressed((prev) => {
      if (!prev.has(index)) return prev;
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const moveFocus = (index) => {
    const next = Math.min(Math.max(index, 0), NOTES.length - 1);
    setActive(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      moveFocus(Number(e.target.dataset.index) + (e.key === 'ArrowRight' ? 1 : -1));
      return;
    }
    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      moveFocus(e.key === 'Home' ? 0 : NOTES.length - 1);
      return;
    }

    let index = NOTES.findIndex((n) => n.letter === e.key.toLowerCase());
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.index !== undefined) {
      index = Number(e.target.dataset.index);
    }
    if (index === -1) return;
    e.preventDefault();
    if (!e.repeat) press(index);
  };

  const onKeyUp = (e) => {
    let index = NOTES.findIndex((n) => n.letter === e.key.toLowerCase());
    if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.index !== undefined) {
      index = Number(e.target.dataset.index);
    }
    if (index !== -1) release(index);
  };

  return (
    <div
      role="group"
      aria-label={footer.piano.groupLabel}
      className="relative h-[104px] w-full max-w-[320px] select-none"
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={() => setPressed(new Set())}
    >
      {NOTES.map((note, i) => {
        const isPressed = pressed.has(i);

        const look = note.black
          ? `z-10 h-[62%] rounded-b-md ${isPressed ? 'bg-accent' : 'bg-ink'}`
          : `h-full rounded-b-lg border border-line focus-visible:z-20 ${
              isPressed ? 'bg-accent' : 'bg-white'
            }`;

        return (
          <button
            key={note.name}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            data-index={i}
            tabIndex={i === active ? 0 : -1}
            aria-label={`${footer.piano.keyLabel} ${note.name}`}
            onFocus={() => setActive(i)}
            onPointerDown={() => press(i)}
            onPointerUp={() => release(i)}
            onPointerLeave={() => release(i)}
            onPointerCancel={() => release(i)}
            style={LAYOUT[i]}
            className={`absolute top-0 touch-manipulation transition-colors duration-100 outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent ${look}`}
          />
        );
      })}
    </div>
  );
}
