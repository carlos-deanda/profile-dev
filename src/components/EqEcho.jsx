import { climax } from '../data/profile';

// A tiny equalizer under each section title: the echo of the climax scene. Pure CSS
// (only `transform` animates, see `.eq-echo` in index.css); it stands still with
// prefers-reduced-motion. Decorative, so it is hidden from screen readers.
const HEIGHTS = [0.55, 0.9, 0.4, 1, 0.65, 0.8, 0.45];

export default function EqEcho({ className = '' }) {
  return (
    <span aria-hidden="true" className={`eq-echo ${className}`}>
      {HEIGHTS.map((height, i) => (
        <span
          key={i}
          style={{
            height: `${height * 100}%`,
            '--eq-color': climax.palette[i % climax.palette.length],
            '--eq-delay': `${-i * 0.37}s`,
            '--eq-duration': `${0.9 + (i % 3) * 0.25}s`,
          }}
        />
      ))}
    </span>
  );
}
