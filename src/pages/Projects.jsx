import './Projects.css';
import SmartMirror from '../assets/SmartMirror.jpeg';
import Netflix from '../assets/Netflix.jpg';
import Calculator from '../assets/Calculator.jpeg';


const Projects = () => {
  return (
    <section className="projects-container">

      <div className="projects-header">
        <h1>Projects</h1>
        <p>
          A selection of projects where I combine design, logic, and performance 
          to build meaningful digital experiences.
        </p>
      </div>

      <div className="projects-grid">

        <div className="project-card">
          <div className="project-image">
            <img src={SmartMirror} alt="Smart Mirror" />
          </div>

          <h2>Smart Mirror</h2>
          <p>
            1st place Smart Mirror project at Expo Ingenierías. A full-stack IoT system combining computer vision, embedded devices, and real-time data to create a personalized interactive experience.
          </p>

          <a 
            href="https://github.com/carlos-deanda/Smart-Mirror"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            View Project
          </a>
        </div>

        <div className="project-card">
          <div className="project-image">
            <img src={Netflix} alt="Netflix" />
          </div>

          <h2>Netflix Simulation</h2>
          <p>
            Developed a modular C++ program simulating a streaming service with 50+ video objects, applying OOP
principles for rating and filtering features
          </p>

          <a 
            href="https://github.com/carlos-deanda/problem-situation-netflix-project"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            View Project
          </a>
        </div>

        <div className="project-card">
          <div className="project-image">
            <img src={Calculator} alt="Calculator" />
          </div>

          <h2>Web Calculator</h2>
          <p>
            Functional web calculator built with JavaScript, supporting basic operations, decimals, negative values, and exponentiation. Includes DOM manipulation, regex-based input validation and a history feature for previous operations.
          </p>

          <a 
            href="https://github.com/carlos-deanda/Projecto-1---Calculadora"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            View Project
          </a>
        </div>

      </div>

    </section>
  );
};

export default Projects;