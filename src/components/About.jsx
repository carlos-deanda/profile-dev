import { Container, SectionTitle, Eyebrow } from './ui';
import { skills } from '../data/profile';
import photo from '../assets/carlos.webp';

function Chips({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="rounded-full bg-white px-3.5 py-2 text-[15px]">
          {s}
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <section id="about" className="bg-mist py-24 md:py-30">
      <Container className="flex flex-wrap gap-14">
        <div className="flex flex-[1_1_420px] flex-col gap-6">
          <SectionTitle>About me.</SectionTitle>
          <img
            src={photo}
            alt="Carlos de Anda"
            className="aspect-[4/3] w-full max-w-[520px] rounded-3xl object-cover object-[60%_40%]"
            loading="lazy"
          />
          {/* TODO: write these two paragraphs in your own voice */}
          <p className="text-[21px] leading-normal text-ink-2">
            [Your story: why engineering, what you care about, and what you’re looking for next, e.g.
            a 2027 software engineering internship.]
          </p>
          <p className="text-[21px] leading-normal text-ink-2">
            [A human detail: music, tennis, whatever makes you you.]
          </p>
        </div>

        <div className="flex flex-[1_1_360px] flex-col gap-8 md:pt-[88px]">
          <div className="flex flex-col gap-3">
            <Eyebrow>Languages</Eyebrow>
            <Chips items={skills.languages} />
          </div>
          <div className="flex flex-col gap-3">
            <Eyebrow>Frameworks &amp; tools</Eyebrow>
            <Chips items={skills.tools} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Eyebrow>Education</Eyebrow>
            <p className="text-[17px] font-semibold">B.S. Computer Science and Technology (ITC)</p>
            <p className="text-[17px] leading-normal text-ink-2">
              Tecnológico de Monterrey, Campus Guadalajara · Expected June 2028 · GPA 9.65/10
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Eyebrow>Speaks</Eyebrow>
            <p className="text-[17px] leading-normal text-ink-2">{skills.spoken}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
