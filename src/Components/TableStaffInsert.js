import React, { useEffect, useState  } from "react";

import {
  // InputGroup,
  Col,
  Button,
  Row,
  Container,
  Card,
  Form,
  Modal
} from "react-bootstrap";

function TableStaffInsert({ mystylebor, funcUpdate, funcDelete, funcView }) {
  
  const todayDate = new Date(); 
  const formatDate = todayDate.getDate() < 10 ? `0${todayDate.getDate()}`:todayDate.getDate();
  const formatMonth = todayDate.getMonth() < 10 ? `0${todayDate.getMonth()}`: todayDate.getMonth();
  const formattedDate = [todayDate.getFullYear(), formatMonth, formatDate].join('-');  
  const [options, setOptions] = useState([]);
  const [validated, setValidated] = useState(false);
  // const [STAFFID, setSTAFFID] = useState("")
  const [TYPE, setTYPE] = useState("");
  const [TITLE, setTITLE] = useState("");
  const [SNAME, setSNAME] = useState("");
  const [QUALIFICATION, setQUALIFICATION] = useState("");
  const [EXPERTISE, setEXPERTISE] = useState("");
  const [DPID, setDPID] = useState("");
  const [JOINDATE, setJOINDATE] = useState(formattedDate);
  const [ADDRESS, setADDRESS] = useState("");
  const [DESIGNATION, setDESIGNATION] = useState("");
  const [EMAIL, setEMAIL] = useState("");
  const [PASSWD, setPASSWD] = useState("");
  const [DOB, setDOB] = useState(formattedDate);
  const [SEX, setSEX] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    setTYPE("");
    setTITLE("");
    setSNAME("");
    setQUALIFICATION("");
    setEXPERTISE("");
    setDPID("");
    setJOINDATE(formattedDate);
    setADDRESS("");
    setDESIGNATION("");
    setEMAIL("");
    setPASSWD("");
    setDOB(formattedDate);
    setSEX("");
  };

  useEffect(() => {        
    fetch('/getdept')
      .then(response => {
        if(response.status === 401) {          
          throw new Error("Error: Table Department EMPTY");
        } else if(response.status === 400) {          
          throw new Error("Error: Session could not be established!");
        }      
        return response.json()
      })
      .then(data => setOptions(data))      
      .catch(error => console.log(error));
  }, []);
  

  const handleSubmit = (event) => {
    // if(event && event.stopPropagation) event.stopPropagation(); 
    // alert(event.currentTarget);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {      
      setValidated(true);      
      return;
    }
    // event.preventDefault();
    // event.stopPropagation();
    

    fetch("/insertstaff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ TYPE, TITLE, SNAME, QUALIFICATION, EXPERTISE, DPID, JOINDATE, ADDRESS, DESIGNATION, EMAIL, PASSWD, DOB, SEX }),
    }).then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Staffdetails");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {
      // console.log(data.OUTPUT);
      // alert(data.OUTPUT);
      if(data.OUTPUT.indexOf("ERR") !== -1) {    
        setModalTitle("ERROR");
        setModalMessage(data.OUTPUT);        
      } else{        
        // console.log(data.OUTPUT);
        handleReset();
        setValidated(false);
        setModalTitle("SUCCESS");
        funcUpdate.current();
        funcDelete.current();
        funcView.current();
        setModalMessage("This new Staff is added with STAFFID: " + data.OUTPUT);
        // alert(data.OUTPUT);
      }
      handleShow();
    })
    .catch(error => console.log(error));
    // setValidated(true);
    
  };

  return (
  // <div>

    <Container>      
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>         
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Row className="vh-100 d-flex justify-content-center align-items-top">
      
        <Col md={10} lg={8} xs={12}>
          <div className={mystylebor}></div>
          <Card className="shadow">
            <Card.Body>
              <div className="mb-3 mt-4">
                <h2 className="fw-bold mb-2 text-uppercase">Insert New Records: Staff Details</h2>
                <p className=" mb-5">Please enter the details!</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formType"
                    >
                      <Form.Label>Access Level</Form.Label>
                      <Form.Select placeholder="Enter Access Level" as="select" required value={TYPE} onChange={(e) => setTYPE(e.target.value)}>
                          <option value="">Select</option> 
                          <option>ADMIN</option>
                          <option>DOCTOR</option>
                          <option>STAFF</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please select the Access Level.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formTitle"
                    >
                      <Form.Label>Title</Form.Label>
                      <Form.Select placeholder="Enter phone number" as="select" required value={TITLE} onChange={(e) => setTITLE(e.target.value)}>
                          <option value="">Select</option> 
                          <option>Mr.</option>
                          <option>Mrs.</option>
                          <option>Ms.</option>
                          <option>Dr.</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please select the Title.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formFullName"
                    >
                      <Form.Label className="text-center">
                        Staff full name
                      </Form.Label>
                      <Form.Control type="text" placeholder="Enter fullname" required value={SNAME} onChange={(e) => setSNAME(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the full name of the staff.
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formGender"
                    >
                      <Form.Label className="text-center">
                        Gender
                      </Form.Label>
                      <Form.Select placeholder="Select gender" as="select" required value={SEX} onChange={(e) => setSEX(e.target.value)}>
                          <option value="">Select</option> 
                          <option>M</option>
                          <option>F</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Gender.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formDOB"
                    >
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control type="date" placeholder="Enter date of birth" required value={DOB} onChange={(e) => setDOB(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Date of Birth.
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formQualification"
                    >
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control type="text" placeholder="Enter qualification" required  value={QUALIFICATION} onChange={(e) => setQUALIFICATION(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Qualification.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="forSpecialization"
                    >
                    <Form.Label className="text-center">
                        Specialization
                    </Form.Label>
                    <Form.Control type="text" placeholder="Enter specialization" required  value={EXPERTISE} onChange={(e) => setEXPERTISE(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                          Please enter the Specialization.
                        </Form.Control.Feedback>
                  </Form.Group>
                      
                  </Row>
                  <Row className="mb-3">    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formDepartment"
                    >
                      <Form.Label className="text-center">
                        Department
                      </Form.Label>
                      <Form.Select placeholder="Select department" as="select" required value={DPID} onChange={(e) => setDPID(e.target.value)}>
                      <option value="">Select</option>
                      {options.map((option) => (
                        <option key={option.DPID} value={option.DPID}>{option.DNAME}</option>
                      ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Department.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formDesignation"
                    >
                      <Form.Label>Designation</Form.Label>
                      <Form.Control type="text" placeholder="Enter designation" required value={DESIGNATION} onChange={(e) => setDESIGNATION(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Designation.
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formJoinDate"
                    >
                      <Form.Label className="text-center">
                        Join Date
                      </Form.Label>
                      <Form.Control type="date" placeholder="Enter join date" required value={JOINDATE} onChange={(e) => setJOINDATE(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Joining Date.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formAddress"
                    >
                      <Form.Label>Address</Form.Label>
                      <Form.Control type="text" placeholder="Enter address" required  value={ADDRESS} onChange={(e) => setADDRESS(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Address.
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formUsername"
                    >
                      <Form.Label className="text-center">
                        Email address/Username
                      </Form.Label>                      
                        <Form.Control
                          type="email"
                          placeholder="Enter username/email"
                          required
                          value={EMAIL} onChange={(e) => setEMAIL(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                          Please enter a username/email.
                        </Form.Control.Feedback>
                        
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formBasicPassword"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" required value={PASSWD} onChange={(e) => setPASSWD(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter a password.
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Insert
                    </Button>
                  </div>
                </Form>
                
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    // </div>
  );
}

export default TableStaffInsert;