import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="container-navbar">
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/AboutMe">About Me</Link>
        <Link to="/Projects">Projects</Link>
        <Link to="/ContactMe">Contact Me</Link>
      </div>
    </nav>
  );
};

export default Navbar;