import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/useAuth';
import ThemeToggle from '../components/ThemeToggle';
import UploadRoom from '../components/UploadRoom';
import DesignCard from '../components/DesignCard';
import Loader from '../components/Loader';
import designService from '../services/designService';

const TAB_STUDIO  = 'studio';
const TAB_HISTORY = 'history';

/* ── Logo mark ── */
const LogoMark = ({ size = 34 }) => (
  <div style={{
    width: size, height: size, borderRadius: 'var(--r-lg)',
    background: 'linear-gradient(140deg, var(--accent) 0%, #818CF8 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: 'var(--shadow-accent)', flexShrink: 0,
  }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  </div>
);

/* ── Avatar ── */
const Avatar = ({ name, size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: 'linear-gradient(140deg, var(--accent) 0%, #818CF8 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.4, fontWeight: 700, color: '#fff',
    flexShrink: 0, userSelect: 'none',
    boxShadow: '0 0 0 2px var(--bg-elevated)',
  }}>
    {name?.charAt(0).toUpperCase() ?? '?'}
  </div>
);

/* ── Topbar ── */
const Topbar = ({ user, activeTab, setActiveTab, onLogout }) => (
  <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '10px 0' }}>
    <div className="container-professional">
      <div className="glass-navbar" style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <LogoMark size={34} />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Arkeo</div>
              <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', fontWeight: 500 }}>AI Interior Studio</div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 8px', flexShrink: 0 }} />

          {/* Tabs — left-aligned after separator */}
          <div className="tab-bar" style={{ width: 210 }}>
            {[{ key: TAB_STUDIO, label: 'AI Studio' }, { key: TAB_HISTORY, label: 'History' }].map(t => (
              <button key={t.key} type="button"
                className={`tab-item${activeTab === t.key ? ' active' : ''}`}
                onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <ThemeToggle />

            {/* User chip */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '5px 10px 5px 6px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid var(--border)',
              background: 'var(--bg-interactive)',
            }}>
              <Avatar name={user?.name} size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: 96, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </div>

            <button type="button" className="btn-ghost"
              onClick={onLogout}
              style={{ padding: '6px 12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
);

/* ── Dashboard ── */
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab]     = useState(TAB_STUDIO);
  const [sessionDesigns, setSessionDesigns] = useState([]);
  const [generating, setGenerating]   = useState(false);
  const [genError, setGenError]       = useState('');
  const [genSuccess, setGenSuccess]   = useState(false);
  const [history, setHistory]         = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError]     = useState('');

  useEffect(() => {
    if (activeTab === TAB_HISTORY) loadHistory();
  }, [activeTab]);

  const loadHistory = async () => {
    setHistoryLoading(true); setHistoryError('');
    const r = await designService.getDesignHistory();
    setHistory(r.success ? r.data : []);
    if (!r.success) setHistoryError(r.error || 'Failed to load history');
    setHistoryLoading(false);
  };

  const handleDesignGenerated = async (formData) => {
    setGenerating(true); setGenError(''); setGenSuccess(false);
    const r = await designService.generateDesign(formData);
    if (r.success) {
      setSessionDesigns(prev => [r.data, ...prev]);
      setGenSuccess(true);
      setTimeout(() => setGenSuccess(false), 7000);
    } else {
      setGenError(r.error || 'Generation failed. Please try again.');
    }
    setGenerating(false);
  };

  return (
    <div className="studio-bg">
      <Topbar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      <main className="container-professional"
        style={{ paddingTop: 28, paddingBottom: 72, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {activeTab === TAB_STUDIO && (
            <motion.div key="studio"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.26, ease: [0.16,1,0.3,1] }}>
              <StudioTab
                sessionDesigns={sessionDesigns} generating={generating}
                genError={genError} genSuccess={genSuccess} onGenerate={handleDesignGenerated} />
            </motion.div>
          )}
          {activeTab === TAB_HISTORY && (
            <motion.div key="history"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.26, ease: [0.16,1,0.3,1] }}>
              <HistoryTab history={history} loading={historyLoading}
                error={historyError} onRefresh={loadHistory} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

/* ── Studio Tab ── */
const StudioTab = ({ sessionDesigns, generating, genError, genSuccess, onGenerate }) => (
  <div>
    {/* Page header */}
    <div style={{ marginBottom: 24 }}>
      <span className="section-label" style={{ marginBottom: 5 }}>Workspace</span>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.035em', lineHeight: 1.15 }}>
        AI Design Studio
      </h1>
      <p style={{ marginTop: 7, fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: 500 }}>
        Upload a room photo, describe your aesthetic, and get a photorealistic AI redesign in seconds.
      </p>
    </div>

    <div className="studio-grid">
      {/* ── Left: input ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Upload card */}
        <div className="glass-card" style={{ padding: '24px 24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
            <div>
              <div className="section-title">Upload &amp; Prompt</div>
              <p style={{ marginTop: 3, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Drop a photo · set style · generate
              </p>
            </div>
            <span className="badge badge-accent" style={{ marginTop: 2 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Flux Pro
            </span>
          </div>
          <UploadRoom onDesignGenerated={onGenerate} />
        </div>

        {/* Success toast */}
        {genSuccess && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              display: 'flex', gap: 10, alignItems: 'center', padding: '12px 16px',
              borderRadius: 'var(--r-lg)', border: '1px solid var(--success-border)',
              background: 'var(--success-bg)',
            }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--color-success)' }}>Generation complete</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 1 }}>Your redesign is ready on the right.</div>
            </div>
          </motion.div>
        )}

        {/* Error toast */}
        {genError && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="alert alert-error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <div style={{ fontWeight: 650, fontSize: '0.85rem' }}>Generation failed</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: 2 }}>{genError}</div>
            </div>
          </motion.div>
        )}

        {/* Processing card */}
        {generating && (
          <motion.div className="glass-card" style={{ padding: 22 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader message="Generating redesign… this takes 20–60 s" />
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {['Analyzing', 'Styling', 'Rendering'].map((label, i) => (
                <div key={label} style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg-interactive)' }}>
                  <div className="section-label" style={{ marginBottom: 7 }}>{label}</div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${40 + i * 22}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Right: output ── */}
      <div className="glass-card" style={{ padding: 24, minHeight: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
          <div>
            <div className="section-title">Generated Output</div>
            <p style={{ marginTop: 3, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Toggle Original ↔ AI · Download to save
            </p>
          </div>
          {sessionDesigns.length > 0 && (
            <span className="badge">
              {sessionDesigns.length} {sessionDesigns.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {sessionDesigns.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px,1fr))', gap: 14 }}>
            {sessionDesigns.map((design) => (
              <motion.div key={design.id}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}>
                <DesignCard design={design} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340, gap: 12, textAlign: 'center' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--r-lg)',
              border: '1px solid var(--border)', background: 'var(--bg-interactive)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                {generating ? 'Processing your image…' : 'No output yet'}
              </div>
              <div style={{ marginTop: 4, fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: 240 }}>
                {generating ? 'Flux Pro is rendering your redesign.' : 'Upload a room photo and write a prompt to begin.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ── History Tab ── */
const HistoryTab = ({ history, loading, error, onRefresh }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
      <div>
        <span className="section-label" style={{ marginBottom: 5 }}>Your generations</span>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 750, color: 'var(--text-primary)', letterSpacing: '-0.035em', lineHeight: 1.15 }}>
          Design History
        </h1>
        <p style={{ marginTop: 7, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Every AI redesign you&apos;ve generated, newest first.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {!loading && history.length > 0 && (
          <span className="badge">{history.length} {history.length === 1 ? 'design' : 'designs'}</span>
        )}
        <button type="button" className="btn-secondary"
          onClick={onRefresh} disabled={loading}
          style={{ padding: '8px 16px', fontSize: '0.86rem' }}>
          {loading ? 'Loading…' : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              Refresh
            </span>
          )}
        </button>
      </div>
    </div>

    <div className="glass-card" style={{ padding: 24 }}>
      {loading && <div style={{ padding: '56px 0' }}><Loader message="Loading your history…" /></div>}

      {!loading && error && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 650, color: 'var(--color-error)', marginBottom: 8 }}>
            Could not load history
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 22 }}>{error}</div>
          <button type="button" className="btn-primary" onClick={onRefresh}
            style={{ padding: '9px 22px', fontSize: '0.875rem' }}>Try again</button>
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52, margin: '0 auto 16px',
            borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
            background: 'var(--bg-interactive)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'var(--text-muted)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
            </svg>
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 650, color: 'var(--text-primary)' }}>No history yet</div>
          <div style={{ marginTop: 5, fontSize: '0.83rem', color: 'var(--text-muted)' }}>
            Generations you create in AI Studio will appear here.
          </div>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px,1fr))', gap: 14 }}>
          {history.map((design, i) => (
            <motion.div key={design.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.035, 0.35) }}>
              <DesignCard design={design} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;
