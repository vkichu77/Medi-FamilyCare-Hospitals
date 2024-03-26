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

function TablePatientDelete({ mystylebor, funcDelete, funcUpdate, funcView }) {
  
  const [PID, setPID] = useState("");
  const [PNAME, setPNAME] = useState("");  
  const [ADDRESS, setADDRESS] = useState("");
  const [MOBILE, setMOBILE] = useState("");  
  const [SEX, setSEX] = useState("");
  const [AGE, setAGE] = useState("");
  
  const [pids, setPids] = useState([]);
  const [validated, setValidated] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleReset = () => {
    setPID("");
    setPNAME("");
    setMOBILE("");
    setADDRESS("");
    setSEX("");
    setAGE("");
  };

  useEffect(() => {      
    funcDelete.current = getallpids;
    funcDelete.current();
}, [funcDelete]);
  

  function getallpids() {
    
    fetch('/getallpids')
      .then(response => {
        if(response.status === 401) {          
          throw new Error("Error: Table Staffdetails EMPTY");
        } else if(response.status === 400) {          
          throw new Error("Error: Session could not be established!");
        }      
        return response.json()
      })
      .then(data => setPids(data))      
      .catch(error => console.log(error));

  }

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

    fetch("/deletepatient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ PID }),
    }).then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Patientdetails");
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
        setButtonDisabled(false);
        funcUpdate.current();
        funcView.current(); 
        getallpids();
        setModalMessage("Patient Details Successfully Delete");
        // alert(data.OUTPUT);
      }
      handleShow();
    })
    .catch(error => console.log(error));
    // setValidated(true);    
  };

  function handleCancel() {
    handleReset();
    setButtonDisabled(false);
  }

  function handleClick() {
 
    fetch('/getbypid', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ PID }),
    })
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Patientdetails");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {      
      // console.log(data);
      setButtonDisabled(true);
      setPNAME(data.PNAME);
      setMOBILE(data.MOBILE);
      setADDRESS(data.ADDRESS); 
      setSEX(data.SEX);
      setAGE(data.AGE);
    })      
    .catch(error => console.log(error));
  }

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
                <h2 className="fw-bold mb-2 text-uppercase">Delete Table PatientDetails</h2>
                <p className=" mb-5">Please enter the details!</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formSID"
                    >
                    <Form.Label>PATIENTID</Form.Label>
                      <Form.Select placeholder="Enter STAFFID" as="select" disabled={buttonDisabled} required value={PID} onChange={(e) => setPID(parseInt(e.target.value))}>
                      <option value="">Select</option>
                      {pids.map((staff) => (
                        <option key={staff.PID} value={staff.PID}>{staff.PATIENTID}</option>
                      ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please select the PATIENTID.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" disabled={buttonDisabled} onClick={handleClick}>
                      Fetch
                    </Button>                  
                  </Row>
                  <Row className="mb-3"> 
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formFullName"
                    >
                      <Form.Label className="text-center">
                        Patient full name
                      </Form.Label>
                      <Form.Control type="text" placeholder="Enter fullname" required value={PNAME} onChange={(e) => setPNAME(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the full name of the patient.
                        </Form.Control.Feedback>
                    </Form.Group>
                     
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
                    </Row>

                    <Row className="mb-3">   
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formAGE"
                    >
                      <Form.Label>AGE</Form.Label>
                      <Form.Control type="text" placeholder="Enter AGE" required value={AGE} onChange={(e) => setAGE(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Age of the Patient.
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
                      controlId="formMobileNo"
                    >
                      <Form.Label className="text-center">
                      MOBILE
                      </Form.Label>                      
                        <Form.Control
                          type="text"
                          placeholder="Enter MOBILE No."                          
                          value={MOBILE} onChange={(e) => setMOBILE(e.target.value)}/>                        
                    </Form.Group>
                  </Row>                
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Delete
                    </Button>
                  </div>
                  <br/>
                  <div className="d-grid">
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
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

export default TablePatientDelete;