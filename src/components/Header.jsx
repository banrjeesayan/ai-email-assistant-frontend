import React from 'react';
import { Sparkles, LogOut } from 'lucide-react';

export default function Header({ onLogout }) {
  return (
    <header className="navbar">
      <div className="logo-group">
        <div className="logo-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <div className="logo-text">AI Email Assistant</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Executive Email Intelligence Engine
          </div>
        </div>
      </div>

      {onLogout && (
        <button onClick={onLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <LogOut size={15} /> Sign Out
        </button>
      )}
    </header>
  );
}
