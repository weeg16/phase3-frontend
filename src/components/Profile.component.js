import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Profile extends Component {
    state = {
        user: {},
        isLoading: true,
        error: null,
        editing: false,
        editedCourse: '',
        editedDescription: ''
    };

    componentDidMount() {
        this.fetchUserData();
    }

    fetchUserData = () => {
        const username = localStorage.getItem('username');

        if (!username) {
            this.setState({ isLoading: false, error: 'Username not found in localStorage' });
            return;
        }

        fetch(`http://localhost:5000/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ user: data, isLoading: false });
            })
            .catch(error => {
                this.setState({ error: error.message, isLoading: false });
            });
    };

    handleEdit = () => {
        const { user } = this.state;
        this.setState({
            editing: true,
            editedCourse: user.course,
            editedDescription: user.description
        });
    };

    handleSave = async () => {
        const { editedCourse, editedDescription } = this.state;
        const username = localStorage.getItem('username');

        try {
            const response = await fetch(`http://localhost:5000/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course: editedCourse, description: editedDescription })
            });

            if (!response.ok) {
                throw new Error('Failed to update user details');
            }

            this.fetchUserData();
            this.setState({ editing: false });
        } catch (error) {
            console.error('Error updating user details:', error.message);
            alert('Failed to update user details. Please try again.');
        }
    };

    handleDelete = async () => {
        const username = localStorage.getItem('username');
    
        try {
            const response = await fetch(`http://localhost:5000/users/${username}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete user account');
            }
    
            localStorage.removeItem('username');
    
            window.location.href = '/login';

            alert('User account deleted successfully.');
        } catch (error) {
            console.error('Error deleting user account:', error.message);
            alert('Failed to delete user account. Please try again.');
        }
    };
    

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    render() {
        const { user, isLoading, error, editing, editedCourse, editedDescription } = this.state;

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div className="profile-container">
                <Link to="/general" className="back-button">
                    Back
                </Link>
                <h1 className="profile-title">User Profile</h1>
                <div className="profile-details">
                    <p>Username: {user.username}</p>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>

                    {editing ? (
                        <div>
                            <input
                                type="text"
                                placeholder="Course"
                                className="input-field"
                                id="editedCourse"
                                value={editedCourse}
                                onChange={this.handleChange}
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                className="input-field"
                                id="editedDescription"
                                value={editedDescription}
                                onChange={this.handleChange}
                            />
                            <div className="edit-button-container">
                                <button onClick={this.handleSave}>Save</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>Course: {user.course}</p>
                            <p>Description: {user.description}</p>
                            <div className="edit-button-container">
                                <button onClick={this.handleEdit}>Edit Course & Description</button>
                                <button onClick={this.handleDelete}>Delete Account</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
