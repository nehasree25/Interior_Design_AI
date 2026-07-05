import { useState } from 'react';
import { motion } from 'framer-motion';

const BrokenImage = ({ label }) => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 8, background: 'var(--bg-sunken)',
  }}>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <line x1="3" y1="3" x2="21" y2="21"/>
    </svg>
    <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500 }}>
      {label} unavailable
    </span>
  </div>
);

const DesignCard = ({ design }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [genBroken, setGenBroken]       = useState(false);
  const [origBroken, setOrigBroken]     = useState(false);

  const isBroken   = showOriginal ? origBroken : genBroken;
  const currentSrc = showOriginal ? design.original_image : design.generated_image;
  const handleError = () => {
    if (showOriginal) setOrigBroken(true);
    else setGenBroken(true);
  };

  const date = new Date(design.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = new Date(design.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.22s ease, border-color 0.22s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--border-mid)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--bg-sunken)', overflow: 'hidden' }}>
        {isBroken ? (
          <BrokenImage label={showOriginal ? 'Original' : 'AI image'} />
        ) : (
          <motion.img
            key={showOriginal ? 'orig' : 'gen'}
            src={currentSrc}
            alt={design.prompt}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* Overlay bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)',
        }}>
          {/* Mode label */}
          <span style={{
            padding: '3px 8px', fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'rgba(0,0,0,0.48)', color: 'rgba(255,255,255,0.94)',
            borderRadius: 'var(--r-pill)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            {showOriginal ? 'Original' : 'AI Generated'}
          </span>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => setShowOriginal(s => !s)}
            style={{
              padding: '3px 9px', fontSize: '0.7rem', fontWeight: 600,
              background: 'rgba(0,0,0,0.48)', color: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--r-pill)', cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.14s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.70)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.48)'; }}
          >
            {showOriginal ? 'View AI →' : 'View Original'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '13px 15px 15px' }}>
        <p style={{
          fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: 11,
        }}>
          {design.prompt || 'Design variation'}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 10, borderTop: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.4 }}>
            <div>{date}</div>
            <div style={{ opacity: 0.8 }}>{time}</div>
          </div>

          {!genBroken && design.generated_image ? (
            <a
              href={design.generated_image}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', fontSize: '0.78rem', fontWeight: 600,
                background: 'var(--accent-soft)', color: 'var(--text-accent)',
                border: '1px solid var(--accent-border)',
                borderRadius: 'var(--r-md)', textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--accent-soft)';
                e.currentTarget.style.color = 'var(--text-accent)';
                e.currentTarget.style.borderColor = 'var(--accent-border)';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </a>
          ) : (
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Image expired
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
