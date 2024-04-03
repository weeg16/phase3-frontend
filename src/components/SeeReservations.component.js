import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SeeReservations extends Component {
  state = {
    reservations: [],
    isLoading: false,
    error: null,
  };

  componentDidMount() {
    this.fetchReservations();
  }

  fetchReservations = async () => {
    const userId = localStorage.getItem('username');

    if (!userId) {
      console.log("User ID not found in local storage.");
      return;
    }

    this.setState({ isLoading: true });

    try {
      const url = `http://localhost:5000/rooms/reservationsview`;
      console.log("Fetching reservations for user ID:", userId);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Reservations data:", data);

      const userReservations = data.reduce((acc, room) => {
        const userRoomReservations = room.reservations.filter(reservation => reservation.userId === userId);
        return acc.concat(userRoomReservations);
      }, []);

      this.setState({ reservations: userReservations, isLoading: false });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      this.setState({ error: 'Failed to fetch reservations', isLoading: false });
    }
  };

  render() {
    const { reservations, isLoading, error } = this.state;

    return (
      <div>
        <Link to="/general" className="back-button">Back</Link>
        <h2>Reservations</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : reservations.length > 0 ? (
          <div>
            <h3>My Reservations:</h3>
            <ul>
              {reservations.map((reservation, index) => (
                <li key={index}>
                  <strong>Computer ID:</strong> {reservation.computerId}, <strong>Date:</strong> {reservation.date}, <strong>Time Slot:</strong> {reservation.timeSlot}
                </li>
              ))}
            </ul>
          </div>
        ) : <p>No reservations found.</p>}
      </div>
    );
  }
}
