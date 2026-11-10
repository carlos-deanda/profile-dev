import { Container } from './ui';
import { contact } from '../data/profile';

// `wide`: only from 640px up, so the phone menu still fits on one row with the résumé.
const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About', wide: true },
  { href: '#contact', label: 'Contact' },
  { href: contact.resume, label: 'Résumé', newTab: true },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-night/90 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex min-h-[52px] flex-wrap items-center justify-between gap-3 py-2">
        {/* On phones the CD disc stands in for the name so everything fits on one row. */}
        <a
          href="#top"
          className="flex items-center text-[17px] font-semibold tracking-[-0.01em] text-mist hover:text-white"
        >
          <img src="/favicon.svg" alt="" width="28" height="28" className="h-7 w-7 sm:hidden" />
          <span className="sr-only sm:not-sr-only">Carlos de Anda</span>
        </a>
        <nav aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:gap-x-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`hover:text-white ${l.newTab ? 'text-accent-on-dark' : 'text-line'} ${
                l.wide ? 'hidden sm:inline' : ''
              }`}
              {...(l.newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
