import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Flag,
  Copy,
  Check,
  Code2,
  Sparkles,
  HelpCircle,
  FileCheck,
  ShieldAlert
} from 'lucide-react';

export default function AnalysisView({ result, executionSource, loading }) {
  const [activeView, setActiveView] = useState('formatted'); // 'formatted' | 'raw_json'
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Processing...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Analyzing intent, deadlines, sentiment &amp; drafting reply
          </p>
        </div>
        {/* Animated dots */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#6366f1',
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles size={36} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
          No Email Analyzed Yet
        </h3>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Select a sample preset above or paste an email on the left, then click <strong>Run Email Intelligence Analysis</strong>.
        </p>
      </div>
    );
  }

  const {
    summary,
    intent,
    action_items,
    deadlines,
    sentiment,
    urgency,
    flags,
    reply_needed,
    suggested_response,
    needs_user_input,
    confidence
  } = result;

  const handleCopyResponse = () => {
    if (suggested_response?.body) {
      navigator.clipboard.writeText(suggested_response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getUrgencyBadge = (level) => {
    const l = level?.toLowerCase() || 'low';
    if (l === 'critical') return <span className="badge badge-critical">Critical Urgency</span>;
    if (l === 'high') return <span className="badge badge-high">High Urgency</span>;
    if (l === 'medium') return <span className="badge badge-medium">Medium Urgency</span>;
    return <span className="badge badge-low">Low Urgency</span>;
  };

  const getSentimentBadge = (label) => {
    return (
      <span className="badge" style={{ background: '#f3e8ff', color: '#7e22ce', border: '1px solid #d8b4fe' }}>
        Sentiment: {label}
      </span>
    );
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Analysis & Intelligence Report
            </h3>
            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: '#dbeafe', borderRadius: '4px', color: '#1e40af', fontWeight: 600 }}>
              Source: {executionSource || 'Gemini'}
            </span>
          </div>

        </div>

        <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-input)', padding: '3px', borderRadius: '6px' }}>
          <button
            className={`btn ${activeView === 'formatted' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => setActiveView('formatted')}
          >
            <FileCheck size={14} /> Formatted Render
          </button>
          <button
            className={`btn ${activeView === 'raw_json' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => setActiveView('raw_json')}
          >
            <Code2 size={14} /> Raw JSON
          </button>
        </div>
      </div>

      {activeView === 'raw_json' ? (
        <pre className="json-viewer">{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <div>
          {/* Urgency & Sentiment Header Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {getUrgencyBadge(urgency?.level)}
            {getSentimentBadge(sentiment?.label)}
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc' }}>
              Intent: {intent?.primary?.replace('_', ' ')}
            </span>
            {reply_needed ? (
              <span className="badge" style={{ background: '#d1fae5', color: '#047857', border: '1px solid #6ee7b7' }}>
                Reply Required
              </span>
            ) : (
              <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                No Reply Needed
              </span>
            )}
          </div>

          {/* Flags Alert Section */}
          {flags && flags.length > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <AlertTriangle size={15} /> ACTIVE ANALYSIS FLAGS ({flags.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {flags.map((flag, idx) => (
                  <span key={idx} className="badge badge-flag">
                    <Flag size={11} /> {flag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section 1: Summary */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
              Summary
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {summary}
            </p>
          </div>

          {/* Section 2: Intent */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
              Intent
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <strong>Primary:</strong> <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{intent?.primary?.replace('_', ' ')}</span>
              {intent?.secondary?.length > 0 && (
                <span style={{ color: '#1e293b' }}> | <strong>Secondary:</strong> {intent.secondary.join(', ')}</span>
              )}
            </p>
            {intent?.explanation && (
              <p style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic', marginTop: '0.2rem' }}>
                "{intent.explanation}"
              </p>
            )}
          </div>

          {/* Section 3: Action Items */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Action Items ({action_items?.length || 0})
            </div>
            {action_items && action_items.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {action_items.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={16} color="var(--primary)" />
                      <div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500 }}>
                          {idx + 1}. {item.task}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Owner: <strong style={{ color: 'var(--primary)' }}>{item.owner}</strong> {item.deadline && `| Deadline: ${item.deadline}`}
                        </div>
                      </div>
                    </div>
                    <span className="badge" style={{ fontSize: '0.7rem', background: item.explicit ? 'var(--primary-light)' : 'var(--bg-input)', color: item.explicit ? 'var(--primary)' : 'var(--text-muted)', border: '1px solid var(--border-card)' }}>
                      {item.explicit ? 'Explicit' : 'Implied'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No explicit action items identified.</p>
            )}
          </div>

          {/* Section 4: Deadlines */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              Resolved Deadlines
            </div>
            {deadlines && deadlines.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {deadlines.map((d, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                        <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                        "{d.original_text}" &rarr; <strong style={{ color: 'var(--accent-amber)' }}>{d.resolved_date || 'Unresolved/Ambiguous'}</strong>
                      </span>
                      <span className={`badge ${d.type === 'hard' ? 'badge-critical' : 'badge-medium'}`} style={{ fontSize: '0.7rem' }}>
                        {d.type} deadline
                      </span>
                    </div>
                    {d.ambiguity_note && (
                      <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.2rem' }}>
                        Note: {d.ambiguity_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No deadlines stated or implied.</p>
            )}
          </div>

          {/* Section 5: Sentiment & Urgency Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sentiment Assessment</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.2rem' }}>{sentiment?.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{sentiment?.reason}</div>
            </div>
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Urgency Assessment</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>{urgency?.level}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{urgency?.reason}</div>
            </div>
          </div>

          {/* Section 6: Needs User Input */}
          {needs_user_input && needs_user_input.length > 0 && (
            <div style={{ background: '#ede9fe', border: '1px solid #7c3aed', borderRadius: 'var(--radius-sm)', padding: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <HelpCircle size={15} /> EXECUTIVE CONFIRMATIONS REQUIRED BEFORE SENDING
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#2e1065' }}>
                {needs_user_input.map((inp, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{inp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 7: Suggested Response */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Suggested Response
              </div>
              {suggested_response?.body && (
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                  onClick={handleCopyResponse}
                >
                  {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy Reply'}
                </button>
              )}
            </div>

            {reply_needed ? (
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                {suggested_response?.subject && (
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '0.4rem' }}>
                    Subject: {suggested_response.subject}
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: '1.6' }}>
                  {suggested_response?.body?.split(/(\[CONFIRM:[^\]]+\])/g).map((part, i) => {
                    if (part.startsWith('[CONFIRM:')) {
                      return (
                        <span key={i} style={{ background: '#fef3c7', color: '#92400e', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 600, border: '1px solid #f59e0b' }}>
                          {part}
                        </span>
                      );
                    }
                    return part;
                  })}
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-sm)', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                <strong>No Draft Created:</strong> {suggested_response?.reason_if_none || 'Email does not require a reply.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
