
import Sidebar from "../components/Sidebar";
import './styles.css'

import Collaborators from "../pages/collaborators";
import Schedule from "../pages/schedule/schedule";
import Services from "../pages/services/services";
import Workdays from "../pages/workdays/workdays";

import { Route, Routes } from 'react-router-dom';

export default function Layout(): JSX.Element { 
  return (
    <div className="Layout_container">
      <div className="Layout_Sidebar">
        <Sidebar />
      </div>
      <Routes>
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/workdays" element={<Workdays />} />
        <Route path="/services" element={<Services />} />
        <Route path="/collaborators" element={<Collaborators />} />
      </Routes>
      {/* <Workdays />
      <Services />
      <Collaborators /> */}
    </div>
  )
}