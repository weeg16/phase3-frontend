import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import './Register.css';
import './Login.css';
import './SlotAvailability.css';
import './General.css';
import './Reserve.css';
import './Profile.css';
import './ReserveComputer.css';
import './Admin.css';
import './SeeReservations.css';
import './ReserveLab.css';
import './EditReservations.css';

import Home from './components/Home.component';
import Login from './components/Login.component'; 
import Register from './components/Register.component';
import SlotAvailability from './components/SlotAvailability.component'; 
import General from './components/General.component';
import Reserve from './components/Reserve.component';
import Profile from './components/Profile.component';
import ReserveComputer from './components/ReserveComputer.component';
import ReserveLab from './components/ReserveLab.component';
import Admin from './components/Admin.component';
import SeeReservations from './components/SeeReservations.component';
import EditReservations from './components/EditReservations.component';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register />} /> 
                <Route path="/slotavailability" element={<SlotAvailability />} />
                <Route path="/general" element={<General />} /> 
                <Route path="/seereservations" element={<SeeReservations />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/reservecomputer" element={<ReserveComputer />} />
                <Route path="/reservelab" element={<ReserveLab />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-reservation" element={<EditReservations />} />
            </Routes>
        </Router>
    );
}

export default App;
