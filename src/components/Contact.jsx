import { Container, PillLink, TextLink, TrackLabel } from './ui';
import Reveal from './Reveal';
import EqEcho from './EqEcho';
import { contact, tracks } from '../data/profile';

export default function Contact() {
  const links = [
    { label: 'GitHub', href: contact.github },
    { label: 'LinkedIn', href: contact.linkedin },
    { label: 'Résumé (PDF)', href: contact.resume },
  ].filter((l) => l.href);

  return (
    <section id="contact" className="bg-night pt-28 pb-24 text-mist md:pt-36 md:pb-30">
      <Container>
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <TrackLabel track={tracks.contact} dark />
          <h2 className="text-[clamp(44px,6vw,80px)] leading-[1.03] font-bold tracking-[-0.035em]">
            Let’s build something.
          </h2>
          <EqEcho />
          <p className="max-w-[560px] text-[21px] leading-[1.45] text-muted-on-dark">
            Open to software engineering internships for 2027. The fastest way to reach me is email.
          </p>
          <PillLink href={`mailto:${contact.email}`} dark className="mt-2 min-h-[52px] px-[30px]">
            {contact.email}
          </PillLink>
          <div className="mt-2 flex flex-wrap justify-center gap-7 text-[17px]">
            {links.map((l) => (
              <TextLink key={l.label} href={l.href} dark>
                {l.label}
              </TextLink>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
