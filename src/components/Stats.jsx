import { Container } from './ui';
import { stats } from '../data/profile';

export default function Stats() {
  return (
    <section aria-label="Highlights">
      <Container className="pb-28">
        <ul className="grid grid-cols-2 gap-8 border-t border-line pt-10 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.value} className="flex flex-col gap-1.5">
              <p className="text-[clamp(34px,4vw,44px)] leading-none font-bold tracking-[-0.03em]">
                {s.value}
              </p>
              <p className="text-[15px] leading-snug text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
