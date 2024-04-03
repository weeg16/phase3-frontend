import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SeeReservations extends Component {
  state = {
    reservations: [],
    isLoading: false,
    error: null,
    editingReservationId: null,
    editedReservationData: {
      computerId: '',
      date: '',
      timeSlot: ''
    }
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

  handleEdit = (reservationId, initialData) => {
    this.setState({
      editingReservationId: reservationId,
      editedReservationData: initialData
    });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      editedReservationData: {
        ...prevState.editedReservationData,
        [name]: value
      }
    }));
  };
  
  handleSubmitEdit = async () => {
    const { editingReservationId, editedReservationData, reservations } = this.state;
  
    const { computerId, date, timeSlot } = editedReservationData;
  
    const isReservationAvailable = !reservations.some(reservation => {
        return reservation.date === date &&
               reservation.timeSlot === timeSlot &&
               reservation.computerId === computerId && 
               reservation._id !== editingReservationId;
    });
    
  
    if (!isReservationAvailable) {
      console.log("This computer ID is not available for the specified date and time slot.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/rooms/edit/${editingReservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedReservationData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }
  
      const updatedReservation = await response.json();
      this.setState(prevState => ({
        reservations: prevState.reservations.map(reservation =>
          reservation._id === editingReservationId ? updatedReservation : reservation
        ),
        editingReservationId: null,
        editedReservationData: {
          computerId: '',
          date: '',
          timeSlot: ''
        }
      }));
  
      console.log("Reservation updated successfully");
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };
  
  
  
  handleDelete = async (reservationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/rooms/delete/${reservationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      this.setState(prevState => ({
        reservations: prevState.reservations.filter(reservation => reservation._id !== reservationId)
      }));

      console.log("Reservation deleted successfully");
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  render() {
    const { reservations, isLoading, error, editingReservationId, editedReservationData } = this.state;

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
                  {editingReservationId === reservation._id ? (
                    <div>
                      <input
                        type="text"
                        name="computerId"
                        value={editedReservationData.computerId}
                        onChange={this.handleInputChange}
                        placeholder="Computer ID"
                      />
                      <input
                        type="text"
                        name="date"
                        value={editedReservationData.date}
                        onChange={this.handleInputChange}
                        placeholder="Date"
                      />
                      <input
                        type="text"
                        name="timeSlot"
                        value={editedReservationData.timeSlot}
                        onChange={this.handleInputChange}
                        placeholder="Time Slot"
                      />
                      <button onClick={this.handleSubmitEdit}>Save</button>
                    </div>
                  ) : (
                    <div>
                      <strong>Computer ID:</strong> {reservation.computerId}, <strong>Date:</strong> {reservation.date}, <strong>Time Slot:</strong> {reservation.timeSlot}
                      <button onClick={() => this.handleEdit(reservation._id, reservation)}>Edit</button>
                      <button onClick={() => this.handleDelete(reservation._id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : <p>No reservations found.</p>}
      </div>
    );
  }
}