import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaPlaneDeparture, FaShieldAlt } from 'react-icons/fa';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-shell">
      <div className="footer-brand">
        <span className="brand-mark brand-mark-light"><FaPlaneDeparture /></span>
        <div>
          <strong>SkyBooker</strong>
          <p>Search live fares. Pay securely. Travel confidently.</p>
        </div>
      </div>

      <div className="footer-links">
        <Link to="/">Explore flights</Link>
        <Link to="/my-bookings">My trips</Link>
        <a href="https://github.com/Suresh-MS07/flight-booking-mern" target="_blank" rel="noreferrer">
          <FaGithub /> Source code
        </a>
      </div>

      <div className="footer-trust"><FaShieldAlt /> Payments secured with Razorpay</div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} SkyBooker</span>
      <span>Built by Suresh Mewada</span>
    </div>
  </footer>
);

export default Footer;
