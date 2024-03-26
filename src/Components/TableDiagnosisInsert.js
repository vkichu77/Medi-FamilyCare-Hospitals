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
import {sprintf} from 'sprintf-js';

function TableDiagnosisInsert({ mystylebor, funcUpdateDIAGNOSIS, funcViewDIAGNOSIS }) {

  const [validated, setValidated] = useState(false);
  const [AID, setAID] = useState("");
  const [PID, setPID] = useState("");
  const [SID, setSID] = useState("");  
  const [APPDATE, setAPPDATE] = useState("");    
  const [PNAME, setPNAME] = useState("");  
  const [PRESCRIPTION, setPRESCRIPTION] = useState("");
  const [DIAGNOSIS, setDIAGNOSIS] = useState("");

  const [patientoptionsDG, setPatientsoptionsDG] = useState([]);
  const [staffoptionsDG, setStaffoptionsDG] = useState([]);
  const [appointmentoptionsDG, setAppointmentoptionsDG] = useState([]);  
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    setAID("");
    setPID("");
    setSID("");    
    setAPPDATE("");
    setPNAME("");
    setPRESCRIPTION("");
    setDIAGNOSIS("");  
  };

  useEffect(() => { 
    getalloptions();
  }, []);

  function getalloptions() {

    fetch('/getallappointmentswodiagnosis')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Appointment Details");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {
      // console.log(data);
      setAppointmentoptionsDG(data);
    })      
    .catch(error => console.log(error));

    fetch('/getallpatients')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Patient Details");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => setPatientsoptionsDG(data))      
    .catch(error => console.log(error));

    fetch('/getalldoctors')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Staff Details");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => setStaffoptionsDG(data))      
    .catch(error => console.log(error));
  }

  const aidFromaidString = (aidString) => {
    return sprintf("A%03d", parseInt(aidString));
  };

  const handleSubmit = (event) => {
    
    

    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {      
      setValidated(true);      
      return;
    }
    
    fetch("/insertdiagnosis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ AID, PID, SID, PRESCRIPTION, DIAGNOSIS }),
    }).then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table DiagnosisDetails");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {
    
      if(data.OUTPUT.indexOf("ERR") !== -1) {    
        setModalTitle("ERROR");
        setModalMessage(data.OUTPUT);        
      } else{        
        handleReset();
        setValidated(false);
        setModalTitle("SUCCESS");
        funcUpdateDIAGNOSIS.current();        
        funcViewDIAGNOSIS.current();
        setModalMessage("New Information is added with DIAGNOSIS ID: " + data.OUTPUT);
      }
      handleShow();
    })
    .catch(error => console.log(error));    
  };

  const handlSelect = (event) => {
    var indx = event.target.selectedIndex - 1;    
    setAID(event.target.value);
    setSID(appointmentoptionsDG[indx].SID);
    setPID(appointmentoptionsDG[indx].PID);
    setAPPDATE(appointmentoptionsDG[indx].APPDATE);
    setPNAME(appointmentoptionsDG[indx].PNAME);
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
                <h2 className="fw-bold mb-2 text-uppercase">Add Diagnosis Details</h2>
                <p className=" mb-5">Please enter the details!</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formAIDDG"
                    >
                    <Form.Label>APPOINTMENTID</Form.Label>
                    <Form.Select placeholder="Select APPOINTMENTID" as="select" required value={AID} onChange={(e) => {handlSelect(e); }}>
                    <option value="">Select</option>
                    {appointmentoptionsDG.map((appointment) => (
                      <option key={appointment.AID} value={appointment.AID}>{aidFromaidString(parseInt(appointment.AID))}</option>
                    ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select the APPOINTMENTID.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formPIDDG"
                    >
                    <Form.Label>PATIENTID</Form.Label>
                      <Form.Select placeholder="Select PATIENTID" as="select" disabled required value={PID} onChange={(e) => {setPID(e.target.value); }}>
                      <option value="">Select</option>
                      {patientoptionsDG.map((patient) => (
                        <option key={patient.PID} value={patient.PID}>{patient.PATIENTID}</option>
                      ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please select the PATIENTID.
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formSIDDG"
                    >
                    <Form.Label>DOCTORID</Form.Label>
                      <Form.Select placeholder="Select DOCTORTID" as="select" disabled required value={SID} onChange={(e) => {setSID(e.target.value); }}>
                      <option value="">Select</option>
                      {staffoptionsDG.map((staff) => (
                        <option key={staff.SID} value={staff.SID}>{staff.STAFFID + "-" + staff.SNAME + "-" + staff.DEPARTMENTNAME}</option>
                      ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                          Please select the DOCTOR.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
               
                  <Row className="mb-3">   
                  <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formCURRAPPDATEDG"
                    >
                      <Form.Label className="text-center">
                        Appointment Date/Time
                      </Form.Label>
                      <Form.Control type="text" placeholder="Appointment Date" disabled required value={APPDATE} onChange={(e) => setAPPDATE(e.target.value)}/>                      
                      <Form.Control.Feedback type="invalid">
                          Please enter the Appointment Date
                        </Form.Control.Feedback>.
                    </Form.Group>
                  
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formPNAMEDG"
                    >
                      <Form.Label>PNAME</Form.Label>
                      <Form.Control type="text" placeholder="Patient Name" disabled required value={PNAME} onChange={(e) => setPNAME(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Patient Name
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">   
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formDIAGDG"
                    >
                      <Form.Label>DIAGNOSIS</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="ADD DIAGNOSIS DETAILS" required value={DIAGNOSIS} onChange={(e) => setDIAGNOSIS(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the DIAGNOSIS of the Doctor.
                        </Form.Control.Feedback>
                    </Form.Group>
                  
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formPRESCRDG"
                    >
                      <Form.Label>PRESCRIPTION</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="ADD PRESCRIPTION DETAILS" required  value={PRESCRIPTION} onChange={(e) => setPRESCRIPTION(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Prescription.
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      ADD DIAGNOSIS DETAILS
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

export default TableDiagnosisInsert;