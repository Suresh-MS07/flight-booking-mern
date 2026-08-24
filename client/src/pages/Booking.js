import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaEnvelope,
  FaLock,
  FaPlane,
  FaShieldAlt,
  FaSuitcaseRolling,
  FaUser,
} from 'react-icons/fa';
import { apiRequest } from '../config/api';

const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
const occupiedSeats = new Set(['1A', '1F', '2C', '3D', '4B', '5E']);

const formatTime = (value = '') => value.split('T')[1]?.slice(0, 5) || '--:--';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;
  const storedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; }
    catch { return {}; }
  }, []);

  const [userData, setUserData] = useState({ name: storedUser.name || '', email: storedUser.email || '', phone: '' });
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!flight) {
    return (
      <div className="state-page page-shell">
        <div className="state-card">
          <span className="state-icon"><FaPlane /></span>
          <h1>No flight selected</h1>
          <p>Choose a flight first, then we will keep it ready here.</p>
          <button type="button" className="button button-primary" onClick={() => navigate('/')}>Search flights</button>
        </div>
      </div>
    );
  }

  const itinerary = flight.itineraries?.[0] || {};
  const segments = itinerary.segments || [];
  const firstSegment = segments[0] || {};
  const lastSegment = segments[segments.length - 1] || firstSegment;
  const carrier = flight.validatingAirlineCodes?.[0] || firstSegment.carrierCode || 'SK';
  const price = flight.price?.total || 0;
  const flightNumber = `${firstSegment.carrierCode || carrier}-${firstSegment.number || '—'}`;

  const handleChange = (event) => {
    setUserData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const renderSeats = () => {
    const rows = [1, 2, 3, 4, 5, 6];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

    return rows.flatMap((row) => columns.map((column) => {
      const seatId = `${row}${column}`;
      const isSelected = selectedSeat === seatId;
      const isOccupied = occupiedSeats.has(seatId);

      return (
        <button
          type="button"
          key={seatId}
          className={`seat ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
          onClick={() => !isOccupied && setSelectedSeat(seatId)}
          aria-pressed={isSelected}
          aria-label={`Seat ${seatId}${isOccupied ? ', unavailable' : ''}`}
          disabled={isOccupied}
        >
          {seatId}
        </button>
      );
    }));
  };

  const saveBookingToDB = async (payment) => {
    const bookingData = {
      passengerName: userData.name,
      email: userData.email,
      phone: userData.phone,
      flightInfo: {
        airline: carrier,
        flightNumber,
        from: firstSegment.departure?.iataCode,
        to: lastSegment.arrival?.iataCode,
        price,
        date: firstSegment.departure?.at?.split('T')[0],
        seatNumber: selectedSeat,
      },
      payment,
    };

    const response = await apiRequest('/api/bookings', {
      auth: true,
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Unable to save booking');
    navigate('/my-bookings', { state: { booked: true } });
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    if (!selectedSeat) {
      document.getElementById('seat-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!window.Razorpay || !razorpayKeyId) {
      window.alert('Payment checkout is not configured. Please contact support.');
      return;
    }

    setProcessing(true);
    try {
      const orderResponse = await apiRequest('/api/payment/orders', {
        auth: true,
        method: 'POST',
        body: JSON.stringify({ amount: price }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.message || 'Order creation failed');

      const checkout = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: 'INR',
        name: 'SkyBooker',
        description: `${flightNumber} · ${firstSegment.departure?.iataCode} to ${lastSegment.arrival?.iataCode}`,
        order_id: order.id,
        prefill: { name: userData.name, email: userData.email, contact: userData.phone },
        theme: { color: '#246bfd' },
        modal: { ondismiss: () => setProcessing(false) },
        handler: async (payment) => {
          try {
            const verifyResponse = await apiRequest('/api/payment/verify', {
              auth: true,
              method: 'POST',
              body: JSON.stringify(payment),
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verification.message || 'Payment verification failed');
            await saveBookingToDB(payment);
          } catch (error) {
            window.alert(error.message || 'Payment verification failed');
            setProcessing(false);
          }
        },
      });

      checkout.open();
    } catch (error) {
      window.alert(error.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  return (
    <div className="booking-page page-shell">
      <button type="button" className="back-link" onClick={() => navigate(-1)}><FaArrowLeft /> Back to flights</button>

      <div className="checkout-heading">
        <div>
          <div className="eyebrow"><span /> Secure checkout</div>
          <h1>Complete your booking</h1>
          <p>Your fare is ready. Choose a seat and add the traveler details.</p>
        </div>
        <div className="checkout-steps" aria-label="Checkout progress">
          <span className="is-complete"><i><FaCheck /></i>Flight</span>
          <b />
          <span className="is-current"><i>2</i>Traveler</span>
          <b />
          <span><i>3</i>Payment</span>
        </div>
      </div>

      <div className="booking-layout">
        <aside className="booking-summary">
          <div className="summary-card">
            <div className="summary-head">
              <div className="airline-mark airline-mark-light">{carrier}</div>
              <div><strong>{carrier} Airlines</strong><span>{flightNumber}</span></div>
              <span className="verified-badge"><FaCheckCircle /> Verified</span>
            </div>

            <div className="summary-route">
              <div><strong>{formatTime(firstSegment.departure?.at)}</strong><span>{firstSegment.departure?.iataCode}</span></div>
              <div><FaPlane /><span>{segments.length > 1 ? `${segments.length - 1} stop` : 'Non-stop'}</span></div>
              <div><strong>{formatTime(lastSegment.arrival?.at)}</strong><span>{lastSegment.arrival?.iataCode}</span></div>
            </div>

            <div className="summary-details">
              <span><FaClock /> {itinerary.duration?.replace('PT', '').toLowerCase() || 'Flight duration'}</span>
              <span><FaSuitcaseRolling /> Cabin bag included</span>
            </div>

            <div className="summary-total">
              <div><span>Total fare</span><small>Taxes included</small></div>
              <strong>₹{Number(price).toLocaleString('en-IN')}</strong>
            </div>
          </div>
          <div className="secure-note"><FaShieldAlt /><div><strong>Secure by design</strong><span>Payment is verified before your booking is stored.</span></div></div>
        </aside>

        <div className="booking-content">
          <section className="checkout-card" id="seat-map">
            <div className="checkout-card-head">
              <div><span className="step-number">1</span><div><h2>Choose your seat</h2><p>Select one available economy seat.</p></div></div>
              {selectedSeat && <span className="selection-pill"><FaCheck /> Seat {selectedSeat}</span>}
            </div>

            <div className="seat-cabin">
              <div className="cockpit-label"><FaPlane /> Front of aircraft</div>
              <div className="seat-column-labels" aria-hidden="true"><span>A</span><span>B</span><span>C</span><i /><span>D</span><span>E</span><span>F</span></div>
              <div className="seat-grid">{renderSeats()}</div>
              <div className="seat-legend">
                <span><i className="seat-demo" /> Available</span>
                <span><i className="seat-demo is-selected" /> Selected</span>
                <span><i className="seat-demo is-occupied" /> Unavailable</span>
              </div>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-head">
              <div><span className="step-number">2</span><div><h2>Traveler details</h2><p>Use the name shown on the traveler's government ID.</p></div></div>
            </div>

            <form className="traveler-form" onSubmit={handlePayment}>
              <label className="form-field form-field-full" htmlFor="passenger-name">
                <span>Full name</span>
                <div><FaUser /><input id="passenger-name" name="name" value={userData.name} onChange={handleChange} placeholder="Suresh Mewada" required /></div>
              </label>
              <label className="form-field" htmlFor="passenger-email">
                <span>Email address</span>
                <div><FaEnvelope /><input id="passenger-email" type="email" name="email" value={userData.email} onChange={handleChange} placeholder="name@example.com" required /></div>
              </label>
              <label className="form-field" htmlFor="passenger-phone">
                <span>Phone number</span>
                <div><span className="field-prefix">+91</span><input id="passenger-phone" type="tel" name="phone" value={userData.phone} onChange={handleChange} placeholder="98765 43210" minLength={7} required /></div>
              </label>

              <div className="checkout-action form-field-full">
                <div className="payment-assurance"><FaLock /><span><strong>Encrypted checkout</strong><small>Powered by Razorpay</small></span></div>
                <button type="submit" className="button button-primary payment-button" disabled={processing || !selectedSeat}>
                  <FaCreditCard /> {processing ? 'Preparing payment…' : `Pay ₹${Number(price).toLocaleString('en-IN')}`}
                </button>
              </div>
              {!selectedSeat && <p className="seat-reminder form-field-full">Choose a seat above to unlock secure payment.</p>}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Booking;
