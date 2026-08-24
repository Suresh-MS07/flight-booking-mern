import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaEnvelope, FaLock, FaPlaneDeparture, FaShieldAlt, FaUser } from 'react-icons/fa';
import { apiRequest } from '../config/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'We could not create your account.');
      navigate('/login', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-story auth-story-register" aria-hidden="true">
        <div className="auth-story-orbit"><FaPlaneDeparture /></div>
        <div className="auth-story-copy">
          <span className="auth-brand-label"><FaPlaneDeparture /> SkyBooker</span>
          <h2>One account. A world of possibilities.</h2>
          <p>Create your travel space and move from live fare to confirmed seat with less friction.</p>
          <ul><li><FaCheck /> Search live airline offers</li><li><FaCheck /> Choose your preferred seat</li><li><FaCheck /> Keep tickets organized</li></ul>
        </div>
        <div className="auth-proof"><FaShieldAlt /><span><strong>Secure onboarding</strong><small>Passwords are protected with bcrypt hashing.</small></span></div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-box">
          <div className="auth-heading"><span className="section-kicker">Start exploring</span><h1>Create your account</h1><p>It only takes a minute to set up your travel space.</p></div>

          <form onSubmit={handleSubmit}>
            <label className="form-field form-field-full" htmlFor="register-name">
              <span>Full name</span>
              <div><FaUser /><input id="register-name" name="name" value={formData.name} placeholder="Your full name" autoComplete="name" onChange={handleChange} required /></div>
            </label>
            <label className="form-field form-field-full" htmlFor="register-email">
              <span>Email address</span>
              <div><FaEnvelope /><input id="register-email" type="email" name="email" value={formData.email} placeholder="name@example.com" autoComplete="email" onChange={handleChange} required /></div>
            </label>
            <label className="form-field form-field-full" htmlFor="register-password">
              <span>Password</span>
              <div><FaLock /><input id="register-password" type="password" name="password" value={formData.password} placeholder="At least 8 characters" minLength={8} autoComplete="new-password" onChange={handleChange} required /></div>
            </label>

            <p className="password-hint"><span /> Use at least 8 characters for a stronger password.</p>
            {error && <p className="auth-error" role="alert">{error}</p>}

            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'} {!submitting && <FaArrowRight />}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
          <div className="auth-secure"><FaLock /> By continuing, you agree to secure account-based bookings.</div>
        </div>
      </section>
    </div>
  );
};

export default Register;
