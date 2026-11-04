import { Container, SectionTitle, Eyebrow, TextLink, ImagePlaceholder } from './ui';
import { featured, projects, projectGroups } from '../data/profile';

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

function FeaturedProject() {
  return (
    <article className="flex flex-wrap overflow-hidden rounded-[28px] bg-white">
      <div className="relative min-h-[360px] min-w-0 flex-[1_1_480px]">
        <img
          src={featured.image}
          alt={featured.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-[center_72%]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-[1_1_380px] flex-col justify-center gap-[18px] p-8 md:p-12">
        <Eyebrow accent>{featured.eyebrow}</Eyebrow>
        <h3 className="text-[36px] leading-[1.1] font-bold tracking-[-0.02em]">{featured.title}</h3>
        <p className="text-[17px] leading-[1.55] text-ink-2">{featured.description}</p>
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
  );
}

function ProjectCard({ project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white">
      {project.image ? (
        <img src={project.image} alt={project.imageAlt ?? ''} className="h-[220px] w-full object-cover" loading="lazy" />
      ) : (
        <ImagePlaceholder label={project.imageLabel} className="h-[220px]" />
      )}
      <div className="flex grow flex-col gap-3 p-7">
        <p className="text-[13px] font-semibold text-muted">{project.eyebrow}</p>
        <h4 className="text-2xl leading-tight font-bold tracking-[-0.015em]">{project.title}</h4>
        <p className="text-base leading-normal text-ink-2">{project.description}</p>
        {project.myPart && <MyPart>{project.myPart}</MyPart>}
        <Stack items={project.stack} />
        {project.links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-5 pt-1 text-base">
            {project.links.map((l) => (
              <TextLink key={l.href} href={l.href}>
                {l.label}
              </TextLink>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="bg-mist py-24 md:py-30">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col gap-3.5">
          <SectionTitle>Selected work.</SectionTitle>
          <p className="max-w-[620px] text-[21px] leading-[1.45] text-muted">
            Hardware, software and networks: projects where I owned the system from end to end.
          </p>
        </div>

        <FeaturedProject />

        {projectGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-6">
            <h3 className="mt-4 text-[28px] font-bold tracking-[-0.02em]">{group.title}</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              {projects
                .filter((p) => p.group === group.id)
                .map((p) => (
                  <ProjectCard key={p.title} project={p} />
                ))}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
