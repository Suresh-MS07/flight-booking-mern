import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'; // CSS import zaroori hai seat styling ke liye

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  // States
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Agar user bina flight select kiye seedha URL se aaye
  if (!flight) return <div className="container mt-5 text-center"><h2>⚠️ No flight selected! Please search first.</h2></div>;

  const price = flight.price.total;

  // Input Change Handler
  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  // --- 💺 SEAT SELECTION LOGIC ---
  const renderSeats = () => {
    const rows = [1, 2, 3, 4, 5, 6]; // 6 Rows
    const cols = ['A', 'B', 'C', 'D', 'E', 'F']; // 6 Columns
    
    return (
      <div className="seat-grid mt-4">
        {rows.map(row => (
          cols.map(col => {
            const seatId = `${row}${col}`;
            const isSelected = selectedSeat === seatId;
            
            // Seat Styling Logic
            let seatClass = "seat";
            if (isSelected) seatClass += " selected";
            
            // Beech mein rasta (C aur D ke beech gap)
            const style = col === 'D' ? { marginLeft: '25px' } : {};

            return (
              <div 
                key={seatId} 
                className={seatClass} 
                style={style}
                onClick={() => setSelectedSeat(seatId)}
              >
                {seatId}
              </div>
            );
          })
        ))}
      </div>
    );
  };

  // --- 💳 PAYMENT & BOOKING LOGIC ---
  const handlePayment = async (e) => {
    e.preventDefault();

    // 1. Validation Checks
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please Login first to book tickets!");
      navigate('/login');
      return;
    }
    if (!selectedSeat) {
      alert("Please select a seat first! 💺");
      return;
    }

    try {
      // 2. Order Create (Backend)
      const orderRes = await fetch('https://flight-api-suresh.onrender.com/api/payment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price })
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error("Order creation failed");

      // 3. Razorpay Options
      const options = {
        key: "rzp_test_RqRWpBjjhnRtKl", // Apni Test Key ID
        amount: orderData.amount,
        currency: "INR",
        name: "SkyBooker Flights",
        description: `Booking Flight ${flight.validatingAirlineCodes[0]}`,
        order_id: orderData.id,
        
        // 4. Success Handler
        handler: async function (response) {
          const verifyRes = await fetch('https://flight-api-suresh.onrender.com/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.message === "Payment Verified Successfully") {
            saveBookingToDB(); // Payment sahi hai, ab save karo
          } else {
            alert("Payment Verification Failed! ❌");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone
        },
        theme: { color: "#008cff" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed. See console.");
    }
  };

  // --- 💾 SAVE TO DATABASE ---
  const saveBookingToDB = async () => {
    const bookingData = {
      passengerName: userData.name,
      email: userData.email,
      phone: userData.phone,
      flightInfo: {
        airline: flight.validatingAirlineCodes[0],
        flightNumber: `${flight.itineraries[0].segments[0].carrierCode}-${flight.itineraries[0].segments[0].number}`,
        from: flight.itineraries[0].segments[0].departure.iataCode,
        to: flight.itineraries[0].segments[0].arrival.iataCode,
        price: flight.price.total,
        date: flight.itineraries[0].segments[0].departure.at.split('T')[0],
        seatNumber: selectedSeat // 🔥 Selected seat save kar rahe hain
      }
    };

    const response = await fetch('https://flight-api-suresh.onrender.com/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (response.ok) {
      // Success Alert & Redirect
      alert(`🎉 Success! Your seat ${selectedSeat} is confirmed.`);
      navigate('/my-bookings');
    }
  };

  // --- 🖥️ UI RENDER ---
  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">
        
        {/* Left Side: Flight Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold">✈️ Flight Summary</h5>
            </div>
            <div className="card-body">
              <p className="mb-1 text-muted small">AIRLINE</p>
              <h6 className="fw-bold">{flight.validatingAirlineCodes[0]} Airlines</h6>
              <hr />
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-1 text-muted small">FROM</p>
                  <h4 className="fw-bold">{flight.itineraries[0].segments[0].departure.iataCode}</h4>
                </div>
                <div className="text-end">
                  <p className="mb-1 text-muted small">TO</p>
                  <h4 className="fw-bold">{flight.itineraries[0].segments[0].arrival.iataCode}</h4>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-muted">Total Price</span>
                <h3 className="text-primary fw-bold mb-0">₹{price}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Seat & Form */}
        <div className="col-md-8">
          
          {/* 1. SEAT SELECTION BOX */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">💺 Select Your Seat</h5>
            </div>
            <div className="card-body text-center">
              <div className="plane-map p-3">
                <div className="mb-3 text-muted small fw-bold tracking-wide">FRONT OF PLANE (COCKPIT)</div>
                {renderSeats()} {/* Seats Yahan Dikhengi */}
                
                <div className="mt-4 d-flex justify-content-center gap-4 text-small">
                  <div className="d-flex align-items-center gap-2"><div className="seat" style={{width:20, height:20}}></div> Available</div>
                  <div className="d-flex align-items-center gap-2"><div className="seat selected" style={{width:20, height:20}}></div> Selected</div>
                </div>

                <p className="mt-3 fw-bold text-primary border p-2 rounded bg-light d-inline-block px-4">
                  {selectedSeat ? `Selected Seat: ${selectedSeat}` : "Please tap a seat to select"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. PASSENGER FORM */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">📝 Passenger Details</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handlePayment}>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold small text-muted">FULL NAME</label>
                    <input type="text" name="name" className="form-control form-control-lg" placeholder="As per Aadhaar" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">EMAIL ADDRESS</label>
                    <input type="email" name="email" className="form-control form-control-lg" placeholder="name@example.com" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">PHONE NUMBER</label>
                    <input type="tel" name="phone" className="form-control form-control-lg" placeholder="+91 98765 43210" required onChange={handleChange} />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 btn-lg mt-4 py-3 fw-bold shadow">
                  CONFIRM SEAT & PAY ₹{price}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;