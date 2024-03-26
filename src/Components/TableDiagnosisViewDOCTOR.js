import React, { useEffect, useState  } from "react";
import {
  // InputGroup,
  Col,
  Button,
  Row,
  Container,
  Card,
  // Form,
  Modal
} from "react-bootstrap";
// import moment from "moment";
import {sprintf} from 'sprintf-js';

function TableDiagnosisViewDOCTOR({mystylebor}) {

  const [tablerecs, setTablerecs] = useState([]);    
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const dateFromDateString = (dateString) => {
  //   return moment(new Date(dateString)).format('YYYY-MM-DD HH:MM:ss');
  // };
  const aidFromaidString = (aidString) => {
    return sprintf("A%03d", parseInt(aidString));
  };
  const dgidFromdgidString = (dgidString) => {
    return sprintf("DG%03d", parseInt(dgidString));
  };

    
  useEffect(() => { 
    getalldiagnoses();
  }, []);

  function getalldiagnoses() {
    fetch('/getalldiagnosesDOCTOR')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table Diagnosis Details");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => {
      setTablerecs(data);
      // console.log(data);
    })      
    .catch(error => console.log(error));
  }

  const showDetail = (id) =>
  {    
    setModalTitle("Appointment Details");
    setModalMessage(
      (
      <div className="modal-body">
      <p>DIAGNOSIS ID : <b>{dgidFromdgidString(tablerecs[id].DGID)}</b></p>
      <p>APPOINTMENT ID : <b>{aidFromaidString(tablerecs[id].AID)}</b></p>
      <p>APPOINTMENT DATE : <b>{tablerecs[id].APPDATE}</b></p>      
      <p>PATIENT ID : <b>{tablerecs[id].PATIENTID}</b></p>
      <p>PATIENT NAME : <b>{tablerecs[id].PNAME}</b></p>
      <p>DIAGNOSIS : <b>{tablerecs[id].DIAGNOSIS}</b></p>      
      <p>PRESCRIPTION : <b>{tablerecs[id].PRESCRIPTION}</b></p>
      <p>DOCTOR ID : <b>{tablerecs[id].STAFFID}</b></p>
      <p>DOCTOR NAME : <b>{tablerecs[id].SNAME}</b></p>
      <p>QUALIFICATION : <b>{tablerecs[id].QUALIFICATION}</b></p>      
      <p>DEPARTMENT : <b>{tablerecs[id].DEPARTMENTNAME}</b></p>
      <p>DESIGNATION : <b>{tablerecs[id].DESIGNATION}</b></p>
      <p>EXPERTISE : <b>{tablerecs[id].EXPERTISE}</b></p>      
      </div>
      )
    );
    handleShow();
  }

    return (
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
                <h2 className="fw-bold mb-2 text-uppercase">View Records: Diagnosis Details</h2>
                <div className=" mt-5">
                    <table className="table table-striped table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>Sl. No.</th>
                                <th>DIAGNOSIS ID</th>
                                <th>APPOINTMENT ID</th>
                                <th>APPOINTMENT DATE</th>
                                <th>PATIENT NAME</th>
                                <th>DOCTOR NAME</th>                                
                            </tr>
                        </thead>
                        <tbody>                         
                          {tablerecs.map((srec,index)=>
                           <tr key={index}>
                              <td>{index+1}</td>
                              <td>{dgidFromdgidString(srec.DGID)}</td>
                              <td>{aidFromaidString(parseInt(srec.AID))}</td>                              
                              <td>{srec.APPDATE}</td>
                              <td>{srec.PNAME}</td>
                              <td>{srec.SNAME}</td>
                              <td><button className="btn btn-primary" onClick={(e)=>showDetail(index)} data-bs-toggle="modal" data-bs-target="#myModal">View Details</button></td>                              
                           </tr>
                           )}
                        </tbody>
                    </table>
                </div>

              </div>            
            </Card.Body>
          </Card>
        </Col>
      </Row>     
      
    </Container>  
  );
}

export default TableDiagnosisViewDOCTOR;
