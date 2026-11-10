import { useCallback, useEffect, useRef } from 'react';
import { useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import { useIsDesktop } from '../hooks/useScrollMotion';
import useClimaxSound from '../hooks/useClimaxSound';
import { createClimaxRenderer, DROP_AT, BARS_BY, LANDING_AT } from '../lib/climaxRenderer';
import { climax } from '../data/profile';

// What the music should be doing at this scroll position: building up, dropping, or landing.
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function soundStateFor(progress) {
  if (progress < DROP_AT)
    return { mode: 'buildup', build: clamp01((progress - 0.04) / (DROP_AT - 0.04)) };
  if (progress < LANDING_AT) return { mode: 'drop', build: 1 };
  return { mode: 'soft', build: 1 };
}

// Wires a canvas to the renderer: sizing (devicePixelRatio is capped at 2 in the renderer),
// and a frame loop that only runs while the scene is on screen. When the music is playing the
// bars follow its spectrum and every bar line fires a burst in that chord's color.
function useClimaxCanvas({ wrapperRef, canvasRef, light, getFrame, loop, sound, progressOut }) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const renderer = createClimaxRenderer({ canvas, palette: climax.palette, light });
    let frameId = 0;
    let visible = false;
    let smoothed = null;
    let spectrum = new Uint8Array(128);

    const paint = (time) => {
      const frame = getFrame();
      // Ease toward the real scroll position so the motion stays fluid on jumpy wheels.
      smoothed = smoothed === null ? frame.progress : smoothed + (frame.progress - smoothed) * 0.18;

      const engine = sound?.engineRef.current;
      const live = Boolean(engine && engine.running && !sound.mutedRef.current);
      if (live) {
        if (spectrum.length !== engine.spectrumSize) spectrum = new Uint8Array(engine.spectrumSize);
        engine.spectrum(spectrum);
        engine.drainChordEvents().forEach((event) => {
          if (event.mode !== 'buildup') {
            renderer.burst(
              event.index % climax.palette.length,
              event.fresh && event.mode === 'drop',
            );
          }
        });
      } else if (engine) {
        engine.drainChordEvents(); // nobody is watching: just keep the queue short
      }

      renderer.draw({
        progress: smoothed,
        time: time / 1000,
        still: !loop,
        spectrum: live ? spectrum : null,
        externalBursts: live,
      });
      progressOut?.set(smoothed);
    };
    const tick = (time) => {
      paint(time);
      frameId = visible ? requestAnimationFrame(tick) : 0;
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
      if (!loop) paint(0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);
    resize();

    let visibility;
    if (loop) {
      visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frameId) frameId = requestAnimationFrame(tick);
      });
      visibility.observe(wrapper);
    }

    return () => {
      visible = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibility?.disconnect();
    };
  }, [wrapperRef, canvasRef, light, getFrame, loop, sound, progressOut]);
}

// Colored light behind the canvas. Plain CSS gradients whose opacity follows the scroll, so
// the browser composites them on the GPU instead of repainting a full-screen canvas.
const alphaHex = (a) =>
  Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');
const [coral, orange, yellow, aqua] = climax.palette;
const BUILD_GLOW = `radial-gradient(circle 46vmax at 50% 66%, ${coral}${alphaHex(0.34)}, transparent 100%)`;
// Each color owns its own corner so they don't pile up into mud in the middle.
const PARTY_GLOW = [
  `radial-gradient(circle 52vmax at 8% 20%, ${coral}${alphaHex(0.4)}, transparent 100%)`,
  `radial-gradient(circle 52vmax at 92% 20%, ${aqua}${alphaHex(0.36)}, transparent 100%)`,
  `radial-gradient(circle 40vmax at 50% 104%, ${orange}${alphaHex(0.34)}, transparent 100%)`,
  `radial-gradient(circle 34vmax at 50% 16%, ${yellow}${alphaHex(0.26)}, transparent 100%)`,
].join(', ');

function Glows({ build, party, flash, fade }) {
  return (
    <M.div
      aria-hidden="true"
      style={{ opacity: fade }}
      className="pointer-events-none absolute inset-0"
    >
      <M.div style={{ opacity: build, background: BUILD_GLOW }} className="absolute inset-0" />
      <M.div style={{ opacity: party, background: PARTY_GLOW }} className="absolute inset-0" />
      {/* The drop: one soft, brief wash of light that eases out right away. */}
      <M.div style={{ opacity: flash }} className="absolute inset-0 bg-[#fff4e8]" />
    </M.div>
  );
}

// One colorful frame of the drop, for the reduced-motion version.
const stillFrame = () => ({ progress: 0.56 });

function SpeakerIcon({ muted }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      )}
    </svg>
  );
}

// "Play with sound" before the music starts, then a mute button while it plays.
function SoundControl({ sound }) {
  const copy = climax.sound;
  const base =
    'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent-on-dark';
  return (
    <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 px-6 md:bottom-8">
      {sound.status === 'on' ? (
        <button
          type="button"
          onClick={sound.toggleMute}
          className={`${base} border border-white/70 text-mist hover:bg-mist hover:text-night`}
        >
          <SpeakerIcon muted={sound.muted} />
          {sound.muted ? copy.unmute : copy.mute}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={sound.play}
            disabled={sound.status === 'loading'}
            className={`${base} bg-accent-on-dark text-night hover:bg-accent-on-dark-hover disabled:opacity-70`}
          >
            <SpeakerIcon />
            {sound.status === 'loading' ? copy.loading : copy.play}
          </button>
          <p className="max-w-[320px] text-center text-[13px] text-muted-on-dark">{copy.hint}</p>
        </>
      )}
      {/* Announces the state to screen readers without moving focus. */}
      <span role="status" className="sr-only">
        {sound.status === 'on' ? (sound.muted ? copy.statusMuted : copy.statusOn) : ''}
      </span>
    </div>
  );
}

function Line({ style }) {
  return (
    <M.p
      style={style}
      className="pointer-events-none absolute inset-x-0 top-[16%] px-6 text-center text-[clamp(32px,6.4vw,84px)] leading-[1.02] font-bold tracking-[-0.035em] text-mist"
    >
      {climax.line}
    </M.p>
  );
}

// When the timeline runs: from the moment the scene enters until its bottom reaches
// mid-screen, so the keys are already fading in as it slides up and the fade-out happens while
// it leaves, instead of a screen of empty black at each end. With the current heights (250vh
// desktop, 240vh phones) the scene is pinned from about 0.33 to 0.83, so the drop (0.45)
// always happens while it is pinned.
const TIMELINE_OFFSET = ['start end', 'end 0.5'];

function PinnedClimax({ light }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: TIMELINE_OFFSET,
  });
  const sound = useClimaxSound(stageRef);
  const { stateRef, engineRef, mutedRef } = sound;

  // What the visuals show. It is the scroll position, except for one thing: with the music on,
  // the drop waits for the next bar line (the keys sit at full tension), so the picture and the
  // sound land together.
  const shown = useMotionValue(0);
  const getFrame = useCallback(() => {
    const raw = scrollYProgress.get();
    stateRef.current = soundStateFor(raw);
    const engine = engineRef.current;
    const waitingForTheBar =
      engine &&
      engine.running &&
      !mutedRef.current &&
      raw >= DROP_AT &&
      engine.audibleMode() === 'buildup';
    return { progress: waitingForTheBar ? Math.min(raw, DROP_AT - 0.004) : raw };
  }, [scrollYProgress, stateRef, engineRef, mutedRef]);
  useClimaxCanvas({
    wrapperRef: stageRef,
    canvasRef,
    light,
    getFrame,
    loop: true,
    sound,
    progressOut: shown,
  });

  const buildGlow = useTransform(shown, [0.1, DROP_AT - 0.02, BARS_BY], [0, 1, 0]);
  const partyGlow = useTransform(shown, [DROP_AT, BARS_BY], [0, 1]);
  const flash = useTransform(shown, [DROP_AT - 0.02, DROP_AT, DROP_AT + 0.05], [0, 0.2, 0]);
  const fade = useTransform(shown, [0.86, 1], [1, 0]);
  const lineOpacity = useTransform(
    shown,
    [DROP_AT + 0.04, DROP_AT + 0.11, 0.8, 0.88],
    [0, 1, 1, 0],
  );
  const lineY = useTransform(shown, [DROP_AT + 0.04, DROP_AT + 0.11, 0.8, 0.88], [28, 0, 0, -18]);

  return (
    <section
      ref={sectionRef}
      aria-label={climax.sectionLabel}
      className={`relative bg-night text-mist ${light ? 'h-[240vh]' : 'h-[250vh]'}`}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        <Glows build={buildGlow} party={partyGlow} flash={flash} fade={fade} />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <Line style={{ opacity: lineOpacity, y: lineY }} />
        <SoundControl sound={sound} />
      </div>
    </section>
  );
}

// prefers-reduced-motion: no pinning, no vibration, no movement: one colorful frame of the drop.
function StillClimax({ light }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  useClimaxCanvas({ wrapperRef: stageRef, canvasRef, light, getFrame: stillFrame, loop: false });
  const sound = useClimaxSound(stageRef);

  return (
    <section aria-label={climax.sectionLabel} className="bg-night py-10 text-mist">
      <div
        ref={stageRef}
        className="relative mx-auto h-[70vh] min-h-[420px] w-full max-w-[1120px] overflow-hidden"
      >
        <Glows build={0} party={1} flash={0} fade={1} />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <p className="absolute inset-x-0 top-[16%] px-6 text-center text-[clamp(32px,6.4vw,84px)] leading-[1.02] font-bold tracking-[-0.035em]">
          {climax.line}
        </p>
        <SoundControl sound={sound} />
      </div>
    </section>
  );
}

export default function ClimaxScene() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  return reduced ? <StillClimax light={!isDesktop} /> : <PinnedClimax light={!isDesktop} />;
}
