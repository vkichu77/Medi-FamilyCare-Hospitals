import {React, useEffect, useState} from "react";
import "../Styles/Navbar.css";
import { Link } from "react-router-dom";
// import Button from 'react-bootstrap/Button';


function LoggedinHeader() {
  const [loggedout, setLoggedout] = useState(false);
  // const navigate = useNavigate();  

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   navigate("/logoutpage");
  // };
  useEffect(() => {    
    // document.title = `You clicked ${count} times`;
    fetch('/get_current_user_info')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: user checkout");        
      } else if(response.status === 400) {  
        setLoggedout(true);        
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(() => {
      setLoggedout(false);
      // console.log(data);
    })      
    .catch(error => console.log(error));
  });

  
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
            {!loggedout &&
            <Link to={"/logoutpage"} className="navbar-links">Logout</Link>
            } 
            {loggedout &&
              <Link to={"/loginpage"} className="navbar-links">Login</Link>              
            } 
            </li>        
          </ul>

          
        </div>
      );
 

}

export default LoggedinHeader;
