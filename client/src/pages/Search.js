import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaPlane, FaClock } from 'react-icons/fa';
import '../App.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`https://flight-api-suresh.onrender.com/api/flights/search?from=${from}&to=${to}&date=${date}`);
        const data = await response.json();

        if (response.ok) {
          setFlights(data);
        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [from, to, date]);

  // Helper to format time (e.g., 2025-10-10T10:00:00 -> 10:00)
  const formatTime = (isoString) => isoString.split('T')[1].slice(0, 5);
  
  // Helper to calculate duration (approximate for UI)
  const calculateDuration = (segment) => {
    // Amadeus duration string (PT2H15M) ko parse karna complex hai, 
    // abhi ke liye static dikhate hain ya simple logic lagate hain
    return segment.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
  };

  return (
    <div className="container" style={{ marginTop: '50px', marginBottom: '80px' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Flights from {from} to {to}</h2>
          <p className="text-muted mb-0">{new Date(date).toDateString()} | {flights.length} Flights Found</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => navigate('/')}>Modify Search</button>
      </div>
      
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Scanning airlines for best fares...</p>
        </div>
      )}

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      {!loading && !error && flights.length === 0 && (
        <div className="text-center py-5">
          <h3>😔 No flights found</h3>
          <p className="text-muted">Try changing the date or route.</p>
        </div>
      )}

      {/* Flight List */}
      <div className="flight-list">
        {flights.map((flight, index) => {
          const itinerary = flight.itineraries[0];
          const segment = itinerary.segments[0];
          const carrierCode = flight.validatingAirlineCodes[0];
          const price = flight.price.total;

          return (
            <div key={index} className="flight-strip">
              
              {/* 1. Airline Info */}
              <div className="airline-info">
                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                  <FaPlane className="text-primary" />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">{carrierCode} Airlines</h6>
                  <small className="text-muted">{segment.carrierCode}-{segment.number}</small>
                </div>
              </div>

              {/* 2. Timings & Route */}
              <div className="flight-timings">
                <div className="text-center">
                  <h4 className="fw-bold mb-0">{formatTime(segment.departure.at)}</h4>
                  <small className="fw-bold text-muted">{segment.departure.iataCode}</small>
                </div>

                <div className="route-line-container px-3">
                  <span className="route-duration">{calculateDuration(segment)}</span>
                  <div className="route-line"></div>
                  <small className="text-muted mt-1" style={{fontSize: '0.7rem'}}>Non-stop</small>
                </div>

                <div className="text-center">
                  <h4 className="fw-bold mb-0">{formatTime(segment.arrival.at)}</h4>
                  <small className="fw-bold text-muted">{segment.arrival.iataCode}</small>
                </div>
              </div>

              {/* 3. Price & Book */}
              <div className="price-section">
                <h3 className="fw-bold text-dark mb-2">₹{price}</h3>
                <button 
                  className="book-btn-sm shadow-sm"
                  onClick={() => navigate('/book', { state: { flight: flight } })}
                >
                  Book Now
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;