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


function TableDiagnosisModify({ mystylebor, funcUpdateDIAGNOSIS, funcViewDIAGNOSIS }) {

  const [validated, setValidated] = useState(false);
  const [DGID, setDGID] = useState("");
  const [AID, setAID] = useState("");
  const [PID, setPID] = useState("");
  const [SID, setSID] = useState("");  
  const [APPDATE, setAPPDATE] = useState("");    
  const [PNAME, setPNAME] = useState("");
  
  const [PRESCRIPTION, setPRESCRIPTION] = useState("");
  const [DIAGNOSIS, setDIAGNOSIS] = useState("");

  const [diagnosesoptionsDG, setDiagnosesoptionsDG] = useState([]);
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
    setDGID("");
    setAPPDATE("");
    setPNAME("");
    setPRESCRIPTION("");
    setDIAGNOSIS("");    
  };

  useEffect(() => { 
    funcUpdateDIAGNOSIS.current = getalloptions;
    funcUpdateDIAGNOSIS.current();
  }, [funcUpdateDIAGNOSIS]);

  function getalloptions() {

    fetch('/getalldiagnoses')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Diagnosis Details");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {
      // console.log(data);
      setDiagnosesoptionsDG(data);
    })      
    .catch(error => console.log(error));

    fetch('/getallappointments')
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

  // const dateForPicker = (dateString) => {
  //   // return moment(new Date(dateString)).format('YYYY-MM-DD HH:mm:00.000')
  //   return moment(new Date(dateString)).format('YYYY-MM-DD');
  // };
  const aidFromaidString = (aidString) => {
    return sprintf("A%03d", parseInt(aidString));
  };

  const dgidFromdgidString = (dgidString) => {
    return sprintf("DG%03d", parseInt(dgidString));
  };

  const handleSubmit = (event) => {
    
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {      
      setValidated(true);      
      return;
    }
    
    fetch("/updatediagnosis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ DGID, AID, PID, SID, PRESCRIPTION, DIAGNOSIS }),
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
        funcViewDIAGNOSIS.current();
        getalloptions();
        setModalMessage("Information Successfully Updated");
      }
      handleShow();
    })
    .catch(error => console.log(error));    
  };

  const handlSelect = (event) => {
    var indx = event.target.selectedIndex - 1;    
    setDGID(event.target.value);
    setAID(diagnosesoptionsDG[indx].AID);
    setSID(diagnosesoptionsDG[indx].SID);
    setPID(diagnosesoptionsDG[indx].PID);
    setAPPDATE(diagnosesoptionsDG[indx].APPDATE);
    setPNAME(diagnosesoptionsDG[indx].PNAME);
    setDIAGNOSIS(diagnosesoptionsDG[indx].DIAGNOSIS);
    setPRESCRIPTION(diagnosesoptionsDG[indx].PRESCRIPTION);
    // console.log(diagnosesoptionsDG[indx].SID)
    // console.log(staffoptionsDG);
    // console.log(patientoptionsDG);
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
                <h2 className="fw-bold mb-2 text-uppercase">Update Diagnosis Details</h2>
                <p className=" mb-5">Please enter the details!</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formDGIDDGM"
                    >
                    <Form.Label>DIAGNOSIS ID</Form.Label>
                    <Form.Select placeholder="Select APPOINTMENTID" as="select" required value={DGID} onChange={(e) => {handlSelect(e); }}>
                    <option value="">Select</option>
                    {diagnosesoptionsDG.map((diagnosis) => (
                      <option key={diagnosis.DGID} value={diagnosis.DGID}>{dgidFromdgidString(parseInt(diagnosis.DGID))}</option>
                    ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select the DIAGNOSIS ID.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">                    
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formAIDDGM"
                    >
                    <Form.Label>APPOINTMENTID</Form.Label>
                    <Form.Select placeholder="Select APPOINTMENTID" as="select" disabled required value={AID} onChange={(e) => {setAID(e.target.value); }}>
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
                    controlId="formPIDDGM"
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
                      controlId="formSIDDGM"
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
                      controlId="formCURRAPPDATEDGM"
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
                      controlId="formPNAMEDGM"
                    >
                      <Form.Label>PNAME</Form.Label>
                      <Form.Control type="text" placeholder="Patient Name" required  disabled  value={PNAME} onChange={(e) => setPNAME(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the Patient Name
                        </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">   
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formDIAGDGM"
                    >
                      <Form.Label>DIAGNOSIS</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="MODIFY DIAGNOSIS DETAILS" required  value={DIAGNOSIS} onChange={(e) => setDIAGNOSIS(e.target.value)}/>
                      <Form.Control.Feedback type="invalid">
                          Please enter the DIAGNOSIS of the Doctor.
                        </Form.Control.Feedback>
                    </Form.Group>
                  
                    <Form.Group
                      as={Col}
                      className="mb-3"
                      controlId="formPRESCRDGM"
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
                      UPDATE DIAGNOSIS DETAILS
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

export default TableDiagnosisModify;