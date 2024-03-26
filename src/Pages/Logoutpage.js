import {React, useEffect} from 'react';
import Footer from "../Components/Footer";
import LoggedinHeader from "../Components/LoggedinHeader";
import "../Styles/Loginpage.css";

function Logoutpage() {
    useEffect(() => {    
        // document.title = `You clicked ${count} times`;
        fetch('/usercheckout')
        .then(response => {
          if(response.status === 401) {          
            throw new Error("Error: user checkout");
          } else if(response.status === 400) {          
            throw new Error("Error: Session could not be established!");
          }      
          return response.json()
        })
        .then(data => {          
          console.log(data.OUTPUT);
        })      
        .catch(error => console.log(error));
      });
  
    return (
        <div>
            <LoggedinHeader />
            <div className="login-form-sized">
            <div class="alert alert-success" role="alert">
                <h4 class="alert-heading">Logged Out</h4>
                <p>Session Closed.</p>
                <hr/>
                <p class="mb-0">You are logged out from this Session.</p>
            </div>
            </div>
            <Footer />
      </div>
      
    );
  

}

export default Logoutpage;