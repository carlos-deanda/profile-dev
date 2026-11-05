// Small shared pieces so every section uses the same type scale and container.

import EqEcho from './EqEcho';

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, className = '' }) {
  return (
    <div className="flex flex-col gap-4">
      <h2
        className={`text-[clamp(40px,5vw,64px)] leading-[1.05] font-bold tracking-[-0.03em] ${className}`}
      >
        {children}
      </h2>
      <EqEcho />
    </div>
  );
}

export function Eyebrow({ children, accent = false, dark = false }) {
  const color = accent
    ? dark
      ? 'text-accent-on-dark'
      : 'text-accent'
    : dark
      ? 'text-muted-on-dark'
      : 'text-muted';
  return (
    <p className={`text-[13px] font-semibold uppercase tracking-[0.08em] ${color}`}>{children}</p>
  );
}

// Track number above a section title, like a tracklist entry: "01 — Work".
export function TrackLabel({ track, dark = false, className = '' }) {
  return (
    <p
      className={`flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.08em] ${
        dark ? 'text-muted-on-dark' : 'text-muted'
      } ${className}`}
    >
      <span className={`tabular-nums ${dark ? 'text-accent-on-dark' : 'text-accent'}`}>
        {track.number}
      </span>
      <span aria-hidden="true" className={`h-px w-8 ${dark ? 'bg-white/25' : 'bg-line'}`} />
      <span>{track.label}</span>
    </p>
  );
}

export function PillLink({ href, children, variant = 'solid', dark = false, className = '' }) {
  const light = {
    solid: 'bg-accent text-white hover:bg-accent-hover hover:text-white',
    outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  };
  // On dark: dark text on the light accent tint (6:1), since white on it would only be ~3.4:1.
  const night = {
    solid: 'bg-accent-on-dark text-night hover:bg-accent-on-dark-hover hover:text-night',
    outline: 'border border-white/70 text-mist hover:bg-mist hover:text-night',
  };
  const styles = (dark ? night : light)[variant];
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center rounded-full px-[26px] text-[17px] font-medium ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

export function TextLink({ href, children, dark = false }) {
  const newTab = href.startsWith('http') || href.endsWith('.pdf');
  return (
    <a
      href={href}
      className={`hover:underline ${
        dark ? 'text-accent-on-dark hover:text-accent-on-dark-hover' : ''
      }`}
      {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children} ›
    </a>
  );
}

export function ImagePlaceholder({ label, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center bg-placeholder p-6 text-center text-sm text-muted ${className}`}
    >
      [{label}]
    </div>
  );
}
