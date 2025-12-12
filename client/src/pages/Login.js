import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight, FaGoogle } from 'react-icons/fa';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://flight-api-suresh.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert("Welcome back!");
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="auth-wrapper">
      
      {/* LEFT SIDE: Image */}
      <div className="auth-image-side">
        <div className="auth-quote">
          <h2>Explore the <br/> Unseen World.</h2>
          <p>Login to access exclusive flight deals and manage your trips.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="auth-form-side">
        <div className="auth-box">
          <div className="mb-5">
            <h1 className="fw-bold">Welcome Back! 👋</h1>
            <p className="text-muted">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label text-muted" htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="text-primary text-decoration-none fw-bold small">Forgot Password?</a>
            </div>

            <button className="btn w-100 auth-btn mb-4">
              Sign In <FaArrowRight className="ms-2" />
            </button>
          </form>

          {/* Social Login Dummy */}
          <button className="btn btn-light border w-100 py-2 mb-4 fw-bold text-muted">
            <FaGoogle className="me-2 text-danger" /> Continue with Google
          </button>

          <p className="text-center text-muted">
            Don't have an account? <Link to="/register" className="fw-bold text-primary text-decoration-none">Create free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;