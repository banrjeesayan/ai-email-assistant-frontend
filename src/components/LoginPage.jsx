import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Zap, Shield, Brain } from 'lucide-react';

const FEATURES = [
  { icon: <Brain size={16} />, text: 'AI-powered intent & sentiment analysis' },
  { icon: <Zap size={16} />, text: 'Instant draft replies with smart placeholders' },
  { icon: <Shield size={16} />, text: 'Phishing & prompt injection detection' },
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>

        {/* LEFT PANEL */}
        <div style={s.left}>
          <div style={s.leftInner}>
            <div style={s.brand}>
              <div style={s.brandIcon}><Mail size={22} color="#fff" /></div>
              <span style={s.brandName}>AI Email Assistant</span>
            </div>
            <h1 style={s.leftTitle}>Your executive inbox,<br />intelligently handled.</h1>
            <p style={s.leftSub}>Analyze, summarize, and draft replies to any email in seconds — powered by Gemini AI.</p>
            <div style={s.featureList}>
              {FEATURES.map((f, i) => (
                <div key={i} style={s.featureItem}>
                  <span style={s.featureIcon}>{f.icon}</span>
                  <span style={s.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* decorative circles */}
          <div style={{ ...s.circle, width: 300, height: 300, bottom: -80, right: -80, opacity: 0.08 }} />
          <div style={{ ...s.circle, width: 180, height: 180, top: -40, right: 40, opacity: 0.06 }} />
        </div>

        {/* RIGHT PANEL */}
        <div style={s.right}>
          <div style={s.rightInner}>
            <div style={s.rightHeader}>
              <h2 style={s.rightTitle}>Sign in</h2>
              <p style={s.rightSub}>Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              {/* Username */}
              <div style={s.field}>
                <label style={s.label}>Username</label>
                <div style={s.inputRow}>
                  <Lock size={15} color="#94a3b8" style={s.fieldIcon} />
                  <input
                    style={s.input}
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={s.field}>
                <label style={s.label}>Password</label>
                <div style={s.inputRow}>
                  <Lock size={15} color="#94a3b8" style={s.fieldIcon} />
                  <input
                    style={{ ...s.input, paddingRight: '2.8rem' }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} color="#64748b" /> : <Eye size={15} color="#64748b" />}
                  </button>
                </div>
              </div>

              {error && <div style={s.error}>{error}</div>}

              <button type="submit" style={s.submitBtn} disabled={loading}>
                {loading
                  ? <span style={s.spinner} />
                  : <><span>Sign In</span><ArrowRight size={16} /></>
                }
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  card: {
    display: 'flex',
    width: '100%',
    maxWidth: '900px',
    minHeight: '540px',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
  },
  /* LEFT */
  left: {
    flex: '1.1',
    background: 'linear-gradient(145deg, #0f3460 0%, #12559e 60%, #1a6bbf 100%)',
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  leftInner: { position: 'relative', zIndex: 1 },
  brand: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' },
  brandIcon: {
    width: '40px', height: '40px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  },
  brandName: { color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' },
  leftTitle: { color: '#ffffff', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', fontFamily: "'Outfit', sans-serif" },
  leftSub: { color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '0.65rem' },
  featureIcon: {
    width: '30px', height: '30px',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#93c5fd', flexShrink: 0,
  },
  featureText: { color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    background: '#ffffff',
  },
  /* RIGHT */
  right: {
    flex: '1',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 2.5rem',
  },
  rightInner: { width: '100%', maxWidth: '340px' },
  rightHeader: { marginBottom: '2rem' },
  rightTitle: { fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem', fontFamily: "'Outfit', sans-serif" },
  rightSub: { fontSize: '0.875rem', color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' },
  inputRow: { position: 'relative', display: 'flex', alignItems: 'center' },
  fieldIcon: { position: 'absolute', left: '0.85rem', pointerEvents: 'none' },
  input: {
    width: '100%',
    padding: '0.75rem 0.9rem 0.75rem 2.5rem',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: '0.85rem',
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: 0,
  },
  error: {
    fontSize: '0.85rem', color: '#b91c1c',
    background: '#fef2f2', border: '1px solid #fca5a5',
    borderRadius: '8px', padding: '0.6rem 0.85rem',
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #12559e, #1a6bbf)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 15px rgba(18,85,158,0.35)',
    transition: 'opacity 0.2s',
  },
  spinner: {
    width: '18px', height: '18px',
    border: '2px solid rgba(255,255,255,0.35)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
};
