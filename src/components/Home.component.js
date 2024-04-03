import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dlsuLogo from './dlsu_logo.png'; 


export default class Home extends Component {
   render() {
    return (
        <div className="container">
            <div className="logo-container">
                <img src={dlsuLogo} alt="DLSU Logo" className="logo" />
                <div className="icon-text-home">DLSU LAB ROOM RESERVATION</div>
            </div>
            <div className="box">
                <Link to="/login" className="button">Login</Link>
                <Link to="/register" className="button">Register</Link>
                <Link to="/slotavailability" className="button">View Slot Availability</Link>
            </div>
        </div>
    )
   }
}
