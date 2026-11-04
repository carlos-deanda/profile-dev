import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import * as M from 'motion/react-m';
import { voluntappDemo as demo } from '../data/profile';

// A decorative QR-looking grid: three finder squares plus a fixed pseudo-random fill.
// It is not a real code and cannot be scanned.
const QR_SIZE = 21;
const QR_CELLS = (() => {
  const cells = [];
  const inFinder = (x, y) =>
    [
      [0, 0],
      [14, 0],
      [0, 14],
    ].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  const finder = (x, y) => {
    const [fx, fy] = [
      [0, 0],
      [14, 0],
      [0, 14],
    ].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
    const dx = x - fx;
    const dy = y - fy;
    const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
    return ring !== 2;
  };
  let seed = 7;
  for (let y = 0; y < QR_SIZE; y += 1) {
    for (let x = 0; x < QR_SIZE; x += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const on = inFinder(x, y) ? finder(x, y) : seed % 100 < 46;
      if (on) cells.push([x, y]);
    }
  }
  return cells;
})();

function FakeQr() {
  return (
    <svg
      viewBox={`-1 -1 ${QR_SIZE + 2} ${QR_SIZE + 2}`}
      role="img"
      aria-label={demo.checkin.qrLabel}
      className="h-[150px] w-[150px] rounded-lg bg-white"
      shapeRendering="crispEdges"
    >
      {QR_CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="fill-ink" />
      ))}
    </svg>
  );
}

const primary =
  'min-h-11 w-full rounded-full bg-accent px-4 text-[15px] font-semibold text-white outline-offset-2 hover:bg-accent-hover hover:text-white focus-visible:outline-2 focus-visible:outline-accent';

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line py-2 text-[13px]">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

export default function VoluntAppDemo() {
  const [step, setStep] = useState(0);
  const [activityId, setActivityId] = useState(demo.activities[0].id);
  const activity = demo.activities.find((a) => a.id === activityId);
  const reduced = useReducedMotion();
  const heading = useRef(null);
  const shownStep = useRef(step);

  // After a screen change, put focus on the new screen's title so keyboard and screen
  // reader users land on it. Comparing against the step already shown means it never runs
  // on load (not even when React re-runs effects in development), so the page never
  // steals focus.
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next) => setStep(next);
  const choose = (id) => {
    setActivityId(id);
    go(1);
  };

  const Screen = reduced ? 'div' : M.div;
  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, x: 12 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.25 },
      };

  const title = [demo.offers.title, activity.title, demo.signup.title, demo.checkin.title][step];

  return (
    <div role="group" aria-label={demo.groupLabel} className="flex flex-col items-center gap-4">
      <div className="relative h-[500px] w-[250px] overflow-hidden rounded-[36px] border-[7px] border-ink bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
        <div
          aria-hidden="true"
          className="absolute top-2 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-ink/80"
        />
        <Screen
          key={step}
          className="flex h-full flex-col gap-3 overflow-y-auto px-4 pt-8 pb-5"
          {...motionProps}
        >
          <div className="flex min-h-8 items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => go(step === 3 ? 0 : step - 1)}
                className="-ml-1 rounded-full px-2 py-1 text-[13px] font-semibold text-accent outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent"
              >
                ‹ {demo.back}
              </button>
            ) : (
              <span />
            )}
            <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-ink-2">
              {demo.badge}
            </span>
          </div>

          <h4
            ref={heading}
            tabIndex={-1}
            className="text-[22px] leading-tight font-bold tracking-[-0.02em] outline-none"
          >
            {title}
          </h4>

          {step === 0 && (
            <>
              <p className="text-[13px] text-muted">{demo.offers.hint}</p>
              <ul className="flex flex-col gap-2.5">
                {demo.activities.map((a) => (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => choose(a.id)}
                      className="flex w-full flex-col gap-0.5 rounded-2xl bg-mist p-3 text-left outline-offset-2 hover:bg-placeholder focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="text-[15px] font-semibold text-ink">{a.title}</span>
                      <span className="text-[12px] text-ink-2">
                        {a.when} · {a.place}
                      </span>
                      <span className="text-[12px] font-semibold text-accent">
                        {a.spots} {demo.offers.spotsLeft}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-[13px] leading-snug text-ink-2">{activity.description}</p>
              <dl>
                <Row label={demo.detail.when} value={activity.when} />
                <Row label={demo.detail.where} value={activity.place} />
                <Row label={demo.detail.hours} value={`${activity.hours} h`} />
                <Row label={demo.detail.spots} value={activity.spots} />
              </dl>
              <button type="button" onClick={() => go(2)} className={`${primary} mt-auto`}>
                {demo.detail.cta}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="rounded-2xl bg-mist p-3">
                <p className="text-[15px] font-semibold text-ink">{activity.title}</p>
                <p className="text-[12px] text-ink-2">
                  {activity.when} · {activity.place}
                </p>
              </div>
              <dl>
                <Row label={demo.signup.volunteerLabel} value={demo.signup.volunteer} />
                <Row label={demo.detail.hours} value={`${activity.hours} h`} />
              </dl>
              <button type="button" onClick={() => go(3)} className={`${primary} mt-auto`}>
                {demo.signup.cta}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-[13px] text-ink-2">{demo.checkin.hint}</p>
              <div className="mx-auto flex flex-col items-center gap-2">
                <FakeQr />
                <p className="text-[11px] text-muted">{demo.checkin.qrCaption}</p>
              </div>
              <button type="button" onClick={() => go(0)} className={`${primary} mt-auto`}>
                {demo.checkin.done}
              </button>
            </>
          )}
        </Screen>
      </div>

      <ol aria-label={demo.stepsLabel} className="flex flex-wrap justify-center gap-1.5">
        {demo.steps.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === step ? 'step' : undefined}
              className={`min-h-9 rounded-full px-3 text-[13px] font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent ${
                i === step ? 'bg-ink text-white' : 'bg-white text-ink-2 hover:bg-mist'
              }`}
            >
              {i + 1} {label}
            </button>
          </li>
        ))}
      </ol>
      <p className="max-w-[260px] text-center text-[13px] text-muted">{demo.caption}</p>
    </div>
  );
}
