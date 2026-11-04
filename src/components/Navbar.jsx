import { Container } from './ui';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#e6e6e8] bg-white/85 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex min-h-[52px] flex-wrap items-center justify-between gap-3 py-2">
        <a href="#top" className="text-[17px] font-semibold tracking-[-0.01em] text-ink hover:text-ink">
          Carlos de Anda
        </a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-7 gap-y-1 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-ink-2 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
