import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlaneDeparture, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Icons import

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand brand-logo d-flex align-items-center" to="/">
          <FaPlaneDeparture className="me-2" /> SkyBooker
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">My Trips</Link>
                </li>
                <li className="nav-item d-flex align-items-center ms-3">
                  <FaUserCircle size={25} className="text-primary me-2" />
                  <span className="fw-bold text-dark">{user.name.split(' ')[0]}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-3 rounded-pill px-3">
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-primary rounded-pill px-4 me-2" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary rounded-pill px-4" to="/register">Register</Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;