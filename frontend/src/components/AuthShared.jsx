/**
 * Shared UI primitives used by Login and Signup pages.
 * Centralised here to avoid duplication.
 */

export const LogoMark = ({ size = 44 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: 'var(--r-lg)',
    background: 'linear-gradient(140deg, var(--accent) 0%, #D4922E 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow-accent)',
    flexShrink: 0,
  }}>
    <svg
      width={size * 0.48} height={size * 0.48}
      viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  </div>
);

export const Field = ({ label, error, children }) => (
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

export const SpinnerIcon = () => (
  <svg
    width="14" height="14"
    viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ animation: 'auth-spin 0.7s linear infinite' }}
  >
    <style>{`@keyframes auth-spin { to { transform: rotate(360deg); } }`}</style>
    <path
      strokeLinecap="round"
      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
    />
  </svg>
);

/** Shared top-bar for auth pages */
export const AuthTopBar = ({ children }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 28px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--nav-bg)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
  }}>
    {children}
  </div>
);
