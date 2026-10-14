import React from 'react';
import { Send, Sparkles, Mail } from 'lucide-react';

export default function EmailAnalyzer({ body, setBody, onAnalyze, loading }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onAnalyze(); }}
      className="glass-card"
      style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={18} color="var(--primary)" /> Paste Your Email
        </h3>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.2rem 0.5rem' }}>
          Injection Shield Active
        </span>
      </div>

      <textarea
        className="form-textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={20}
        placeholder={`Paste the full email here — including From, Subject, and body.\n\nExample:\nFrom: john@acme.com\nSubject: Urgent: Q3 Report Delay\n\nHi,\nWe need the Q3 report by EOD Friday...`}
        style={{ resize: 'vertical', fontSize: '0.93rem', lineHeight: '1.65' }}
        required
      />

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
        disabled={loading}
      >
        {loading
          ? <><Sparkles className="spin-icon" size={18} /> Analyzing...</>
          : <><Send size={17} /> Analyze Email</>
        }
      </button>
    </form>
  );
}
