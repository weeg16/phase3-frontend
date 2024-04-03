import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SlotAvailability extends Component {
  state = {
    rooms: [],
    selectedRoom: "",
    selectedDate: "",
    selectedTimeSlot: "",
    reservations: [],
    isLoading: false,
    error: null,
    showSeatPlan: false, 
  };

  componentDidMount() {
    this.fetchRooms();
  }

  fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      this.setState({ rooms: data });
    } catch (error) {
      console.error('Error fetching rooms:', error);
      this.setState({ error: 'Failed to fetch rooms' });
    }
  };

  fetchReservations = async () => {
    const { selectedDate, selectedTimeSlot, selectedRoom } = this.state;
    if (!selectedDate || !selectedTimeSlot || !selectedRoom) {
      console.log("Date, time slot, or room not provided for fetching reservations.");
      return;
    }
  
    this.setState({ isLoading: true });
  
    try {
      const response = await fetch(`http://localhost:5000/rooms/reservations/${encodeURIComponent(selectedRoom)}?date=${encodeURIComponent(selectedDate)}&timeSlot=${encodeURIComponent(selectedTimeSlot)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const reservedComputerIds = data.reservations.map(reservation => reservation.computerId);
      this.setState({ reservations: reservedComputerIds, isLoading: false, showSeatPlan: true }); 
    } catch (error) {
      console.error('Error fetching reservations:', error);
      this.setState({ error: 'Failed to fetch reservations', isLoading: false });
    }
  };
  

  handleRoomChange = (e) => {
    this.setState({ selectedRoom: e.target.value });
  };

  handleDateChange = (e) => {
    this.setState({ selectedDate: e.target.value });
  };

  handleTimeSlotChange = (e) => {
    this.setState({ selectedTimeSlot: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchReservations();
  };

  renderSeatPlan = () => {
    const { selectedRoom } = this.state;
  
    const checkReservedRooms = ['L320', 'L335', 'G304B', 'G306', 'G404', 'Y603', 'V211', 'V301', 'J213'];
  
    if (checkReservedRooms.includes(selectedRoom) && selectedRoom !== "") {
      const isReserved = this.state.reservations.includes(1); 
      return (
        <div>
          <h3>Reservation Status:</h3>
          <p>{isReserved ? "RESERVED" : "NOT RESERVED"}</p>
        </div>
      );
    } else {
      const totalComputers = 25;
      const computersPerRow = 5;
      const rows = totalComputers / computersPerRow;
  
      const { reservations } = this.state;

      const computerStatus = Array.from({ length: totalComputers }, () => 'available');
  
      reservations.forEach(computerId => {
        if (computerId && computerId <= totalComputers) {
          computerStatus[computerId - 1] = 'reserved';
        }
      });
  
      const seatPlan = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < computersPerRow; j++) {
          const computerNumber = i * computersPerRow + j + 1;
          const isAvailable = computerStatus[computerNumber - 1] === 'available';
          row.push(
            <div key={computerNumber} className={`seat ${isAvailable ? 'available' : 'reserved'}`}>
              {computerNumber}
            </div>
          );
        }
        seatPlan.push(<div key={i} className="row">{row}</div>);
      }
  
      return <div className="seat-plan">{seatPlan}</div>;
    }
  };
  

  render() {
    const { rooms, selectedRoom, selectedDate, selectedTimeSlot, isLoading, error, showSeatPlan } = this.state;

    return (
      <div>
        <h2>Slot Availability</h2>
        <Link to="/" className="back-button">Back</Link>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Select Room:</label>
            <select value={selectedRoom} onChange={this.handleRoomChange}>
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room._id} value={room.name}>{room.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Select Date:</label>
            <input type="date" value={selectedDate} onChange={this.handleDateChange} />
          </div>
          <div>
            <label>Select Time Slot:</label>
            <select value={selectedTimeSlot} onChange={this.handleTimeSlotChange}>
              <option value="">Select a time slot</option>
              <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 1:00 PM">12:00 PM - 1:00 PM</option>
              <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
              <option value="2:00 PM - 3:00 PM">2:00 PM - 3:00 PM</option>
              <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
              <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
            </select>
          </div>
          <button type="submit">Check Availability</button>
        </form>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : showSeatPlan && ( 
          <div>
            <h3>Seat Plan:</h3>
            {this.renderSeatPlan()}
          </div>
        )}
      </div>
    );
  }
}


