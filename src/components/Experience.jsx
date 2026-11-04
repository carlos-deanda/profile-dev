import { Container, SectionTitle } from './ui';
import { experience } from '../data/profile';

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-30">
      <Container className="flex flex-col gap-12">
        <SectionTitle>Experience &amp; leadership.</SectionTitle>
        <ol className="border-b border-line">
          {experience.map((item) => (
            <li key={item.title} className="flex flex-wrap gap-x-10 gap-y-2 border-t border-line py-7">
              <p className="flex-[0_0_180px] text-[15px] text-muted">{item.dates}</p>
              <div className="flex flex-[1_1_420px] flex-col gap-1.5">
                <h3 className="text-[21px] font-semibold">{item.title}</h3>
                <p className="text-[17px] leading-normal text-ink-2">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
