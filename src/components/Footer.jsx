import { Container } from './ui';

export default function Footer() {
  return (
    <footer className="border-t border-[#e6e6e8] py-6">
      <Container className="flex flex-wrap justify-between gap-3 text-[13px] text-muted">
        <p>© {new Date().getFullYear()} Carlos de Anda</p>
        <p>Designed and built by me in Guadalajara.</p>
      </Container>
    </footer>
  );
}
