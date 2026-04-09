import './Hero.css';
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <section className="hero-container">
      <h1 className="main-text">
        Carlos <br />
        <span className="secondary-text">de Anda</span>
      </h1>

      <p className="hero-tagline">
        Architecting Digital Artifacts
      </p>
      
      {/* Architecting Digital Artifacts */}
      
      <p className="hero-description">
        Full-stack developer specializing in building high-performance, 
        visually stunning web experiences that live at the intersection of design and data.
      </p>
    
      <div className="button-group">
        <Link to="/projects" className="btn">View Projects</Link>
        <Link to="/AboutMe" className="btn btn-secondary">About Me</Link>
      </div>
    </section>
  );
};

export default Hero;