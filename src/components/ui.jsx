// Small shared pieces so every section uses the same type scale and container.

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, className = '' }) {
  return (
    <h2
      className={`text-[clamp(40px,5vw,64px)] leading-[1.05] font-bold tracking-[-0.03em] ${className}`}
    >
      {children}
    </h2>
  );
}

export function Eyebrow({ children, accent = false }) {
  return (
    <p
      className={`text-[13px] font-semibold uppercase tracking-[0.08em] ${
        accent ? 'text-accent' : 'text-muted'
      }`}
    >
      {children}
    </p>
  );
}

export function PillLink({ href, children, variant = 'solid', className = '' }) {
  const styles =
    variant === 'solid'
      ? 'bg-accent text-white hover:bg-accent-hover hover:text-white'
      : 'border border-ink text-ink hover:bg-ink hover:text-white';
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center rounded-full px-[26px] text-[17px] font-medium ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

export function TextLink({ href, children }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      className="hover:underline"
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
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
