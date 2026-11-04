import { useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import { Container, Eyebrow } from './ui';
import useScrollMotion from '../hooks/useScrollMotion';
import { leap } from '../data/profile';

/* ------------------------------------------------------------------ */
/* Art. Three drawings, one idea: the same line goes from sound to code. */
/* They are plain markup; the pinned version passes MotionValues in.     */
/* ------------------------------------------------------------------ */

const BAR_HEIGHTS = Array.from({ length: 64 }, (_, i) =>
  Math.round(16 + 70 * Math.abs(Math.sin(i * 0.55) * Math.sin(i * 0.17 + 1))),
);

function WaveArt({ x }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <M.div style={{ x }} className="flex h-full w-[200%] items-center gap-[0.9%]">
        {BAR_HEIGHTS.map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 rounded-full bg-muted-on-dark/70"
          />
        ))}
      </M.div>
      {/* the playhead */}
      <div className="absolute inset-y-[8%] left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-accent-on-dark" />
    </div>
  );
}

const FORK = {
  stem: 'M20 195 H200',
  top: 'M200 195 C280 195 280 110 360 110 H500',
  bottom: 'M200 195 C280 195 280 280 360 280 H500',
};

function ForkLine({ d, className, style }) {
  return (
    <M.svg
      viewBox="0 0 520 390"
      aria-hidden="true"
      style={style}
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </M.svg>
  );
}

function ForkArt({ topOpacity = 0.35, accentOpacity = 1 }) {
  return (
    <div className="relative h-full w-full">
      <ForkLine d={FORK.stem} className="text-muted-on-dark" />
      <ForkLine d={FORK.top} className="text-muted-on-dark" style={{ opacity: topOpacity }} />
      <ForkLine d={FORK.bottom} className="text-muted-on-dark" />
      <ForkLine d={FORK.bottom} className="text-accent-on-dark" style={{ opacity: accentOpacity }} />
      <svg viewBox="0 0 520 390" aria-hidden="true" className="absolute inset-0 h-full w-full">
        <circle cx="200" cy="195" r="6" className="fill-accent-on-dark" />
      </svg>
    </div>
  );
}

const CODE_LINES = [
  { indent: 0, width: 46, accent: true },
  { indent: 1, width: 70 },
  { indent: 1, width: 54 },
  { indent: 2, width: 78 },
  { indent: 2, width: 38, accent: true },
  { indent: 1, width: 62 },
  { indent: 0, width: 30 },
];

function CodeLine({ line, scaleX }) {
  return (
    <div style={{ marginLeft: `${line.indent * 7}%`, width: `${line.width}%` }}>
      <M.div
        style={{ scaleX, originX: 0 }}
        className={`h-2.5 rounded-full ${line.accent ? 'bg-accent-on-dark' : 'bg-muted-on-dark/60'}`}
      />
    </div>
  );
}

function CodeArt({ scales }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8">
      {CODE_LINES.map((line, i) => (
        <CodeLine key={i} line={line} scaleX={scales?.[i]} />
      ))}
    </div>
  );
}

function Stage({ children, className = '' }) {
  return (
    <div aria-hidden="true" className={`relative aspect-[4/3] w-full max-w-[520px] ${className}`}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pinned version (desktop). CSS `position: sticky` does the pinning, */
/* so scrolling is always the browser's own. Only transform + opacity */
/* are animated.                                                      */
/* ------------------------------------------------------------------ */

const STEP_KEYFRAMES = [
  { t: [0, 0.25, 0.33], o: [1, 1, 0], y: [0, 0, -16] },
  { t: [0.28, 0.38, 0.62, 0.7], o: [0, 1, 1, 0], y: [16, 0, 0, -16] },
  { t: [0.65, 0.75, 1], o: [0, 1, 1], y: [16, 0, 0] },
];

function PinnedStep({ progress, keyframes, step }) {
  const opacity = useTransform(progress, keyframes.t, keyframes.o);
  const y = useTransform(progress, keyframes.t, keyframes.y);
  return (
    <M.div style={{ opacity, y }} className="col-start-1 row-start-1 flex flex-col gap-4">
      <Eyebrow accent dark>
        {step.label}
      </Eyebrow>
      <p className="text-[clamp(22px,2.5vw,32px)] leading-[1.25] font-semibold tracking-[-0.02em]">
        {step.text}
      </p>
    </M.div>
  );
}

function PinnedCodeLine({ progress, index }) {
  const start = 0.7 + index * 0.04;
  const scaleX = useTransform(progress, [start, start + 0.08], [0, 1], { clamp: true });
  return <CodeLine line={CODE_LINES[index]} scaleX={scaleX} />;
}

function PinnedScene() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const waveOpacity = useTransform(p, [0, 0.25, 0.36], [1, 1, 0]);
  const waveX = useTransform(p, [0, 0.36], ['0%', '-30%']);
  const forkOpacity = useTransform(p, [0.28, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const topOpacity = useTransform(p, [0.5, 0.62], [1, 0.25]);
  const accentOpacity = useTransform(p, [0.5, 0.62], [0, 1]);
  const codeOpacity = useTransform(p, [0.65, 0.77], [0, 1]);
  const progressBar = useTransform(p, [0, 1], [0, 1]);

  return (
    <section ref={ref} aria-label={leap.sectionLabel} className="relative h-[300vh] bg-night text-mist">
      <div className="sticky top-0 flex h-screen flex-col justify-center pt-[52px]">
        <Container className="grid items-center gap-16 md:grid-cols-2">
          <div className="grid">
            {leap.steps.map((step, i) => (
              <PinnedStep key={step.label} progress={p} keyframes={STEP_KEYFRAMES[i]} step={step} />
            ))}
          </div>

          <Stage className="justify-self-end">
            <M.div style={{ opacity: waveOpacity }} className="absolute inset-0">
              <WaveArt x={waveX} />
            </M.div>
            <M.div style={{ opacity: forkOpacity }} className="absolute inset-0">
              <ForkArt topOpacity={topOpacity} accentOpacity={accentOpacity} />
            </M.div>
            <M.div style={{ opacity: codeOpacity }} className="absolute inset-0">
              <div className="flex h-full w-full flex-col justify-center gap-4 rounded-2xl border border-white/15 bg-white/[0.03] p-8">
                {CODE_LINES.map((_, i) => (
                  <PinnedCodeLine key={i} progress={p} index={i} />
                ))}
              </div>
            </M.div>
          </Stage>
        </Container>

        <Container className="absolute inset-x-0 bottom-10">
          <div className="h-px w-full bg-white/15">
            <M.div style={{ scaleX: progressBar, originX: 0 }} className="h-px w-full bg-accent-on-dark" />
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked version: phones and prefers-reduced-motion. Nothing moves, */
/* everything is visible right away.                                   */
/* ------------------------------------------------------------------ */

function StackedScene() {
  const arts = [<WaveArt key="wave" />, <ForkArt key="fork" />, <CodeArt key="code" />];
  return (
    <section aria-label={leap.sectionLabel} className="bg-night py-24 text-mist">
      <Container className="flex flex-col gap-16">
        <Eyebrow accent dark>
          {leap.eyebrow}
        </Eyebrow>
        {leap.steps.map((step, i) => (
          <div key={step.label} className="flex flex-col gap-6">
            <Stage className="max-w-[360px]">{arts[i]}</Stage>
            <div className="flex flex-col gap-3">
              <Eyebrow accent dark>
                {step.label}
              </Eyebrow>
              <p className="text-[22px] leading-[1.3] font-semibold tracking-[-0.02em]">{step.text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function LeapScene() {
  return useScrollMotion() ? <PinnedScene /> : <StackedScene />;
}
