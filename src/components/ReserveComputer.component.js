import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ReserveComputer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      computerId: '',
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
      reservedComputers: [], // Track reserved computer IDs
    };
  }

  // Fetch reservations based on selected room, date, and time slot
  fetchReservations = async () => {
    const { date, timeSlot, roomName } = this.state;
    if (!date || !timeSlot || !roomName) return;
    
    try {
      const response = await fetch(`http://localhost:5000/rooms/reservations/${encodeURIComponent(roomName)}?date=${encodeURIComponent(date)}&timeSlot=${encodeURIComponent(timeSlot)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const reservedComputerIds = data.reservations.map(reservation => reservation.computerId);
      this.setState({ reservedComputers: reservedComputerIds });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      this.setState({ message: 'Failed to fetch reservations' });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.roomName !== prevState.roomName || this.state.date !== prevState.date || this.state.timeSlot !== prevState.timeSlot) {
      this.fetchReservations();
    }
  }

  handleSeatClick = (computerId) => {
    if (this.state.reservedComputers.includes(computerId)) return; // Prevent selection if computer is reserved
    this.setState({ computerId });
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

      if (selectedDate < currentDate) {
        this.setState({ message: 'You cannot reserve for a past date.' });
        return;
      }

      if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
        this.setState({ message: 'Reservations are not allowed on weekends.' });
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
        this.setState({ message: 'You already have a reservation for this date.' });
        return;
      }

      const response = await fetch('http://localhost:5000/rooms/reserve', {
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
        this.setState(prevState => ({
          seatingArrangement: prevState.seatingArrangement.map((seat, index) => index + 1 === prevState.computerId ? true : seat),
        }));
      }
    } catch (error) {
      console.error('Error making reservation:', error);
      this.setState({ message: 'Failed to make reservation' });
    } finally {
      this.setState({ submitting: false });
    }
  };

  renderTimeSlots = () => {
    const { availableTimeSlots, computerId } = this.state;
    if (!computerId) return null;

    return (
      <div className="time-slots">
        {availableTimeSlots.map((timeSlot, index) => (
          <button
            key={index}
            className="time-slot"
            onClick={() => this.handleTimeSlotClick(timeSlot)}
          >
            {timeSlot}
          </button>
        ))}
      </div>
    );
  };

  render() {
    const { roomName, computerId, date, submitting, message, reservedComputers } = this.state;

    const today = new Date();
    const selectedDate = new Date(date);
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const isPastDate = selectedDate < today;

    const roomNames = ['LS212', 'LS229', 'G302', 'G304A', 'Y602', 'V103', 'J212'];

    const seatElements = this.state.seatingArrangement.map((reserved, index) => {
      const isReserved = reserved || reservedComputers.includes(index + 1);
      return (
        <div
          key={index}
          className={`seat ${isReserved ? 'reserved' : 'available'}`}
          onClick={() => !isReserved && this.handleSeatClick(index + 1)}
        >
          {index + 1}
        </div>
      );
    });

    return (
      <div className="reserve-computer-container">
        <Link to="/general" className="back-button">Back</Link>
        <form onSubmit={this.handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <label style={{ marginRight: '1em' }}>
              Room Name:
              <select value={roomName} onChange={(e) => this.setState({ roomName: e.target.value })}>
                <option value="">Select a room</option>
                {roomNames.map((room, index) => (
                  <option key={index} value={room}>{room}</option>
                ))}
              </select>
            </label>
            <label style={{ marginRight: '1em', color: '#000' }}>
            Computer ID:
            <input
              type="number"
              value={computerId}
              style={{ pointerEvents: 'none', backgroundColor: '#cdcf0', color: '#000' }} // Apply custom styles
            />
          </label>
            <label style={{ marginRight: '1em' }}>
              Date:
              <input type="date" value={date} min={today.toISOString().split('T')[0]} onChange={(e) => this.setState({ date: e.target.value })} />
            </label>
          </div>
          <button type="submit" disabled={submitting || isWeekend || isPastDate}>Reserve</button>
        </form>
        {submitting && <p>Submitting reservation...</p>}
        <p>{message}</p>
        <div className="seating-arrangement">
          <h3>Computer Seats</h3>
          <div className="seats-grid">
            {seatElements}
          </div>
          {this.renderTimeSlots()}
        </div>
      </div>
    );
  }
}
