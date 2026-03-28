import './Navbar.css';
import { Link } from 'react-router';

const Navbar = ({ children }) => {
  return (
    <>
      <div className="container-navbar">
        <div className="links">
          <p>
            <Link to="/home">Home</Link>
          </p>
          <p>
            <Link to="/AboutMe">Home</Link></p>
          <p>
            <Link to="/Projects">Home</Link></p>
        <p>
            <Link to="/ContactMe">Home</Link>
        </p>
        </div>
      </div>
      {children}
    </>
  );
};

export default Navbar;