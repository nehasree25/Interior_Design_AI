import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import ThemeToggle from '../components/ThemeToggle';
import { LogoMark, Field, SpinnerIcon, AuthTopBar } from '../components/AuthShared';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(formData);
    if (result.success) navigate('/');
    else setApiError(result.error || 'Sign in failed. Please try again.');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', position: 'relative' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 800px 600px at 25% 30%, var(--accent-soft), transparent 65%)',
      }} />

      <AuthTopBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={30} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Roomify AI
          </span>
        </div>
        <ThemeToggle />
      </AuthTopBar>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 20px 40px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-2xl)',
            padding: '36px 32px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
          }}>
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              opacity: 0.6,
            }} />

            {/* Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <LogoMark size={48} />
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                  Welcome back
                </h1>
                <p style={{ marginTop: 5, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Sign in to Roomify AI
                </p>
              </div>
            </div>

            {/* API error */}
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="alert alert-error"
                style={{ marginBottom: 20, fontSize: '0.85rem' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{apiError}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Email address" error={errors.email}>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} className="input-modern"
                  placeholder="you@company.com" disabled={loading} autoComplete="email"
                />
              </Field>

              <Field label="Password" error={errors.password}>
                <input
                  type="password" name="password" value={formData.password}
                  onChange={handleChange} className="input-modern"
                  placeholder="••••••••" disabled={loading} autoComplete="current-password"
                />
              </Field>

              <motion.button
                type="submit" disabled={loading} className="btn-primary"
                style={{ width: '100%', marginTop: 4, padding: '11px 20px' }}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.985 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <SpinnerIcon /> Signing in…
                  </span>
                ) : 'Sign in'}
              </motion.button>
            </form>

            <div style={{
              marginTop: 22, textAlign: 'center',
              borderTop: '1px solid var(--border)', paddingTop: 20,
            }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Don&apos;t have an account?{' '}
                <Link to="/signup" style={{ color: 'var(--text-accent)', fontWeight: 600, textDecoration: 'none' }}>
                  Create account
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

export default Login;
