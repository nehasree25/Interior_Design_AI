import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const ROOM_TYPES = ['Living Room','Bedroom','Kitchen','Dining Room','Bathroom','Home Office','Studio'];
const STYLES     = ['Minimalist','Scandinavian','Modern Luxury','Contemporary','Industrial','Coastal','Japandi'];
const BUDGETS    = ['Standard','Premium','Luxury'];
const PROMPTS    = [
  'Bright Scandinavian living room, oak furniture, warm linen',
  'Moody industrial bedroom, exposed brick, Edison bulbs',
  'Minimal Japanese study, shoji screens, natural light',
  'Coastal kitchen, white shaker cabinets, brass hardware',
  'Luxury master bath, freestanding tub, marble walls',
];

const L = { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 6 };

const UploadRoom = ({ onDesignGenerated }) => {
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [dragging, setDragging] = useState(false);
  const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
  const [style, setStyle]     = useState(STYLES[0]);
  const [budget, setBudget]   = useState(BUDGETS[0]);
  const fileRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select a JPG, PNG or WebP image.'); return; }
    if (file.size > 10 * 1024 * 1024)   { setError('Image must be under 10 MB.'); return; }
    setImage(file); setError('');
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop  = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };
  const handleSelect = (e) => processFile(e.target.files[0]);
  const removeImage = () => { setImage(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image)        { setError('Please upload a room photo.'); return; }
    if (!prompt.trim()) { setError('Please enter a design prompt.'); return; }
    setLoading(true); setError('');
    const fd = new FormData();
    fd.append('image', image);
    fd.append('prompt', `${prompt.trim()}\n\nRoom: ${roomType} · Style: ${style} · Budget: ${budget}`);
    try {
      await onDesignGenerated(fd);
      setImage(null); setPreview(null); setPrompt('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Failed to generate design');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Drop zone */}
      <div>
        <label style={L}>Room photo</label>
        {!preview ? (
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileRef.current?.click()}
            style={{
              padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
              borderColor: dragging ? 'var(--accent)' : undefined,
              background: dragging ? 'var(--accent-soft)' : undefined,
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 'var(--r-md)', margin: '0 auto 10px',
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
              Drag &amp; drop or click to browse
            </p>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>PNG, JPG, WebP · max 10 MB</p>
          </div>
        ) : (
          <div style={{ position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', height: 190, objectFit: 'cover', display: 'block' }} />
            <button type="button" onClick={removeImage} style={{
              position: 'absolute', top: 8, right: 8, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600,
              background: 'rgba(0,0,0,0.58)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 'var(--r-md)', cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>
              Remove
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleSelect} style={{ display: 'none' }} />
      </div>

      {/* Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
        {[
          { label: 'Room type', value: roomType, set: setRoomType, opts: ROOM_TYPES },
          { label: 'Style',     value: style,    set: setStyle,    opts: STYLES },
          { label: 'Budget',    value: budget,   set: setBudget,   opts: BUDGETS },
        ].map(({ label, value, set, opts }) => (
          <div key={label}>
            <label style={L}>{label}</label>
            <select value={value} onChange={e => set(e.target.value)} disabled={loading}
              className="input-modern"
              style={{ padding: '8px 10px', fontSize: '0.83rem', cursor: 'pointer' }}>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Prompt */}
      <div>
        <label htmlFor="prompt" style={L}>Design prompt</label>
        <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)}
          className="textarea-modern" disabled={loading} rows={3}
          placeholder="Describe materials, palette, lighting, mood…" />
        {/* Quick suggestions */}
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PROMPTS.map((s, i) => (
            <motion.button key={i} type="button" disabled={loading}
              onClick={() => setPrompt(s)} whileHover={{ y: -1 }}
              style={{
                padding: '3px 9px', fontSize: '0.73rem', fontWeight: 500,
                background: 'var(--bg-interactive)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-pill)',
                cursor: 'pointer', transition: 'all 0.14s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-interactive)'; }}>
              {s.length > 42 ? s.slice(0, 40) + '…' : s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ fontSize: '0.82rem', padding: '10px 13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading || !image || !prompt.trim()}
        className="btn-primary"
        style={{ width: '100%', padding: '11px 20px', fontSize: '0.92rem' }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <SpinnerSmall /> Generating…
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Generate Design
          </span>
        )}
      </motion.button>
    </form>
  );
};

const SpinnerSmall = () => (
  <div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

export default UploadRoom;
