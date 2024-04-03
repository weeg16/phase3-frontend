import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      registrationSuccess: false
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
  
    const { firstName, lastName, username, password, confirmPassword } = this.state;
  
    // Validation
    if (username.length !== 8 || isNaN(username)) {
      alert('Username must be an 8-digit number.');
      return;
    }
  
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, username, password })
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      alert('Registration successful');
      this.setState({ registrationSuccess: true });
    } catch (error) {
      console.error('Error during registration:', error.message);
      alert('Registration failed. Please try again.');
    }
  };

  render() {
    const { registrationSuccess } = this.state;

    if (registrationSuccess) {
      return (
        <div className="container">
          <div className="left-panel">
            <h2>Registration Successful!</h2>
            <p>Please <Link to="/login">log in</Link> to continue.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="left-panel">
          <div className="register-title">Register</div>
          <Link to="/" className="back-button-register">Back</Link>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              className="input-field-register"
              id="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input-field-register"
              id="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              required
            />
            <input
              type="text"
              placeholder="Username (8-digit number)"
              className="input-field-register"
              id="username"
              value={this.state.username}
              onChange={this.handleChange}
              pattern="\d{8}"
              title="Username should be an 8-digit number"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field-register"
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field-register"
              id="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              required
            />
            <button type="submit" className="register-button">Sign up</button>
          </form>
        </div>
      </div>
    );
  }
}


