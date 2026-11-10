import { useEffect, useRef, useState } from 'react';
import { voluntappFlow as flow } from '../data/profile';

// All five screens are cut to the same size, so the frame never jumps between steps.
const SHOT_WIDTH = 500;
const SHOT_HEIGHT = 1116;

const outline =
  'min-h-11 rounded-full border border-ink px-5 text-[15px] font-semibold text-ink outline-offset-2 hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink';
const solid =
  'min-h-11 rounded-full bg-accent px-5 text-[15px] font-semibold text-white outline-offset-2 hover:bg-accent-hover hover:text-white focus-visible:outline-2 focus-visible:outline-accent';

// The five steps of an activity, walked through with the app's real screens. All five images
// sit stacked in the same spot (so they load together and switching never flickers) and only
// the current one is visible and exposed to screen readers.
export default function VoluntAppDemo() {
  const [step, setStep] = useState(0);
  const last = flow.steps.length - 1;
  const current = flow.steps[step];
  const title = useRef(null);
  const shownStep = useRef(step);

  // After a step change, move focus to the new step's title so keyboard and screen reader users
  // land on it. Comparing against the step already shown means it never runs on load.
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    title.current?.focus({ preventScroll: true });
  }, [step]);

  return (
    <div
      role="group"
      aria-label={flow.groupLabel}
      className="flex w-full max-w-[340px] flex-col items-center gap-5"
    >
      <div className="w-[250px] overflow-hidden rounded-[36px] border-[7px] border-ink bg-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
        <div
          className="relative overflow-hidden rounded-[29px] bg-white"
          style={{ aspectRatio: `${SHOT_WIDTH} / ${SHOT_HEIGHT}` }}
        >
          {flow.steps.map((s, i) => (
            <img
              key={s.label}
              src={s.image}
              srcSet={`${s.imageSmall} 250w, ${s.image} 500w`}
              sizes="236px"
              alt={s.alt}
              width={SHOT_WIDTH}
              height={SHOT_HEIGHT}
              loading="lazy"
              decoding="async"
              aria-hidden={i !== step}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 motion-reduce:transition-none ${
                i === step ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>

      <ol aria-label={flow.stepsLabel} className="flex flex-wrap justify-center gap-1.5">
        {flow.steps.map((s, i) => (
          <li key={s.label}>
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={i === step ? 'step' : undefined}
              className={`min-h-9 rounded-full px-3 text-[13px] font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-accent ${
                i === step ? 'bg-ink text-white' : 'bg-white text-ink-2 hover:bg-mist'
              }`}
            >
              {i + 1} {s.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="flex min-h-[116px] flex-col gap-2 text-center">
        <h4
          ref={title}
          tabIndex={-1}
          className="text-[19px] leading-tight font-bold tracking-[-0.01em] outline-none"
        >
          {current.title}
        </h4>
        <p className="text-[15px] leading-snug text-ink-2">{current.text}</p>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className={outline}
        >
          {flow.back}
        </button>
        <button
          type="button"
          onClick={() => setStep(step === last ? 0 : step + 1)}
          className={solid}
        >
          {step === last ? flow.restart : flow.next}
        </button>
      </div>

      <p className="max-w-[280px] text-center text-[13px] text-muted">{flow.caption}</p>
    </div>
  );
}
