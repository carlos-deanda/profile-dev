import { Container, SectionTitle, TrackLabel } from './ui';
import Reveal from './Reveal';
import { why, tracks } from '../data/profile';

export default function WhyIBuild() {
  return (
    <section id="why" className="py-24 md:py-30">
      <Container className="flex flex-col gap-14">
        <Reveal className="flex flex-col gap-3.5">
          <TrackLabel track={tracks.why} />
          <SectionTitle>{why.title}</SectionTitle>
        </Reveal>

        <Reveal className="flex max-w-[860px] flex-col gap-5">
          <p className="text-[clamp(26px,3.2vw,40px)] leading-[1.2] font-semibold tracking-[-0.025em]">
            {why.statement}
          </p>
          <p className="text-[21px] leading-[1.45] text-muted">{why.body}</p>
        </Reveal>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-10 gap-y-8 border-t border-line pt-10">
          {why.items.map((item, i) => (
            <Reveal key={item.name} as="li" delay={i * 0.08} className="flex flex-col gap-2">
              <h3 className="text-[21px] font-semibold">{item.name}</h3>
              <p className="text-[17px] leading-normal text-ink-2">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
