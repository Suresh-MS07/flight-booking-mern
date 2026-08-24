import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaBolt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExchangeAlt,
  FaHeadset,
  FaPlane,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaShieldAlt,
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const airportNames = {
  DEL: 'New Delhi',
  BOM: 'Mumbai',
  BLR: 'Bengaluru',
  HYD: 'Hyderabad',
  PNQ: 'Pune',
  GOI: 'Goa',
};

const popularRoutes = [
  { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai' },
  { from: 'BLR', to: 'HYD', label: 'Bengaluru → Hyderabad' },
  { from: 'PNQ', to: 'GOI', label: 'Pune → Goa' },
];

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ from: 'DEL', to: 'BOM', date: '' });
  const [formError, setFormError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (event) => {
    const value = event.target.name === 'date'
      ? event.target.value
      : event.target.value.replace(/[^a-z]/gi, '').toUpperCase();

    setFormData((current) => ({ ...current, [event.target.name]: value }));
    setFormError('');
  };

  const swapAirports = () => {
    setFormData((current) => ({ ...current, from: current.to, to: current.from }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const from = formData.from.trim();
    const to = formData.to.trim();

    if (from.length !== 3 || to.length !== 3 || !formData.date) {
      setFormError('Enter two valid 3-letter airport codes and choose a departure date.');
      return;
    }

    if (from === to) {
      setFormError('Origin and destination must be different.');
      return;
    }

    navigate(`/search?from=${from}&to=${to}&date=${formData.date}`);
  };

  const selectPopularRoute = ({ from, to }) => {
    setFormData((current) => ({ ...current, from, to }));
    setFormError('');
    document.getElementById('flight-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="eyebrow eyebrow-light"><span /> Live fare discovery</div>
            <h1>Where will your next story begin?</h1>
            <p>
              Compare real-time flight offers, choose your seat, and complete a verified checkout—all in one calm, focused journey.
            </p>
            <div className="hero-trust-row">
              <div className="avatar-stack" aria-hidden="true">
                <span>SM</span><span>AK</span><span>RV</span>
              </div>
              <div>
                <strong><FaStar /> Built for confident booking</strong>
                <small>Live inventory · secure payments · instant tickets</small>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-flight-card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            aria-hidden="true"
          >
            <div className="flight-card-topline">
              <span>Next adventure</span>
              <span className="live-pill"><i /> Live</span>
            </div>
            <div className="mini-route">
              <div><strong>DEL</strong><span>New Delhi</span></div>
              <div className="mini-route-line"><FaPlane /></div>
              <div><strong>BOM</strong><span>Mumbai</span></div>
            </div>
            <div className="mini-ticket-meta">
              <div><small>Cabin</small><strong>Economy</strong></div>
              <div><small>Journey</small><strong>Non-stop</strong></div>
              <div><small>Protection</small><strong>Verified</strong></div>
            </div>
          </motion.div>
        </div>

        <motion.div
          id="flight-search"
          className="search-console"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
        >
          <div className="search-console-head">
            <div className="trip-tabs" role="tablist" aria-label="Trip type">
              <button type="button" role="tab" className="trip-tab is-active" aria-selected="true">One way</button>
              <button type="button" role="tab" className="trip-tab" aria-selected="false" disabled>Round trip <small>Soon</small></button>
            </div>
            <div className="fare-note"><FaCheckCircle /> No hidden platform fee</div>
          </div>

          <form onSubmit={handleSearch} noValidate>
            <div className="search-fields">
              <label className="travel-field" htmlFor="from-airport">
                <span><FaPlaneDeparture /> From</span>
                <input
                  id="from-airport"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  maxLength={3}
                  autoComplete="off"
                  aria-describedby="from-city"
                />
                <small id="from-city">{airportNames[formData.from] || 'Airport code'}</small>
              </label>

              <button type="button" className="swap-button" onClick={swapAirports} aria-label="Swap origin and destination">
                <FaExchangeAlt />
              </button>

              <label className="travel-field" htmlFor="to-airport">
                <span><FaPlaneArrival /> To</span>
                <input
                  id="to-airport"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  maxLength={3}
                  autoComplete="off"
                  aria-describedby="to-city"
                />
                <small id="to-city">{airportNames[formData.to] || 'Airport code'}</small>
              </label>

              <label className="travel-field travel-field-date" htmlFor="departure-date">
                <span><FaCalendarAlt /> Departure</span>
                <input
                  id="departure-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  min={today}
                  onChange={handleChange}
                />
                <small>{formData.date ? 'Ready to fly' : 'Choose a date'}</small>
              </label>

              <div className="travel-field travel-field-static" aria-label="One traveler in economy">
                <span><FaUsers /> Travelers</span>
                <strong>1 Traveler</strong>
                <small>Economy</small>
              </div>

              <button type="submit" className="button button-primary search-action">
                Search flights <FaArrowRight />
              </button>
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
          </form>
        </motion.div>
      </section>

      <section className="route-shortcuts section-shell" aria-labelledby="popular-routes-title">
        <div>
          <span className="section-kicker">Popular now</span>
          <h2 id="popular-routes-title">Quick routes</h2>
        </div>
        <div className="route-chip-list">
          {popularRoutes.map((route) => (
            <button type="button" className="route-chip" key={route.label} onClick={() => selectPopularRoute(route)}>
              <span><FaPlane /></span>{route.label}<FaArrowRight />
            </button>
          ))}
        </div>
      </section>

      <section className="experience-section section-shell">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> Thoughtful by design</div>
            <h2>Travel booking, minus the turbulence.</h2>
          </div>
          <p>Every step is designed to keep the important details clear—from fare discovery to the ticket in your inbox.</p>
        </div>

        <div className="experience-grid">
          <article className="experience-card experience-card-featured">
            <div className="feature-icon"><FaBolt /></div>
            <span className="card-index">01</span>
            <h3>Live offers, one focused view</h3>
            <p>Amadeus-powered flight inventory is distilled into clear timings, duration, route, and price.</p>
            <div className="fare-preview">
              <div><span>AI</span><strong>Air India</strong><small>DEL → BOM</small></div>
              <strong>₹6,420</strong>
            </div>
          </article>

          <article className="experience-card">
            <div className="feature-icon"><FaShieldAlt /></div>
            <span className="card-index">02</span>
            <h3>Verified checkout</h3>
            <p>Razorpay signatures are verified server-side before a booking is saved.</p>
          </article>

          <article className="experience-card">
            <div className="feature-icon"><FaPlaneDeparture /></div>
            <span className="card-index">03</span>
            <h3>Your trips, organized</h3>
            <p>Access user-scoped booking history and boarding-pass details from one place.</p>
          </article>

          <article className="experience-card experience-card-wide">
            <div className="wide-card-copy">
              <div className="feature-icon"><FaHeadset /></div>
              <span className="card-index">04</span>
              <h3>Built for the entire journey</h3>
              <p>Responsive interfaces, accessible controls, instant email confirmation, and a checkout that stays clear on every screen.</p>
            </div>
            <div className="journey-steps" aria-label="Booking journey">
              <span className="is-complete">Search</span>
              <i />
              <span className="is-complete">Select</span>
              <i />
              <span>Fly</span>
            </div>
          </article>
        </div>
      </section>

      <section className="home-cta section-shell">
        <div>
          <span className="section-kicker section-kicker-light">Your next trip is closer than it feels</span>
          <h2>Ready when you are.</h2>
        </div>
        <button type="button" className="button button-light" onClick={() => document.getElementById('flight-search')?.scrollIntoView({ behavior: 'smooth' })}>
          Find a flight <FaArrowRight />
        </button>
      </section>
    </div>
  );
};

export default Home;
