import { useEffect, useMemo, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { Container } from './ui';
import Reveal from './Reveal';
import { stats } from '../data/profile';

// "5,000+" -> { target: 5000, decimals: 0, grouped: true, suffix: '+' }.
// Anything else returns null and just fades in: ordinals ("1st", "3rd") read wrong while
// counting, and decimals (the GPA) would flash values that aren't real, like 9.37.
function parseStat(value) {
  const match = value.match(/^([\d,]+(?:\.(\d+))?)([+%]?)$/);
  if (!match || match[2]) return null;
  return {
    target: parseFloat(match[1].replace(/,/g, '')),
    decimals: match[2]?.length ?? 0,
    grouped: match[1].includes(','),
    suffix: match[3],
  };
}

function format({ decimals, grouped, suffix }, n) {
  const text = n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
  return text + suffix;
}

// Counts up once when it first appears. The real value is always in the DOM for screen
// readers, and an invisible copy reserves the final width so digits never shift the layout.
function CountUp({ value }) {
  const parsed = useMemo(() => parseStat(value), [value]);
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });

  useEffect(() => {
    if (!parsed || reduced || !inView) return;
    const el = ref.current;
    const duration = 1200;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = format(parsed, parsed.target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [parsed, inView, reduced]);

  if (!parsed || reduced) return value;

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="relative inline-block tabular-nums">
        <span className="invisible">{value}</span>
        <span ref={ref} className="absolute top-0 left-0">
          {format(parsed, 0)}
        </span>
      </span>
    </>
  );
}

export default function Stats() {
  return (
    <section aria-label="Highlights">
      <Container className="pb-28">
        <ul className="grid grid-cols-2 gap-8 border-t border-line pt-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.value} as="li" delay={i * 0.08} className="flex flex-col gap-1.5">
              <p className="text-[clamp(34px,4vw,44px)] leading-none font-bold tracking-[-0.03em]">
                <CountUp value={s.value} />
              </p>
              <p className="text-[15px] leading-snug text-muted">{s.label}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
