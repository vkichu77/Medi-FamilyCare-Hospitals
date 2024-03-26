import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "../Styles/Loginpage.css";
import "../Styles/Hero.css";
import "../Styles/Footer.css";
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import LoggedinHeader from "../Components/LoggedinHeader";
import Footer from "../Components/Footer";


function Loggedin() {    
    const navigate = useNavigate();  
    const [styleaccess1, Setstyleaccess1] = useState("");    
    const [sessdata, setessdata] = useState({
        SNAME: "", 
        TITLE: "", 
        TYPE: "",
        QUALIFICATION: "",
        DEPARTMENT: ""
    });

    useEffect(() => {
        fetch('/get_current_user_info')
          .then(response => {
            if(response.status === 400) {          
              navigate("/logoutpage");
              throw new Error("Error: Session could not be established!");              
              // window.location.href = "http://localhost:3000/Medi-FamilyCare/logoutpage";
            }      
            return response.json()
          })
          .then(data => {
            // console.log(JSON.parse(JSON.stringify(data)));
            setessdata({
            SNAME: data.SNAME, 
            TYPE: data.TYPE,
            TITLE: data.TITLE,
            QUALIFICATION: data.QUALIFICATION,
            DEPARTMENT: data.DEPARTMENT
          });
          if (data.TYPE.indexOf("ADMIN") !== -1) {
            Setstyleaccess1("login-form bg-info");            
          }
          else if (data.TYPE.indexOf("STAFF") !== -1) {
            Setstyleaccess1("login-form bg-warning");            
          }
          else if (data.TYPE === "DOCTOR")  {
            Setstyleaccess1("login-form bg-success");            
          }
          })      
          .catch(error => console.log(error));
      }, [navigate]);

    const handleClick = (e, navipath) => {
        e.preventDefault();
        navigate(navipath);
    }

    return (    
        <div>
        <LoggedinHeader />
        <div  className={styleaccess1}>     
        <p className="text-headline">WELCOME {sessdata["TITLE"]}{sessdata["SNAME"]},{sessdata["QUALIFICATION"]}<br/> YOUR ACCESS TYPE: {sessdata["TYPE"]}</p>
        <br/>        
                  { (sessdata["TYPE"].indexOf("ADMIN") !== -1) &&
                    <DropdownButton id="dropdown-basic-button" title="Table Access">
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablestaffoperations")}>STAFF DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablepatientoperations")}>PATIENT DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablediagnosisoperations")}>DIAGNOSIS DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tableappointmentoperations")}>APPOINTMENT DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablecancelappointmentoperations")}>CANCEL APPOINTMENT DETAILS</Dropdown.Item>
                    </DropdownButton>       
                  }
                  { (sessdata["TYPE"].indexOf("STAFF") !== -1) &&
                    <DropdownButton id="dropdown-basic-button" title="Table Access">
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablestaffoperations")}>STAFF DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablepatientoperations")}>PATIENT DETAILS</Dropdown.Item>            
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tableappointmentoperations")}>APPOINTMENT DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablecancelappointmentoperations")}>CANCEL APPOINTMENT DETAILS</Dropdown.Item>
                    </DropdownButton>       
                  }
                  { (sessdata["TYPE"] === "DOCTOR") &&
                    <DropdownButton id="dropdown-basic-button" title="Table Access">            
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tablediagnosisoperations")}>DIAGNOSIS DETAILS</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={(e) => handleClick(e, "/tableappointmentoperations")}>APPOINTMENT DETAILS</Dropdown.Item>            
                    </DropdownButton>       
                  }                   
        </div>
        <Footer />
        </div>
    
        );
}

export default Loggedin;