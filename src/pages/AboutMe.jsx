import './AboutMe.css';
import { Link } from 'react-router-dom';
import me from '../assets/AboutMeCarlos1.jpeg';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const AboutMe = () => {
  return (
    <section className="about-container">

      <div className="about-wrapper">

        {/* TEXTO */}
        <div className="about-text">
          
          <p className="about-intro">Who I am</p>

          <h1 className="about-title">
            Carlos <span>de Anda</span>
          </h1>

          <p className="about-tagline">
            Computer Science student building impactful digital experiences.
          </p>

          <div className="about-content">
            <p>
              I am currently pursuing my B.S. in <strong>Computer Science and Technology </strong> 
              at Tecnológico de Monterrey. As part of the <strong>EGS Global Leadership Program</strong>, 
              I’ve developed a global mindset and a strong focus on collaboration.
            </p>

            <p>
              I enjoy solving complex problems and working in high-performance environments 
              where I can combine creativity with technical execution.
            </p>

            <p>
              I achieved <strong>3rd place nationwide</strong> in a lunar rover robotics competition 
              and qualified for the <strong>FIRST Robotics Houston Championship</strong>.
            </p>
          </div>

          <div className="about-skills">
            <h2>Skills</h2>
            <ul>
              <li>Full-Stack Development</li>
              <li>Problem Solving</li>
              <li>Teamwork</li>
              <li>Leadership</li>
            </ul>
          </div>

          <div className="about-socials">
            <a 
              href="https://github.com/carlos-deanda"
              target="_blank"
              rel="noopener noreferrer"
              className="btn social-btn"
            >
              <FaGithub /> GitHub
            </a>

            <a 
              href="https://linkedin.com/in/carlos-de-anda" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn social-btn"
            >
             <FaLinkedin/>LinkedIn
            </a>
          </div>

          <div className="about-cta">
            <Link to="/projects" className="btn">
              View My Work
            </Link>
          </div>

        </div>

        <div className="about-photo">
          <img src={me} alt="Carlos de Anda" />
        </div>

      </div>

    </section>
  );
};

export default AboutMe;