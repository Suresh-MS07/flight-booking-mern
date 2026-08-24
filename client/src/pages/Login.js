import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaEnvelope, FaLock, FaPlaneDeparture, FaShieldAlt } from 'react-icons/fa';
import { apiRequest } from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Email or password is incorrect.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
    } catch (requestError) {
      setError(requestError.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-story" aria-hidden="true">
        <div className="auth-story-orbit"><FaPlaneDeparture /></div>
        <div className="auth-story-copy">
          <span className="auth-brand-label"><FaPlaneDeparture /> SkyBooker</span>
          <h2>Your whole journey, one login away.</h2>
          <p>Return to saved tickets, verified payments, and every upcoming trip.</p>
          <ul><li><FaCheck /> User-scoped booking history</li><li><FaCheck /> Instant ticket confirmation</li><li><FaCheck /> Secure Razorpay checkout</li></ul>
        </div>
        <div className="auth-proof"><FaShieldAlt /><span><strong>Privacy first</strong><small>Your trips stay tied to your account.</small></span></div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-box">
          <div className="auth-heading"><span className="section-kicker">Welcome back</span><h1>Sign in to SkyBooker</h1><p>Enter your details to continue your journey.</p></div>

          <form onSubmit={handleSubmit}>
            <label className="form-field form-field-full" htmlFor="login-email">
              <span>Email address</span>
              <div><FaEnvelope /><input id="login-email" type="email" name="email" value={formData.email} placeholder="name@example.com" autoComplete="email" onChange={handleChange} required /></div>
            </label>
            <label className="form-field form-field-full" htmlFor="login-password">
              <span>Password</span>
              <div><FaLock /><input id="login-password" type="password" name="password" value={formData.password} placeholder="Enter your password" autoComplete="current-password" onChange={handleChange} required /></div>
            </label>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'} {!submitting && <FaArrowRight />}
            </button>
          </form>

          <p className="auth-switch">New to SkyBooker? <Link to="/register">Create a free account</Link></p>
          <div className="auth-secure"><FaLock /> Your credentials are encrypted in transit.</div>
        </div>
      </section>
    </div>
  );
};

export default Login;
