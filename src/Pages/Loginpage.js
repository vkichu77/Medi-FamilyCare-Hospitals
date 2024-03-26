import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Loginpage.css";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Loginpage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();  

  function validate() {
      let isValid = true
      if(!username){
        isValid = false;
        setErrorMessages({ name: "uname", message: "Please enter your email address" });
      }
      if(typeof username !== "undefined"){
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if(!pattern.test(username)){
          isValid = false;
          setErrorMessages({ name: "uname", message: "Please enter a valid email address" });
        }
      }
      if(!password){
        isValid = false;
        setErrorMessages({ name: "pass", message: "Please enter your password" });
      }
      
      return isValid;

  }

  function handleSubmit(event) {
    event.preventDefault();
    if ( validate() ) {
      fetch("/usercheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      .then(res => {
        if(res.status === 401) {
          setErrorMessages({ name: "invaliduser", message: "Unauthorized User!" });
          throw new Error("Unauthorized User!");
        } else if(res.status === 400) {
          setErrorMessages({ name: "invaliduser", message: "Session could not be established!" });
          throw new Error("Session could not be established!");
        }         
        return res.json();        
      })
      .then(() => {
        // console.log(JSON.parse(JSON.stringify(userdets)));
        navigate("/loggedin"); //, { state: JSON.parse(JSON.stringify(userdets)) });
      })
      .catch(error => {
        console.log(error);
        // setErrorMessages({ name: "invaliduser", message: error });
      })
    } 
  }

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="login-form-sized">
      <div className="title">Sign In</div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username </label>
              <input type="text" name="uname" onChange={(e) => setUsername(e.target.value)} />
              {renderErrorMessage("uname")}
            </div>
            <div className="input-container">
              <label>Password </label>
              <input type="password" name="pass" onChange={(e) => setPassword(e.target.value)} />
              {renderErrorMessage("pass")}
            </div>
            <div className="input-container">
              <div className="button-container">
                <input type="submit" />
              </div>
              {renderErrorMessage("invaliduser")}
            </div>
          </form>
        </div>
        </div>
  );

  return (    
  <div>
    <Navbar />
    <div className="login-form">             
      {renderForm}
    </div>      
    <Footer />
  </div>
 
  );
}

export default Loginpage;
