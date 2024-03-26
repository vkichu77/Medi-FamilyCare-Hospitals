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
// import moment from "moment";
import {sprintf} from 'sprintf-js';

function TableCancelAppointmentInsert({ mystylebor, funcViewCancelAPPOINTMENT }) {
  
  const [AID, setAID] = useState('');
  const [PID, setPID] = useState('');
  const [SID, setSID] = useState('');
  const [PNAME, setPNAME] = useState("");  
  const [ADDRESS, setADDRESS] = useState("");  
  const [SEX, setSEX] = useState("");
  const [AGE, setAGE] = useState("");
  const [APPDATE, setAPPDATE] = useState("");

  // const [timeslots, setTimeslots] = useState([]);
  const [appointmentoptionsM, setAppointmentoptionsM] = useState([]);
  const [patientoptionsM, setPatientsoptionsM] = useState([]);
  const [staffoptionsM, setStaffoptionsM] = useState([]);
     
  const [validated, setValidated] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleReset = () => {
    setAID("");
    setPID("");
    setSID("");
    setPNAME("");    
    setADDRESS("");    
    setSEX("");
    setAGE("");
    setAPPDATE("");        
  };

  useEffect(() => {      
    getalloptions();    
}, []);
  
// const dateForPicker = (dateString) => {
//   // return moment(new Date(dateString)).format('YYYY-MM-DD HH:mm:00.000')
//   return moment(new Date(dateString)).format('YYYY-MM-DD');
// };

const aidFromaidString = (aidString) => {
  return sprintf("A%03d", parseInt(aidString));
};

function getalloptions() {

  fetch('/getallappointments')
  .then(response => {
    if(response.status === 401) {          
      throw new Error("Error: Table AppointmentDetails");
    } else if(response.status === 400) {          
      throw new Error("Error: Session could not be established!");
    }      
    return response.json()
  })
  .then(data => {
    // console.log(data);
    setAppointmentoptionsM(data);
  })      
  .catch(error => console.log(error));
 
  fetch('/getallpatients')
  .then(response => {
    if(response.status === 401) {          
      throw new Error("Error: Table PatientDetails");
    } else if(response.status === 400) {          
      throw new Error("Error: Session could not be established!");
    }      
    return response.json()
  })
  .then(data => setPatientsoptionsM(data))      
  .catch(error => console.log(error));

  fetch('/getalldoctors')
  .then(response => {
    if(response.status === 401) {          
      throw new Error("Error: Table StaffDetails");
    } else if(response.status === 400) {          
      throw new Error("Error: Session could not be established!");
    }      
    return response.json()
  })
  .then(data => setStaffoptionsM(data))      
  .catch(error => console.log(error));
}

const handlAIDSelect = (event) => {
  var indx = event.target.selectedIndex - 1;    
    setAID(event.target.value);
    setSID(appointmentoptionsM[indx].SID);
    setPID(appointmentoptionsM[indx].PID);
    setAPPDATE(appointmentoptionsM[indx].APPDATE);
    setPNAME(appointmentoptionsM[indx].PNAME);
    setSEX(appointmentoptionsM[indx].SEX);
    setAGE(appointmentoptionsM[indx].AGE);
    setADDRESS(appointmentoptionsM[indx].ADDRESS)   
};

const handlPIDSelect = (event) => {
  var indx = event.target.selectedIndex - 1;    
    setPID(event.target.value);    
    setPNAME(patientoptionsM[indx].PNAME);
    setSEX(patientoptionsM[indx].SEX);
    setAGE(patientoptionsM[indx].AGE);
    setADDRESS(patientoptionsM[indx].ADDRESS)      
};

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

    fetch("/cancelappointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ AID, PID, SID, APPDATE }),
    }).then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Cancel Appointmentdetails");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {
      console.log(data.OUTPUT);
      // alert(data.OUTPUT);
      if(data.OUTPUT.indexOf("ERR") !== -1) {    
        setModalTitle("ERROR");
        setModalMessage(data.OUTPUT);        
      } else{        
        // console.log(data.OUTPUT);
        handleReset();
        setValidated(false);
        setModalTitle("SUCCESS");
        // setButtonDisabled(false);
        funcViewCancelAPPOINTMENT.current();
        getalloptions();
        setModalMessage("Appointment Successfully Cancelled");
        // alert(data.OUTPUT);
      }
      handleShow();
    })
    .catch(error => console.log(error));
    // setValidated(true);    
  };

  // function handleCancel() {
  //   handleReset();
  //   setButtonDisabled(false);
  // }

  
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
              <h2 className="fw-bold mb-2 text-uppercase">Cancel Appointment</h2>
              <p className=" mb-5">Please enter the details!</p>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3">                    
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formAIDMAPP"
                  >
                  <Form.Label>APPOINTMENTID</Form.Label>
                    <Form.Select placeholder="Select APPOINTMENTID" as="select" required value={AID} onChange={(e) => {handlAIDSelect(e); }}>
                    <option value="">Select</option>
                    {appointmentoptionsM.map((appointment) => (
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
                    controlId="formPIDMAPP"
                    >
                  <Form.Label>PATIENTID</Form.Label>
                    <Form.Select placeholder="Select PATIENTID" as="select" disabled required value={PID} onChange={(e) => handlPIDSelect(e)}>
                    <option value="">Select</option>
                    {patientoptionsM.map((patient) => (
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
                    controlId="formSIDMAPP"
                  >
                  <Form.Label>DOCTORID</Form.Label>
                    <Form.Select placeholder="Select DOCTORTID" as="select" required disabled value={SID} onChange={(e) => { setSID(e.target.value); }}>
                    <option value="">Select</option>
                    {staffoptionsM.map((staff) => (
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
                      controlId="formAPPDATEMAPP"
                    >
                      <Form.Label className="text-center">
                        Current Appointment Date/Time
                      </Form.Label>
                      <Form.Control type="text" placeholder="Current Appointment" disabled required value={APPDATE} onChange={(e) => setAPPDATE(e.target.value)}/>                      
                      <Form.Control.Feedback type="invalid">
                          Please enter the Appointment Date
                        </Form.Control.Feedback>.
                    </Form.Group>
                    
                  </Row>

                <Row className="mb-3"> 
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formFullNameMAPP"
                  >
                    <Form.Label className="text-center">
                      Patient full name
                    </Form.Label>
                    <Form.Control type="text" placeholder="Fullname" disabled required value={PNAME} onChange={(e) => setPNAME(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter the full name of the patient.
                      </Form.Control.Feedback>
                  </Form.Group>
                   
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formGenderMAPP"
                  >
                    <Form.Label className="text-center">
                      Gender
                    </Form.Label>
                    <Form.Select placeholder="Gender" as="select" disabled required value={SEX} onChange={(e) => setSEX(e.target.value)}>
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
                    controlId="formAGEMAPP"
                  >
                    <Form.Label>AGE</Form.Label>
                    <Form.Control type="text" placeholder="AGE" required  disabled value={AGE} onChange={(e) => setAGE(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter the Age of the Patient.
                      </Form.Control.Feedback>
                  </Form.Group>
                
                  <Form.Group
                    as={Col}
                    className="mb-3"
                    controlId="formAddressMAPP"
                  >
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address" required  disabled value={ADDRESS} onChange={(e) => setADDRESS(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter the Address.
                      </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                
                <div className="d-grid">
                  <Button variant="primary" type="submit">
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

export default TableCancelAppointmentInsert;