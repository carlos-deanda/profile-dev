import { LazyMotion, domAnimation } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import LeapScene from './components/LeapScene';
import ClimaxScene from './components/ClimaxScene';
import Work from './components/Work';
import WhyIBuild from './components/WhyIBuild';
import CityMap from './components/CityMap';
import Experience from './components/Experience';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    // `m` components get their renderer from LazyMotion; without it scroll values never reach the DOM.
    <LazyMotion features={domAnimation} strict>
      {/* First stop for keyboard users: jumps past the menu. Visible only when focused. */}
      <a
        href="#main"
        className="sr-only z-20 rounded-full bg-mist text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:px-5 focus:py-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Stats />
        <Work />
        <LeapScene />
        <ClimaxScene />
        <WhyIBuild />
        <CityMap />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  );
}

export default App;
