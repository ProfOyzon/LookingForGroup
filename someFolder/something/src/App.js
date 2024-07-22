import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Proficiencies from "./Pages/Proficiencies";
import SoftHardSkills from "./Pages/SoftHardSkills";
import Project from "./Pages/Project";
import SideBar from "./Components/SideBar"
import ForgotPassword from "./Pages/ForgotPassword";
import AskEmail from "./Pages/AskEmail";
import DropDown from "./Components/DropDown";
import Button from "./Components/Button";
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
        <Route path= "/ForgotPassword" element={<ForgotPassword />} />
        <Route path= "/AskEmail" element={<AskEmail />} />
        <Route path= "/DropDown" element={<DropDown />} />
        <Route path = "/Button" element={<Button />} />
      </Routes>
    </Router>
  );
}

export default App;