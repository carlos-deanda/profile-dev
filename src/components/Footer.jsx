import { Container } from './ui';
import Piano from './Piano';
import useLocalTime from '../hooks/useLocalTime';
import { footer } from '../data/profile';

export default function Footer() {
  const time = useLocalTime(footer.time);
  return (
    <footer className="border-t border-[#e6e6e8] py-10">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold">{footer.piano.title}</p>
          <Piano />
          <p className="text-[13px] text-muted">{footer.piano.hint}</p>
        </div>
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-[13px] text-muted">
          <p>
            © {new Date().getFullYear()} {footer.owner}
          </p>
          {/* No aria-live on purpose: screen readers should not announce every minute. */}
          <p className="tabular-nums">
            {time} {footer.time.suffix}
          </p>
          <p>{footer.made}</p>
        </div>
      </Container>
    </footer>
  );
}
