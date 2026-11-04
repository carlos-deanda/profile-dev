import { useReducedMotion } from 'motion/react';
import * as M from 'motion/react-m';

// Fades in and rises 24px the first time it scrolls into view. Only opacity + transform.
// With prefers-reduced-motion it renders a plain element, so everything is visible at once.
export default function Reveal({ as = 'div', delay = 0, className = '', children }) {
  const reduced = useReducedMotion();
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Animated = M[as];
  return (
    <Animated
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Animated>
  );
}
