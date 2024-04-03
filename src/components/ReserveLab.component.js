import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ReserveLab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      computerId: '1',
      date: '',
      timeSlot: '',
      availableTimeSlots: [
        '9:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '12:00 PM - 1:00 PM',
        '1:00 PM - 2:00 PM',
        '2:00 PM - 3:00 PM',
        '3:00 PM - 4:00 PM',
        '4:00 PM - 5:00 PM',
      ],
      submitting: false,
      message: '',
      seatingArrangement: new Array(25).fill(false),
    };
  }

  handleSeatClick = (computerId) => {
    this.setState({ 
      computerId, 
      timeSlot: '', 
    });
  };

  handleTimeSlotClick = (timeSlot) => {
    this.setState({ timeSlot });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ submitting: true });
  
    try {
      const currentDate = new Date();
      const selectedDate = new Date(this.state.date);
  
      selectedDate.setHours(17, 0, 0, 0);
  
      console.log('Current Date:', currentDate);
      console.log('Selected Date:', selectedDate);
  
      if (selectedDate < currentDate) {
        window.alert('You cannot reserve for a past date.');
        return;
      }
  
      if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
        window.alert('Reservations are not allowed on weekends.');
        return;
      }
  
      const existingReservationsResponse = await fetch(`http://localhost:5000/rooms/reservations?date=${this.state.date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const existingReservations = await existingReservationsResponse.json();
  
      const userId = localStorage.getItem('username');
      const userExistingReservation = existingReservations.find(reservation => reservation.userId === userId);
      if (userExistingReservation) {
        window.alert('You already have a reservation for this date.');
        return;
      }
  
      const response = await fetch('http://localhost:5000/rooms/reservelab', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: this.state.roomName,
          computerId: this.state.computerId,
          date: this.state.date,
          timeSlot: this.state.timeSlot,
          userId: userId,
        }),
      });
      const data = await response.json();
      this.setState({ message: data.message });
  
      if (data.message === 'Reservation successful') {
        const updatedSeating = [...this.state.seatingArrangement];
        updatedSeating[this.state.computerId - 1] = true; 
        this.setState({ seatingArrangement: updatedSeating });
      }
    } catch (error) {
      console.error('Error making reservation:', error);
      window.alert('Failed to make reservation');
    } finally {
      this.setState({ submitting: false });
    }
  };
  
  

  renderTimeSlots = () => {
    const { availableTimeSlots, computerId } = this.state;
    if (!computerId) return null; 

    return (
      <div className="time-slots-reservelab">
        {availableTimeSlots.map((timeSlot, index) => (
          <button
            key={index}
            className="time-slot-reservelab"
            onClick={() => this.handleTimeSlotClick(timeSlot)}
          >
            {timeSlot}
          </button>
        ))}
      </div>
    );
  };

  render() {
    const { roomName, date, timeSlot, submitting, message } = this.state;
  
    const today = new Date();
  
    const selectedDate = new Date(date);
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  
    const isPastDate = selectedDate < today;
  
    const roomNames = ['L320', 'L335', 'G304B', 'G306', 'G404', 'Y603', 'V211', 'V301', 'J213'];
  
    return (
      <div className="reserve-lab-container" style={{ display: 'flex', flexDirection: 'column'}}>
        <Link to="/general" className="back-button">Back</Link>
        <form onSubmit={this.handleSubmit}>
          <label>
            Room Name:
            <select value={roomName} onChange={(e) => this.setState({ roomName: e.target.value })}>
              <option value="">Select a room</option>
              {roomNames.map((room, index) => (
                <option key={index} value={room}>{room}</option>
              ))}
            </select>
          </label>
          <label>
            Date:
            <input type="date" value={date} min={today.toISOString().split('T')[0]} onChange={(e) => this.setState({ date: e.target.value })} />
          </label>
          <label>
            Time Slot:
            <input 
              type="text" 
              value={timeSlot} 
              readOnly 
            />
          </label>
          <button className="submit" type="submit" disabled={submitting || isWeekend || isPastDate}>Reserve</button>
        </form>
        {submitting}
        {this.renderTimeSlots()}
        {message}
        {isWeekend}
        {isPastDate}
      </div>
    );
  }
}  
