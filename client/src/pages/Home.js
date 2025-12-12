import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; // ✅ Import Framer Motion
import '../App.css';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ from: 'DEL', to: 'BOM', date: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (formData.from && formData.to && formData.date) {
      navigate(`/search?from=${formData.from}&to=${formData.to}&date=${formData.date}`);
    } else {
      alert('Please fill details');
    }
  };

  return (
    <div>
      {/* 1. Hero Gradient Section */}
      <div className="hero-container">
        <motion.div 
          className="text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="display-4 fw-bold">Make Your Travel Dreams Reality</h1>
          <p className="lead">Unbeatable prices on domestic and international flights.</p>
        </motion.div>

        {/* 2. Floating Search Widget */}
        {/* ✅ FIX: motion.div shuru hua */}
        <motion.div 
          className="search-widget"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          
          <div className="d-flex mb-3 gap-4">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tripType" defaultChecked />
              <label className="form-check-label fw-bold">One Way</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="tripType" disabled />
              <label className="form-check-label text-muted">Round Trip <span className="badge bg-secondary" style={{fontSize: '0.6rem'}}>COMING SOON</span></label>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="row g-2">
              
              <div className="col-md-4">
                <div className="input-box">
                  <label className="input-label">FROM</label>
                  <div className="d-flex align-items-center">
                    <FaPlaneDeparture className="text-muted me-2" />
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="DEL" 
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      maxLength={3}
                    />
                  </div>
                  <small className="text-truncate text-muted">Delhi, India</small>
                </div>
              </div>

              <div className="col-md-4">
                <div className="input-box">
                  <label className="input-label">TO</label>
                  <div className="d-flex align-items-center">
                    <FaPlaneArrival className="text-muted me-2" />
                    <input 
                      type="text" 
                      className="custom-input" 
                      placeholder="BOM" 
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      maxLength={3}
                    />
                  </div>
                  <small className="text-truncate text-muted">Mumbai, India</small>
                </div>
              </div>

              <div className="col-md-4">
                <div className="input-box">
                  <label className="input-label">DEPARTURE</label>
                  <div className="d-flex align-items-center">
                    <FaCalendarAlt className="text-muted me-2" />
                    <input 
                      type="date" 
                      className="custom-input" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      style={{fontSize: '1.1rem'}}
                    />
                  </div>
                  <small className="text-muted">Select Date</small>
                </div>
              </div>

            </div>

            <button type="submit" className="search-btn">
              SEARCH FLIGHTS
            </button>
          </form>

        </motion.div> {/* ✅ FIX: motion.div yahan band hua (pehle div tha) */}
      </div>
      
      {/* 3. Extra Content */}
      <div className="container" style={{marginTop: '80px'}}>
        <h3 className="fw-bold mb-4">Why Book With Us?</h3>
        <div className="row">
            <div className="col-md-4">
                <div className="p-3 border rounded text-center">
                    <h4>⚡ Fast Booking</h4>
                    <p className="text-muted">Book your tickets in just 60 seconds.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="p-3 border rounded text-center">
                    <h4>💸 Best Prices</h4>
                    <p className="text-muted">We guarantee the lowest airfares.</p>
                </div>
            </div>
            <div className="col-md-4">
                <div className="p-3 border rounded text-center">
                    <h4>🔒 Secure Payment</h4>
                    <p className="text-muted">100% Secure payments via Razorpay.</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Home;