// Simplified diagram of the Enterprise Campus Network, drawn in HTML so the text stays
// readable on phones. Every label comes from `diagram` in src/data/profile.js (the project's
// real figures); it shows the layers, not the exact topology.

function Connector() {
  return <div aria-hidden="true" className="mx-auto h-4 w-px bg-accent/40" />;
}

function Node({ label, detail }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <p className="text-[12px] font-semibold tracking-[0.04em] text-muted uppercase">{label}</p>
      <p className="text-[15px] leading-snug font-semibold text-ink">{detail}</p>
    </div>
  );
}

export default function NetworkDiagram({ diagram }) {
  return (
    <figure className="flex w-full max-w-[380px] flex-col">
      <ol className="flex flex-col" aria-label={diagram.label}>
        {diagram.layers.map((layer, i) => (
          <li key={layer.label}>
            {i > 0 && <Connector />}
            <Node label={layer.label} detail={layer.detail} />
          </li>
        ))}
        <li>
          <Connector />
          <div className="rounded-2xl border border-dashed border-line px-4 py-3 text-center">
            <p className="text-[12px] font-semibold tracking-[0.04em] text-muted uppercase">
              {diagram.vlans.label}
            </p>
            <ul className="mt-2 flex flex-wrap justify-center gap-1.5" aria-label="Services">
              {diagram.vlans.services.map((s) => (
                <li key={s} className="rounded-full bg-white px-2.5 py-1 text-[13px] text-ink-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </li>
        <li>
          <Connector />
          <div className="grid grid-cols-2 gap-2">
            {diagram.edge.map((e) => (
              <Node key={e.label} label={e.label} detail={e.detail} />
            ))}
          </div>
        </li>
      </ol>
      <figcaption className="mt-4 text-center text-[13px] text-muted">{diagram.caption}</figcaption>
    </figure>
  );
}
