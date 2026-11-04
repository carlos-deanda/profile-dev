import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';

const DESKTOP = '(min-width: 768px)';

function subscribe(notify) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener('change', notify);
  return () => mq.removeEventListener('change', notify);
}

const getSnapshot = () => window.matchMedia(DESKTOP).matches;

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

// True when scroll-driven motion should run: wide screen and no reduced-motion preference.
// Everywhere else (phones, reduced motion) components render their static version.
export default function useScrollMotion() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  return isDesktop && !reduced;
}
