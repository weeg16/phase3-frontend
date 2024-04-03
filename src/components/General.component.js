import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUsername: localStorage.getItem('username')
    };
  }

  componentDidMount() {
    this.handleWindowClick = this.handleWindowClick.bind(this);
    window.addEventListener('click', this.handleWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick);
  }

  handleSettingsButtonClick() {
    const dropdownContent = document.querySelector('.dropdown-content');
    const isDisplayed = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isDisplayed ? 'none' : 'block';
  }

  handleWindowClick(event) {
    const settingsButton = document.querySelector('.settings-button');
    const dropdownContent = document.querySelector('.dropdown-content');
    if (!settingsButton.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.style.display = 'none';
    }
  }

  render() {
    const { loggedInUsername } = this.state;

    return (
      <div className="container-general">
        <Link to="/reserve" className="general-button">Reserve</Link>
        <Link to="/edit-reservation" className="general-button">Edit Reservation</Link>
        <Link to="/seereservations" className="general-button">See Reservations</Link>

        {loggedInUsername === "00000000" && (
          <Link to="/admin" className="admin-button">Admin</Link>
        )}

        <div className="dropdown">
          <button className="settings-button button" onClick={this.handleSettingsButtonClick}>
            Settings
          </button>
          <div className="dropdown-content">
            <Link to="/profile">View profile</Link>
            <Link to="/login">Log out</Link>
          </div>
        </div>
      </div>
    );
  }
}
