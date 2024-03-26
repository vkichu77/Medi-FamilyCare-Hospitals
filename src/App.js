import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Loginpage from "./Pages/Loginpage";
import Loggedin from "./Components/Loggedin";
import Logoutpage from "./Pages/Logoutpage";
import TableStaffOperations from "./Components/TableStaffOperations";
import TablePatientOperations from "./Components/TablePatientOperations";
import TableAppointmentOperations from "./Components/TableAppointmentOperations";
import TableCancelAppointmentOperations from "./Components/TableCancelAppointmentOperations";
import TableDiagnosisOperations from "./Components/TableDiagnosisOperations";

function App() {
  return (
    <div className="App">
      <Router basename="/Medi-FamilyCare">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loginpage" element={<Loginpage />} />
          <Route path="/logoutpage" element={<Logoutpage />} />
          <Route path="/loggedin" element={<Loggedin />} />
          <Route path="/tablestaffoperations" element={<TableStaffOperations />} />           
          <Route path="/tablepatientoperations" element={<TablePatientOperations />} />
          <Route path="/tableappointmentoperations" element={<TableAppointmentOperations />} />
          <Route path="/tablecancelappointmentoperations" element={<TableCancelAppointmentOperations />} />
          <Route path="/tablediagnosisoperations" element={<TableDiagnosisOperations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
