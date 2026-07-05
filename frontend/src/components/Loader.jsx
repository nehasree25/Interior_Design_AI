const Loader = ({ message = 'Loading…' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 13, padding: '16px 0' }}>
    <div style={{ position: 'relative', width: 38, height: 38 }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: '2.5px solid var(--border-mid)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'loader-spin 0.65s linear infinite',
      }} />
      <style>{`@keyframes loader-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
    {message && (
      <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
        {message}
      </p>
    )}
  </div>
);

export default Loader;
