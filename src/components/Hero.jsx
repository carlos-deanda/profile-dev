import './Hero.css';


const Hero = () => {
  return (
    <section className="hero-container">
      <h1 className="main-text">
        Architecting <br /> 
        <span className="secondary-text">Digital Artifacts</span>
      </h1>
      
      <p className="hero-description">
        Full-stack developer specializing in building high-performance, 
        visually stunning web experiences that live at the intersection of design and data.
      </p>

      <div className="button-group">
        <button className="btn">View Projects</button>
        <button className="btn btn-secondary">About Me</button>
      </div>
    </section>
  );
};

export default Hero;