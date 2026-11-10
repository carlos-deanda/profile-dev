import { Container, PillLink } from './ui';
import { availability, contact } from '../data/profile';

export default function Hero() {
  return (
    <section id="top" className="bg-night text-mist">
      <Container className="flex flex-col items-start gap-7 pt-24 pb-20 md:pt-36 md:pb-24">
        <p className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 px-4 py-2 text-[15px] leading-snug text-mist sm:rounded-full">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent-on-dark" />
          <span>
            {availability[0]}
            <span className="hidden sm:inline"> · </span>
            <span className="block text-muted-on-dark sm:inline sm:text-mist">{availability[1]}</span>
          </span>
        </p>
        <p className="text-[17px] font-semibold text-accent-on-dark">
          Computer Science @ Tecnológico de Monterrey · Guadalajara, MX
        </p>
        <h1 className="max-w-[1000px] text-[clamp(48px,7vw,96px)] leading-[1.02] font-bold tracking-[-0.035em]">
          From the network to the interface. I build it end to end.
        </h1>
        <p className="max-w-[720px] text-[clamp(19px,2vw,24px)] leading-[1.45] text-muted-on-dark">
          I’m Carlos, a CS student working across full-stack development, IoT and computer vision,
          and enterprise networking.
        </p>
        <div className="mt-3 flex flex-wrap gap-3.5">
          <PillLink href="#work" dark>See my work</PillLink>
          <PillLink href={contact.resume} variant="outline" dark>
            Résumé (PDF)
          </PillLink>
          <PillLink href="#contact" variant="outline" dark>
            Get in touch
          </PillLink>
        </div>
      </Container>
    </section>
  );
}
