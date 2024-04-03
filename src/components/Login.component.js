import React, { Component } from 'react';
import { Navigate, Link } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            loggedIn: false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;

        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }

            const userData = await response.json();

            if (!response.ok || !userData) {
                throw new Error('User not found or invalid credentials');
            }

            console.log('User is logged in');
            localStorage.setItem('username', username);
            console.log(username);
            this.setState({ loggedIn: true });
        } catch (error) {
            console.error('Error logging in:', error.message);
            if (error.message === 'Invalid response format') {
                alert('Error logging in. Please try again.');
            } else {
                alert('Invalid credentials. Please try again.');
            }
        }
    }

    render() {
        const { username, password, showPassword, loggedIn } = this.state;

        if (loggedIn) {
            return <Navigate to="/general" />;
        }

        return (
            <div className="login-container">
                <div className="login-box">
                    <div className="icon-text">DLSU LAB ROOM RESERVATION</div>
                    <Link to="/" className="back-button-login">Back</Link>
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            placeholder="username (ID number)"
                            className="login-input"
                            name="username"
                            value={username}
                            onChange={this.handleChange}
                            required
                        />
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                className="login-input"
                                name="password"
                                value={password}
                                onChange={this.handleChange}
                                required
                            />
                            <button type="button" className="toggle-password" onClick={this.togglePasswordVisibility}>
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}
