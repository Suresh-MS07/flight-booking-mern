import React, { useEffect, useState } from 'react';
import { FaPlane, FaBarcode, FaCheckCircle } from 'react-icons/fa';
import '../App.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('https://flight-api-suresh.onrender.com/api/bookings');
        const data = await response.json();
        if (response.ok) {
          setBookings(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Format Time Helper
  const formatTime = (dateString) => {
    if (!dateString) return "00:00";
    return dateString.includes('T') ? dateString.split('T')[1].slice(0, 5) : "10:00";
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary"></div>
      <p className="mt-2 text-muted">Fetching your tickets...</p>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">My Trips & Tickets 🎟️</h2>
      
      {bookings.length === 0 ? (
        <div className="alert alert-info shadow-sm">No bookings found. Time to plan a vacation! ✈️</div>
      ) : (
        <div className="row">
          {bookings.map((booking) => {
            // Random Seat/Gate generation for visuals
            const randomGate = "A" + Math.floor(Math.random() * 10 + 1);
            const seatNumber = booking.flightInfo.seatNumber || "Any";
            
            return (
              <div key={booking._id} className="col-12 col-xl-10 mx-auto">
                <div className="boarding-pass">
                  
                  {/* LEFT SIDE: Main Info */}
                  <div className="pass-main">
                    
                    {/* Header */}
                    <div className="pass-header">
                      <div className="d-flex align-items-center gap-2">
                        <FaPlane className="text-primary" />
                        <span className="fw-bold text-uppercase">{booking.flightInfo.airline}</span>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                        <FaCheckCircle /> Confirmed
                      </span>
                    </div>

                    {/* Route Big Codes */}
                    <div className="d-flex justify-content-between align-items-center my-4">
                      <div className="text-center">
                        <h1 className="big-code">{booking.flightInfo.from}</h1>
                        <p className="text-muted mb-0">Departure</p>
                      </div>
                      
                      <div className="text-center px-4">
                        <div style={{borderTop: '2px dashed #ddd', width: '100px', position: 'relative'}}>
                          <FaPlane style={{position:'absolute', top:'-10px', left:'40%', background:'white', color:'#ccc'}} />
                        </div>
                        <small className="text-muted">{booking.flightInfo.duration || "2h 15m"}</small>
                      </div>

                      <div className="text-center">
                        <h1 className="big-code">{booking.flightInfo.to}</h1>
                        <p className="text-muted mb-0">Arrival</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="row mt-4">
                      <div className="col-4">
                        <div className="pass-label">PASSENGER</div>
                        <div className="pass-value text-truncate">{booking.passengerName}</div>
                      </div>
                      <div className="col-4">
                        <div className="pass-label">FLIGHT</div>
                        <div className="pass-value">{booking.flightInfo.flightNumber}</div>
                      </div>
                      <div className="col-4">
                        <div className="pass-label">DATE</div>
                        <div className="pass-value">{booking.flightInfo.date}</div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT SIDE: Stub (Tear-off) */}
                  <div className="pass-stub">
                    <div className="mb-3">
                      <div className="pass-label">SEAT</div>
                      <h2 className="text-primary fw-bold display-6">{seatNumber}</h2> {/* Naya */}
                    </div>
                    
                    <div className="mb-4">
                      <div className="pass-label">GATE</div>
                      <h3 className="fw-bold text-dark">{randomGate}</h3>
                    </div>

                    <div className="mt-auto opacity-50">
                      <FaBarcode size={50} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;