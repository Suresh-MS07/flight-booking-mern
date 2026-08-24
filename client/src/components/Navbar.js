import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaPlaneDeparture, FaSignOutAlt, FaTimes, FaUserCircle } from 'react-icons/fa';

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = readUser();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link className="brand" to="/" aria-label="SkyBooker home">
          <span className="brand-mark"><FaPlaneDeparture /></span>
          <span>
            <strong>SkyBooker</strong>
            <small>Travel, simplified</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-content ${menuOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            <NavLink to="/" end>Explore</NavLink>
            <NavLink to="/my-bookings">My trips</NavLink>
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <div className="user-chip">
                  <FaUserCircle />
                  <span>
                    <small>Welcome back</small>
                    <strong>{user.name?.split(' ')[0] || 'Traveler'}</strong>
                  </span>
                </div>
                <button type="button" className="button button-ghost button-small" onClick={handleLogout}>
                  <FaSignOutAlt /> Log out
                </button>
              </>
            ) : (
              <>
                <Link className="button button-ghost button-small" to="/login">Log in</Link>
                <Link className="button button-primary button-small" to="/register">Create account</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
