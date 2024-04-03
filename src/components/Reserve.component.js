import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Reserve extends Component {
  handleSettingsButtonClick = () => {
    const dropdownContent = document.querySelector('.dropdown-content');
    const isDisplayed = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isDisplayed ? 'none' : 'block';
  };

  handleWindowClick = (event) => {
    const settingsButton = document.querySelector('.settings-button');
    const dropdownContent = document.querySelector('.dropdown-content');
    if (!settingsButton.contains(event.target) && !dropdownContent.contains(event.target)) {
      dropdownContent.style.display = 'none';
    }
  };

  render() {
    return (
      <div className="reserve-container">
        <Link to ="/reservecomputer" className="general-button">Reserve a Computer</Link>
        <Link to ="/reservelab" className="general-button">Reserve Lab</Link>

        <div className="dropdown">
          <button className="settings-button button" onClick={this.handleSettingsButtonClick}>
            Settings
          </button>
          <div className="dropdown-content">
            <Link to="/profile">View profile</Link>
            <Link to="/login">Log out</Link>
          </div>
        </div>

        <Link to="/general" className="back-button">Back</Link>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick);
  }
}