import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaBarcode,
  FaCalendarCheck,
  FaCheck,
  FaCheckCircle,
  FaPlane,
  FaPlus,
  FaRupeeSign,
} from 'react-icons/fa';
import { apiRequest } from '../config/api';

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchBookings = async () => {
      try {
        const response = await apiRequest('/api/bookings', { auth: true });
        const data = await response.json();
        if (!active) return;
        if (response.ok) setBookings(Array.isArray(data) ? data : []);
        else setError(data.message || 'Unable to fetch bookings');
      } catch {
        if (active) setError('Unable to connect to the booking service');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchBookings();
    return () => { active = false; };
  }, []);

  const totalBooked = useMemo(
    () => bookings.reduce((sum, booking) => sum + Number(booking.flightInfo?.price || 0), 0),
    [bookings],
  );

  if (loading) {
    return (
      <div className="trips-page page-shell">
        <div className="trips-loading">
          <span className="loading-plane"><FaPlane /></span>
          <h2>Preparing your travel desk</h2>
          <p>Fetching your tickets securely…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trips-page page-shell">
      {location.state?.booked && (
        <div className="success-banner"><span><FaCheck /></span><div><strong>Booking confirmed</strong><p>Your ticket is ready and a confirmation email is on its way.</p></div></div>
      )}

      <div className="trips-heading">
        <div>
          <div className="eyebrow"><span /> Personal travel desk</div>
          <h1>Your trips, all in one place.</h1>
          <p>Open a ticket anytime and keep the journey details close.</p>
        </div>
        <button type="button" className="button button-primary" onClick={() => navigate('/')}><FaPlus /> Book another flight</button>
      </div>

      <div className="trip-stats">
        <div><span className="stat-icon"><FaCalendarCheck /></span><div><small>Confirmed trips</small><strong>{bookings.length}</strong></div></div>
        <div><span className="stat-icon stat-icon-green"><FaCheckCircle /></span><div><small>Booking status</small><strong>{bookings.length ? 'All set' : 'No trips yet'}</strong></div></div>
        <div><span className="stat-icon stat-icon-amber"><FaRupeeSign /></span><div><small>Total booked</small><strong>₹{totalBooked.toLocaleString('en-IN')}</strong></div></div>
      </div>

      {error && (
        <div className="state-card">
          <span className="state-icon">!</span><h2>We could not load your trips</h2><p>{error}</p>
          <button type="button" className="button button-primary" onClick={() => navigate('/login')}>Sign in again</button>
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className="empty-trips">
          <div className="empty-trip-visual"><FaPlane /><i /><i /></div>
          <div><span className="section-kicker">Your passport is waiting</span><h2>No trips booked yet</h2><p>Search live fares and turn your next destination into a confirmed ticket.</p></div>
          <button type="button" className="button button-primary" onClick={() => navigate('/')}>Explore flights <FaArrowRight /></button>
        </div>
      )}

      {!error && bookings.length > 0 && (
        <section className="ticket-list" aria-label="Confirmed flight tickets">
          <div className="ticket-list-head"><h2>Confirmed tickets</h2><span>{bookings.length} total</span></div>
          {bookings.map((booking) => {
            const info = booking.flightInfo || {};
            const gateSeed = Number.parseInt(String(booking._id).slice(-2), 16) || 1;
            const gate = `A${(gateSeed % 10) + 1}`;
            const travelDate = info.date
              ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${info.date}T00:00:00`))
              : 'Date unavailable';

            return (
              <article className="boarding-pass" key={booking._id}>
                <div className="pass-main">
                  <div className="pass-header">
                    <div className="ticket-airline"><span className="airline-mark">{info.airline || 'SK'}</span><div><strong>{info.airline || 'SkyBooker'} Airlines</strong><small>{info.flightNumber || 'Flight'}</small></div></div>
                    <span className="confirmed-pill"><FaCheckCircle /> Confirmed</span>
                  </div>

                  <div className="pass-route">
                    <div><strong>{info.from || '—'}</strong><span>Departure</span></div>
                    <div className="pass-route-line"><span>Ready for takeoff</span><div><i /><FaPlane /><i /></div><small>{travelDate}</small></div>
                    <div><strong>{info.to || '—'}</strong><span>Arrival</span></div>
                  </div>

                  <div className="pass-details">
                    <div><small>Passenger</small><strong>{booking.passengerName}</strong></div>
                    <div><small>Flight</small><strong>{info.flightNumber || '—'}</strong></div>
                    <div><small>Travel date</small><strong>{travelDate}</strong></div>
                    <div><small>Fare</small><strong>₹{Number(info.price || 0).toLocaleString('en-IN')}</strong></div>
                  </div>
                </div>

                <div className="pass-stub">
                  <div className="stub-brand"><FaPlane /> BOARDING PASS</div>
                  <div className="stub-grid"><div><small>Seat</small><strong>{info.seatNumber || 'Any'}</strong></div><div><small>Gate</small><strong>{gate}</strong></div></div>
                  <FaBarcode className="barcode" />
                  <small className="booking-reference">REF {String(booking._id).slice(-8).toUpperCase()}</small>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default MyBookings;
