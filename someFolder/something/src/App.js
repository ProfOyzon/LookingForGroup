import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Proficiencies from "./Pages/Proficiencies";
import SoftHardSkills from "./Pages/SoftHardSkills";
import Project from "./Pages/Project";
import SideBar from "./Components/SideBar"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Proficiencies" element={<Proficiencies />} />
        <Route path="/SoftHardSkills" element={<SoftHardSkills />} />
        <Route path= "/Project" element={<Project />} />
        <Route path= "/SideBar" element={<SideBar />} />
      </Routes>
    </Router>
  );
}

export default App;