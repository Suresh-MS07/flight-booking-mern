import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import '../App.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://flight-api-suresh.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-wrapper">
      
      {/* LEFT SIDE: Image (Different Image for variety) */}
      <div className="auth-image-side" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"}}>
        <div className="auth-quote">
          <h2>Start Your <br/> Journey Today.</h2>
          <p>Join SkyBooker and book flights with zero hidden fees.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="auth-form-side">
        <div className="auth-box">
          <div className="mb-5">
            <h1 className="fw-bold">Create Account 🚀</h1>
            <p className="text-muted">Sign up to get started.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-muted small">FULL NAME</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control pro-auth-input" 
                  placeholder="John Doe" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-muted small">EMAIL ADDRESS</label>
              <div className="input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control pro-auth-input" 
                  placeholder="name@example.com" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-muted small">PASSWORD</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input 
                  type="password" 
                  name="password" 
                  className="form-control pro-auth-input" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button className="btn w-100 auth-btn mb-4">
              Create Account <FaArrowRight className="ms-2" />
            </button>
          </form>

          <p className="text-center text-muted">
            Already a member? <Link to="/login" className="fw-bold text-primary text-decoration-none">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;