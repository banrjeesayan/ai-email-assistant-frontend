import React, { useState } from 'react';
import { BarChart3, CheckCircle2, XCircle, Play, Sparkles, Filter, ShieldAlert } from 'lucide-react';
import { runBenchmark } from '../api';

export default function BenchmarkView() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      const res = await runBenchmark();
      setReport(res.report);
    } catch (err) {
      alert('Error running benchmark suite: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDetails = report?.details?.filter((item) => {
    if (filterDifficulty === 'all') return true;
    return item.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart3 size={24} color="var(--primary)" />
            Evaluation Benchmark Suite (28 Test Cases)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Automated evaluation across Intent Match, Deadline Accuracy, Action Item Precision/Recall, Urgency Match, and Reply Quality Rubric.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleRunBenchmark} disabled={loading}>
          {loading ? (
            <>
              <Sparkles className="spin-icon" size={16} /> Running Evaluation...
            </>
          ) : (
            <>
              <Play size={16} /> Run Full Evaluation Suite
            </>
          )}
        </button>
      </div>

      {!report ? (
        <div style={{ background: 'rgba(13, 19, 33, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '3rem', textAlign: 'center' }}>
          <BarChart3 size={40} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Benchmark Ready</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0.5rem auto 1.25rem' }}>
            Run the automated test runner to evaluate the system against ground truth across all 20 standard email categories and 8 difficult edge cases.
          </p>
          <button className="btn btn-primary" onClick={handleRunBenchmark} disabled={loading}>
            <Play size={16} /> Execute 28-Case Evaluation Suite
          </button>
        </div>
      ) : (
        <div>
          {/* Metrics Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Overall Accuracy</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a5f3fc', marginTop: '0.2rem' }}>
                {report.summary.overall_accuracy_pct}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Weighted Rubric Score</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Intent Match Rate</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6ee7b7', marginTop: '0.2rem' }}>
                {report.summary.intent_accuracy_pct}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Exact Category Match</div>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Urgency Accuracy</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#67e8f9', marginTop: '0.2rem' }}>
                {report.summary.urgency_accuracy_pct}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Stakes-Based Rating</div>
            </div>

            <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Test Coverage</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e9d5ff', marginTop: '0.2rem' }}>
                {report.summary.total_emails_tested}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>20 Standard + 8 Edge Cases</div>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Detailed Test Results ({filteredDetails?.length || 0} Test Cases)
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['all', 'Standard', 'Difficult'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: filterDifficulty === diff ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: filterDifficulty === diff ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Evaluation Results Table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(13, 19, 33, 0.8)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Test Case</th>
                  <th style={{ padding: '0.75rem' }}>Intent Match</th>
                  <th style={{ padding: '0.75rem' }}>Urgency Match</th>
                  <th style={{ padding: '0.75rem' }}>Deadline Acc</th>
                  <th style={{ padding: '0.75rem' }}>Action Recall</th>
                  <th style={{ padding: '0.75rem' }}>Reply Rubric</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Overall Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetails.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.category} ({item.difficulty})
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.metrics.intent_match ? (
                        <span style={{ color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> {item.metrics.actual_intent}
                        </span>
                      ) : (
                        <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                          <XCircle size={14} /> {item.metrics.actual_intent} (exp: {item.metrics.expected_intent})
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {item.metrics.urgency_match ? (
                        <span style={{ color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> {item.metrics.actual_urgency}
                        </span>
                      ) : (
                        <span style={{ color: '#fde047', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                          <XCircle size={14} /> {item.metrics.actual_urgency}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem', color: item.metrics.deadline_accuracy_pct >= 90 ? '#6ee7b7' : '#fde047' }}>
                      {item.metrics.deadline_accuracy_pct}%
                    </td>
                    <td style={{ padding: '0.75rem', color: '#a5f3fc' }}>
                      {item.metrics.action_item_recall_pct}%
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e9d5ff' }}>
                      {item.metrics.reply_quality_score}/100
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: item.metrics.overall_score >= 85 ? '#6ee7b7' : '#fde047' }}>
                      {item.metrics.overall_score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
