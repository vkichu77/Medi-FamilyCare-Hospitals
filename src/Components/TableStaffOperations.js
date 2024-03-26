import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "../Styles/Loginpage.css";
import "../Styles/Hero.css";
import "../Styles/Footer.css";
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import LoggedinHeader from "./LoggedinHeader";
import TableStaffInsert from "./TableStaffInsert";
import TableStaffModify from "./TableStaffModify";
import TableStaffView from "./TableStaffView";
import TableStaffDelete from "./TableStaffDelete";

import TableStaffViewSTAFF from "./TableStaffViewSTAFF";

function TableStaffOperations() {
    
    
    const [styleaccess1, Setstyleaccess1] = useState("");
    const [styleaccess2, Setstyleaccess2] = useState("border border-3 border-primary");    
    const funcUpdateSTAFF = React.useRef(null);
    const funcDeleteSTAFF = React.useRef(null);
    const funcViewSTAFF = React.useRef(null);
    const [key, setKey] = useState('insert');
    const [sessdata, setessdata] = useState({
        SNAME: "", 
        TYPE: "",
        TITLE: "", 
        QUALIFICATION: "",
        DEPARTMENT: ""
    });
    const navigate = useNavigate();  
   
    const handleClick = (e, navipath) => {
        e.preventDefault();                
        navigate(navipath);
    }

    useEffect(() => {
        fetch('/get_current_user_info')
          .then(response => {
            if(response.status === 400) {          
              navigate("/logoutpage");
              throw new Error("Error: Session could not be established!");
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
            Setstyleaccess2("border border-3 border-info");
            
          }
          else if (data.TYPE.indexOf("STAFF") !== -1) {
            Setstyleaccess1("login-form bg-warning");
            Setstyleaccess2("border border-3 border-warning");
            
          }
          else if (data.TYPE === "DOCTOR")  {
            Setstyleaccess1("login-form bg-success");
            Setstyleaccess2("border border-3 border-success");
            
          }
             
          if (data.TYPE === "STAFF") {
            setKey("view");
          }
          })      
          .catch(error => console.log(error));
      }, [navigate]);

    return (    
        <div>
          <div className=".contenttab">
          <LoggedinHeader />            
                            
              <div  className={styleaccess1}>  
                <p className="text-headline">WELCOME {sessdata["TITLE"]}{sessdata["SNAME"]} {sessdata["QUALIFICATION"]}<br/> YOUR ACCESS TYPE: {sessdata["TYPE"]}</p>
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
              { (sessdata["TYPE"].indexOf("ADMIN") !== -1) &&
                  <Tabs
                  defaultActiveKey="profile"
                  id="staffdetails-tab"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                  >
                      <Tab eventKey="home" title="Table: Staff Details" disabled>
                      </Tab>
                      <Tab eventKey="insert" title="Insert">            
                      <TableStaffInsert mystylebor={styleaccess2} funcUpdateSTAFF={funcUpdateSTAFF} funcDeleteSTAFF={funcDeleteSTAFF} funcViewSTAFF={funcViewSTAFF}/>            
                      </Tab>
                      <Tab eventKey="modify" title="Modify">
                      <TableStaffModify mystylebor={styleaccess2} funcUpdateSTAFF={funcUpdateSTAFF} funcViewSTAFF={funcViewSTAFF}/>            
                      </Tab>
                      <Tab eventKey="view" title="View">
                      <TableStaffView mystylebor={styleaccess2} funcViewSTAFF={funcViewSTAFF}/>
                      </Tab>
                      <Tab eventKey="delete" title="Delete">
                      <TableStaffDelete mystylebor={styleaccess2} funcDeleteSTAFF={funcDeleteSTAFF} funcUpdateSTAFF={funcUpdateSTAFF} funcViewSTAFF={funcViewSTAFF}/>
                      </Tab>
                  </Tabs> 
              }
              { (sessdata["TYPE"].indexOf("STAFF") !== -1) &&
                  <Tabs
                  defaultActiveKey="profile"
                  id="staffdetails-tabSTAFF"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                  >
                      <Tab eventKey="home" title="Table: Staff Details" disabled>
                      </Tab>
                      <Tab eventKey="view" title="View">
                      <TableStaffViewSTAFF mystylebor={styleaccess2} />
                      </Tab>
                  </Tabs>
              }
              {/* {(sessdata["TYPE"] === "DOCTOR") &&
              }
               */}
          </div>
    
         
          {/* <div className="footer-section">
          <div className="ft-copyright">
          <p>© 2013-2023 Medi-Family Care Clinics - The 3rd Year Final CT Project. All rights reserved.</p>
          </div>      
          </div>         */}

        </div>
    
        );
}

export default TableStaffOperations;