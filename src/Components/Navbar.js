import React from "react";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  // const [nav, setNav] = useState(false);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/">
          Medi-FamilyCare <span className="navbar-sign">&#x1f496;</span> Hospitals
        </Link>
      </h1>

      {/* Desktop */}
      <ul className="navbar-items">
        <li>
          <Link to="/" className="navbar-links">
            Home
          </Link>
        </li>
        <li>
          <a href="#services" className="navbar-links">
            Services
          </a>
        </li>
        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
        <li>
          <a href="#doctors" className="navbar-links">
            Doctors
          </a>
        </li>
        <li>
        <Link to={"/loginpage"} className="navbar-links">Login</Link>
        </li>        
      </ul>

      
    </div>
  );
}

export default Navbar;
