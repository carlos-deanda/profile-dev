import { useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import useScrollMotion from '../hooks/useScrollMotion';
import Reveal from './Reveal';
import VoluntAppDemo from './VoluntAppDemo';
import NetworkDiagram from './NetworkDiagram';
import { Container, SectionTitle, Eyebrow, TextLink, TrackLabel } from './ui';
import { featured, projects, projectGroups, tracks } from '../data/profile';

function Stack({ items }) {
  return <p className="text-sm text-muted">{items.join(' · ')}</p>;
}

function MyPart({ children }) {
  return (
    <p className="text-base leading-normal text-ink-2">
      <span className="font-semibold text-ink">My part:</span> {children}
    </p>
  );
}

// The frame opens up as it scrolls into view while the photo itself stays the same size
// (the inner scale cancels the outer one), so it reads as a window revealing the picture
// rather than the picture being zoomed. The source photo is portrait (1100x1467), so the
// frame stays 4:3 and no wider than the content: wider would upscale and crop it badly. Only `transform` is animated; nothing reflows.
function GrowingImage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const frameScale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const photoScale = useTransform(frameScale, (s) => 1 / s);
  return (
    <div ref={ref} className="px-4 md:px-8">
      <M.div
        style={{ scale: frameScale }}
        className="mx-auto aspect-[4/3] max-w-[1120px] overflow-hidden rounded-[28px]"
      >
        <M.img
          src={featured.image}
          alt={featured.imageAlt}
          style={{ scale: photoScale }}
          className="h-full w-full object-cover object-[center_72%]"
          loading="lazy"
        />
      </M.div>
    </div>
  );
}

function StaticImage() {
  return (
    <Container>
      <img
        src={featured.image}
        alt={featured.imageAlt}
        className="aspect-[4/3] w-full rounded-[28px] object-cover object-[center_72%]"
        loading="lazy"
      />
    </Container>
  );
}

function FeaturedProject() {
  const animated = useScrollMotion();
  return (
    <>
      {animated ? <GrowingImage /> : <StaticImage />}
      <Container>
        <Reveal>
          <article className="flex flex-wrap gap-x-14 gap-y-8 rounded-[28px] bg-white p-8 md:p-12">
            <div className="flex flex-[1_1_380px] flex-col gap-[18px]">
              <Eyebrow accent>{featured.eyebrow}</Eyebrow>
              <h3 className="text-[36px] leading-[1.1] font-bold tracking-[-0.02em]">
                {featured.title}
              </h3>
              <p className="text-[17px] leading-[1.55] text-ink-2">{featured.description}</p>
            </div>
            <div className="flex flex-[1_1_380px] flex-col justify-end gap-[18px]">
              <p className="text-[17px] leading-[1.55] text-ink-2">
                <span className="font-semibold text-ink">My part:</span> {featured.myPart}
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
                {featured.stack.map((t) => (
                  <li key={t} className="rounded-full bg-mist px-3 py-1.5 text-[13px] text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-1.5 flex flex-wrap gap-6 text-[17px]">
                {featured.links.map((l) => (
                  <TextLink key={l.href} href={l.href}>
                    {l.label}
                  </TextLink>
                ))}
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </>
  );
}

function Links({ links, className = '' }) {
  if (links.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-5 pt-1 text-base ${className}`}>
      {links.map((l) => (
        <TextLink key={l.href} href={l.href}>
          {l.label}
        </TextLink>
      ))}
    </div>
  );
}

// Full-row card with a visual on one side: the VoluntApp demo or the network diagram.
function VisualProjectCard({ project, children }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white md:flex-row">
      <div className="flex shrink-0 items-center justify-center bg-[#efeff2] px-6 py-10 md:w-[46%]">
        {children}
      </div>
      <div className="flex grow flex-col gap-3 p-7 md:justify-center md:p-12">
        <p className="text-[13px] font-semibold text-muted">{project.eyebrow}</p>
        <h4 className="text-[32px] leading-tight font-bold tracking-[-0.02em]">{project.title}</h4>
        <p className="text-[17px] leading-normal text-ink-2">{project.description}</p>
        {project.myPart && <MyPart>{project.myPart}</MyPart>}
        <Stack items={project.stack} />
        <Links links={project.links} />
      </div>
    </article>
  );
}

// Full-row card without a visual: the text splits into two columns on wide screens,
// like the featured project.
function WideTextCard({ project }) {
  return (
    <article className="flex flex-wrap gap-x-14 gap-y-4 rounded-3xl bg-white p-7 md:p-12">
      <div className="flex flex-[1_1_340px] flex-col gap-3">
        <p className="text-[13px] font-semibold text-muted">{project.eyebrow}</p>
        <h4 className="text-[32px] leading-tight font-bold tracking-[-0.02em]">{project.title}</h4>
        <p className="text-[17px] leading-normal text-ink-2">{project.description}</p>
      </div>
      <div className="flex flex-[1_1_340px] flex-col justify-end gap-3">
        {project.myPart && <MyPart>{project.myPart}</MyPart>}
        <Stack items={project.stack} />
        <Links links={project.links} />
      </div>
    </article>
  );
}

function ProjectCard({ project }) {
  if (project.demo === 'voluntapp')
    return (
      <VisualProjectCard project={project}>
        <VoluntAppDemo />
      </VisualProjectCard>
    );
  if (project.diagram)
    return (
      <VisualProjectCard project={project}>
        <NetworkDiagram diagram={project.diagram} />
      </VisualProjectCard>
    );
  if (project.wide && !project.image) return <WideTextCard project={project} />;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white">
      {project.image && (
        <img
          src={project.image}
          alt={project.imageAlt ?? ''}
          className="h-[220px] w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="flex grow flex-col gap-3 p-7">
        <p className="text-[13px] font-semibold text-muted">{project.eyebrow}</p>
        <h4 className="text-2xl leading-tight font-bold tracking-[-0.015em]">{project.title}</h4>
        <p className="text-base leading-normal text-ink-2">{project.description}</p>
        {project.myPart && <MyPart>{project.myPart}</MyPart>}
        <Stack items={project.stack} />
        <Links links={project.links} className="mt-auto" />
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="flex flex-col gap-14 bg-mist py-24 md:py-30">
      <Container>
        <Reveal className="flex flex-col gap-3.5">
          <TrackLabel track={tracks.work} />
          <SectionTitle>Selected work.</SectionTitle>
          <p className="max-w-[620px] text-[21px] leading-[1.45] text-muted">
            Hardware, software and networks: team projects, and the parts I built in each.
          </p>
        </Reveal>
      </Container>

      <FeaturedProject />

      <Container className="flex flex-col gap-14">
        {projectGroups.map((group) => {
          const items = projects.filter((p) => p.group === group.id);
          return (
            <div key={group.id} className="flex flex-col gap-6">
              <Reveal>
                <h3 className="mt-4 text-[28px] font-bold tracking-[-0.02em]">{group.title}</h3>
              </Reveal>
              {/* Two columns; the demo, the diagram and `wide` cards take a full row. */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {items.map((p, i) => (
                  <Reveal
                    key={p.title}
                    delay={(i % 3) * 0.08}
                    className={`h-full ${p.demo || p.diagram || p.wide ? 'md:col-span-2' : ''}`}
                  >
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
