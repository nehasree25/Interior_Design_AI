import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import ThemeToggle from '../components/ThemeToggle';

const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.01em' }}>
      {label}
    </label>
    {children}
    {error && (
      <span style={{ fontSize: '0.76rem', color: 'var(--color-error)', fontWeight: 500, marginTop: 2 }}>
        {error}
      </span>
    )}
  </div>
);

const LogoMark = ({ size = 44 }) => (
  <div style={{
    width: size, height: size, borderRadius: 'var(--r-lg)',
    background: 'linear-gradient(140deg, var(--accent) 0%, #818CF8 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow-accent)', flexShrink: 0,
  }}>
    <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  </div>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'spin 0.7s linear infinite' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirm: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'At least 2 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Minimum 8 characters';
    if (!formData.password_confirm) e.password_confirm = 'Please confirm your password';
    else if (formData.password !== formData.password_confirm) e.password_confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await signup(formData);
    if (result.success) navigate('/');
    else {
      if (typeof result.error === 'object') setErrors(result.error);
      else setApiError(result.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 800px 600px at 75% 25%, var(--accent-soft), transparent 65%)' }} />

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 28px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(18px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={32} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Arkeo
          </span>
        </div>
        <ThemeToggle />
      </div>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-2xl)', padding: '36px 32px',
            boxShadow: 'var(--shadow-lg)', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.6 }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <LogoMark size={48} />
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                  Create your account
                </h1>
                <p style={{ marginTop: 5, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Start designing interiors with AI
                </p>
              </div>
            </div>

            {apiError && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="alert alert-error" style={{ marginBottom: 18, fontSize: '0.85rem' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{apiError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Full name" error={errors.name}>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="input-modern" placeholder="Jane Smith" disabled={loading} autoComplete="name" />
              </Field>
              <Field label="Email address" error={errors.email}>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="input-modern" placeholder="you@company.com" disabled={loading} autoComplete="email" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Password" error={errors.password}>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    className="input-modern" placeholder="Min 8 chars" disabled={loading} autoComplete="new-password" />
                </Field>
                <Field label="Confirm password" error={errors.password_confirm}>
                  <input type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange}
                    className="input-modern" placeholder="Repeat" disabled={loading} autoComplete="new-password" />
                </Field>
              </div>

              <motion.button type="submit" disabled={loading} className="btn-primary"
                style={{ width: '100%', marginTop: 6, padding: '11px 20px' }}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <SpinnerIcon /> Creating account…
                  </span>
                ) : 'Create account'}
              </motion.button>
            </form>

            <div style={{ marginTop: 22, textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--text-accent)', fontWeight: 600, textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            AI-powered interior design · Powered by Flux Pro
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
