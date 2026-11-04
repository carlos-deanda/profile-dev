import { LazyMotion, domAnimation } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import LeapScene from './components/LeapScene';
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
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <LeapScene />
        <Work />
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
