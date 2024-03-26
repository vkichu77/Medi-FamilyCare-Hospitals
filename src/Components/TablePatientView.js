import React, { useEffect, useState  } from "react";
import {
  // InputGroup,
  Col,
  // Button,
  Row,
  Container,
  Card,
  // Form,
  // Modal
} from "react-bootstrap";

function TablePatientView({ mystylebor, funcView }) {

  const [tablerecs, setTablerecs] = useState([]);    
    
  useEffect(() => { 
    funcView.current = getallpatients;
    funcView.current();
  }, [funcView]);

  function getallpatients() {
    fetch('/getallpatients')
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

    return (
      <Container>      
      <Row className="vh-100 d-flex justify-content-center align-items-top">
        <Col md={10} lg={8} xs={12}>
          <div className={mystylebor}></div>
          <Card className="shadow">
            <Card.Body>
              <div className="mb-3 mt-4">
                <h2 className="fw-bold mb-2 text-uppercase">View Records: Patient Details</h2>
                <div className=" mt-5">
                    <table className="table table-striped table-sm">
                        <thead className="thead-light">
                            <tr>
                                <th>No</th>
                                <th>PATIENTID</th>
                                <th>PATIENT NAME</th>
                                <th>SEX</th>
                                <th>AGE</th>
                                <th>MOBILE NO.</th>                                
                            </tr>
                        </thead>
                        <tbody>                         
                          {tablerecs.map((srec,index)=>
                           <tr key={index}>
                              <td>{index+1}</td>
                              <td>{srec.PATIENTID}</td>
                              <td>{srec.PNAME}</td>
                              <td>{srec.SEX}</td>
                              <td>{srec.AGE}</td>
                              <td>{srec.MOBILE}</td>                              
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

export default TablePatientView;
