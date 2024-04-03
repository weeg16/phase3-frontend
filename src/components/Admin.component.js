import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            reservations: [],
            loading: true,
            error: null,
            showUserList: false,
            showReservations: false, //
            roomName: "",
            date: "",
            timeSlot: ""
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const users = await response.json();

            const filteredUsers = users.filter(user => user.username !== '00000000');
            this.setState({ users: filteredUsers, loading: false });
        } catch (error) {
            console.error('Error fetching users:', error);
            this.setState({ error: 'Error fetching users', loading: false });
        }
    };

    fetchReservations = async () => {
        const { date, timeSlot, roomName } = this.state;
  
        if (!date || !timeSlot || !roomName) {
            console.log("Date, time slot, or room not provided for fetching reservations.");
            return;
        }
    
        this.setState({ loading: true });
    
        try {
            const url = `http://localhost:5000/rooms/reservations/${encodeURIComponent(roomName)}?date=${encodeURIComponent(date)}&timeSlot=${encodeURIComponent(timeSlot)}`;
            console.log("Fetching reservations from:", url);
    
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Reservations data:", data);
    
            this.setState({ reservations: data.reservations, loading: false, showReservations: true });
        } catch (error) {
            console.error('Error fetching reservations:', error);
            this.setState({ error: 'Failed to fetch reservations', loading: false });
        }
    };

    handleViewUserDetails = () => {
        this.setState({ showUserList: true, showReservations: false });
    };

    handleViewReservations = () => {
        this.setState({ showUserList: false, showReservations: true });
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleDeleteUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${encodeURIComponent(username)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            const updatedUsers = this.state.users.filter(user => user.username !== username);
            this.setState({ users: updatedUsers });
        } catch (error) {
            console.error('Error deleting user:', error);

        }
    };
    

    handleSubmit = (e) => {
        e.preventDefault();
        this.fetchReservations();
    };

    handleDeleteReservation = async (reservation) => {
        const { roomName, date, timeSlot } = this.state;

        try {
            const response = await fetch(`http://localhost:5000/rooms/reservations/${encodeURIComponent(roomName)}?date=${encodeURIComponent(date)}&timeSlot=${encodeURIComponent(timeSlot)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservation)
            });

            if (!response.ok) {
                throw new Error('Failed to delete reservation');
            }


            const updatedReservations = this.state.reservations.filter(item => item !== reservation);
            this.setState({ reservations: updatedReservations });
        } catch (error) {
            console.error('Error deleting reservation:', error);
  
        }
    };

    render() {
        const { users, loading, error, showUserList, showReservations, reservations, roomName, date, timeSlot } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <h2>Admin Panel</h2>
                <Link to="/general" className="back-button">
                    Back
                </Link>
                <div>
                    <Link to="/admin" className="admin-panel" onClick={this.handleViewUserDetails}>
                        View User Details
                    </Link>
                </div>
                <div>
                    <Link to="/admin" className="admin-panel" onClick={this.handleViewReservations}>
                        See Reservations
                    </Link>
                </div>
                {showUserList && (
                    <div>
                        <h2>User List</h2>
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                    <th>Action</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.username}</td>
                                        <td>
                                            <button onClick={() => this.handleDeleteUser(user.username)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showReservations && (
                    <div>
                        <h2>Reservations</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <label htmlFor="roomName">Room Name:</label>
                                <input type="text" id="roomName" name="roomName" value={roomName} onChange={this.handleInputChange} />
                            </div>
                            <div>
                                <label htmlFor="date">Date:</label>
                                <input type="date" id="date" name="date" value={date} onChange={this.handleInputChange} />
                            </div>
                            <div>
                                <label htmlFor="timeSlot">Time Slot:</label>
                                <select id="timeSlot" name="timeSlot" value={timeSlot} onChange={this.handleInputChange}>
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
                            <button type="submit">Fetch Reservations</button>
                        </form>
                        {reservations.length > 0 && (
                            <div>
                                <h3>Reservation Details:</h3>
                                <ul>
                                    {reservations.map((reservation, index) => (
                                        <li key={index}>
                                            <strong>Computer ID:</strong> {reservation.computerId}, <strong>Date:</strong> {reservation.date}, <strong>Time Slot:</strong> {reservation.timeSlot}, <strong>User ID:</strong> {reservation.userId}
                                            <button onClick={() => this.handleDeleteReservation(reservation)}>Delete</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
