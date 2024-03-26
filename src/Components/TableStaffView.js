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

function TableStaffView({ mystylebor, funcViewSTAFF }) {


  const [tablerecs, setTablerecs] = useState([]);    
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  useEffect(() => { 
    funcViewSTAFF.current = getallstaffs;
    funcViewSTAFF.current();
  }, [funcViewSTAFF]);

  function getallstaffs() {
    fetch('/getallstaffs')
    .then(response => {
      if(response.status === 401) {          
        throw new Error("Error: Table StaffDetails");
      } else if(response.status === 400) {          
        throw new Error("Error: Session could not be established!");
      }      
      return response.json()
    })
    .then(data => setTablerecs(data))      
    .catch(error => console.log(error));
  }

  function dateDBtoForm(dateStaff) {
    var dt1   = parseInt(dateStaff.substring(8,10));
    var mon1  = parseInt(dateStaff.substring(5,7));
    var yr1   = parseInt(dateStaff.substring(0,4));
    dateStaff = new Date(yr1, mon1, dt1);
    // console.log(date1, yr1, mon1, dt1);
    var formatDate = dateStaff.getDate() < 10 ? `0${dateStaff.getDate()}`:dateStaff.getDate();
    var formatMonth = dateStaff.getMonth() < 10 ? `0${dateStaff.getMonth()}`: dateStaff.getMonth();
    return( [dateStaff.getFullYear(), formatMonth, formatDate].join('-') );  
  }

  const showDetail = (id) =>
  {
    var jd = dateDBtoForm(tablerecs[id].JOINDATE);
    var dob = dateDBtoForm(tablerecs[id].DOB);
    // console.log(jd);
    setModalTitle("Staff Details");
    setModalMessage(
      (
      <div className="modal-body">
      <p>ACCESS LEVEL : <b>{tablerecs[id].TYPE}</b></p>
      <p>STAFF ID : <b>{tablerecs[id].STAFFID}</b></p>
      <p>STAFF NAME : <b>{tablerecs[id].SNAME}</b></p>
      <p>SEX : <b>{tablerecs[id].SEX}</b></p>      
      <p>DATE OF BIRTH : <b>{dob}</b></p>            
      <p>ADDRESS : <b>{tablerecs[id].ADDRESS}</b></p>
      <p>QUALIFICATION : <b>{tablerecs[id].QUALIFICATION}</b></p>
      <p>DEPARTMENT : <b>{tablerecs[id].DEPARTMENTNAME}</b></p>
      <p>EXPERTISE : <b>{tablerecs[id].EXPERTISE}</b></p>
      <p>JOINING DATE : <b>{jd}</b></p>
      <p>DESIGNATION : <b>{tablerecs[id].DESIGNATION}</b></p>
      <p>EMAIL : <b>{tablerecs[id].EMAIL}</b></p>
      <p>PASSWORD : <b>{tablerecs[id].PASSWD}</b></p>      
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
                <h2 className="fw-bold mb-2 text-uppercase">View Records: Staff Details</h2>
                <div className=" mt-5">
                    <table className="table table-striped table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>No</th>
                                <th>STAFFID</th>
                                <th>STAFF NAME</th>
                                <th>EMAIL</th>
                                <th>Show Details</th>
                            </tr>
                        </thead>
                        <tbody>                         
                          {tablerecs.map((srec,index)=>
                           <tr key={index}>
                              <td>{index+1}</td>
                              <td>{srec.STAFFID}</td>
                              <td>{srec.SNAME}</td>
                              <td>{srec.EMAIL}</td>
                              <td><button className="btn btn-primary"  onClick={(e)=>showDetail(index)} data-bs-toggle="modal" data-bs-target="#myModal">View Details</button></td>
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

export default TableStaffView;
