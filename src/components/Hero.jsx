import { Container, PillLink } from './ui';

export default function Hero() {
  return (
    <section id="top">
      <Container className="flex flex-col items-start gap-7 pt-24 pb-20 md:pt-36 md:pb-24">
        <p className="text-[17px] font-semibold text-accent">
          Computer Science @ Tecnológico de Monterrey · Guadalajara, MX
        </p>
        <h1 className="max-w-[1000px] text-[clamp(48px,7vw,96px)] leading-[1.02] font-bold tracking-[-0.035em]">
          From the network to the interface. I build it end to end.
        </h1>
        <p className="max-w-[720px] text-[clamp(19px,2vw,24px)] leading-[1.45] text-muted">
          I’m Carlos, a CS student working across full-stack development, IoT and computer vision,
          and enterprise networking.
        </p>
        <div className="mt-3 flex flex-wrap gap-3.5">
          <PillLink href="#work">See my work</PillLink>
          <PillLink href="#contact" variant="outline">
            Get in touch
          </PillLink>
        </div>
      </Container>
    </section>
  );
}
