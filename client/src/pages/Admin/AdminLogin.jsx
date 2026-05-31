import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (login(password)) {
        navigate('/admin');
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="al-page">
      {/* Decorative background */}
      <div className="al-bg-overlay" />
      <div className="al-bg-pattern" />

      {/* Back to site */}
      <Link to="/" className="al-back-link">
        <ArrowLeft size={16} />
        <span>Back to Site</span>
      </Link>

      {/* Card */}
      <div className="al-card">
        {/* Logo */}
        <div className="al-logo-wrap">
          <img src="/logo.png" alt="The Lumora Weddings" className="al-logo" />
        </div>

        <div className="al-header">
          <h1 className="al-title">Admin Portal</h1>
          <p className="al-subtitle">THE LUMORA WEDDINGS</p>
          <div className="al-divider" />
          <p className="al-desc">Authorized personnel only. Enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="al-form" noValidate>
          <div className={`al-field ${error ? 'al-field--error' : ''}`}>
            <label htmlFor="admin-password" className="al-label">
              <Lock size={13} />
              Password
            </label>
            <div className="al-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter admin password"
                className="al-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="al-toggle-eye"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p className="al-error" role="alert">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className={`al-btn ${loading ? 'al-btn--loading' : ''}`}
            disabled={loading || !password}
            id="admin-login-submit"
          >
            {loading ? (
              <span className="al-spinner" />
            ) : (
              <>
                <Lock size={15} />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <p className="al-footer-note">
          © {new Date().getFullYear()} The Lumora Weddings — Internal Use Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
