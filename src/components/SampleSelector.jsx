import React, { useState } from 'react';
import { Layers, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SampleSelector({ samples, onSelectSample, currentSampleId }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Standard', 'Difficult'];

  const filteredSamples = samples.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.difficulty.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Preset Library ({samples.length} Sample Emails)
          </h3>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedCategory === cat ? 'var(--primary-light)' : 'var(--bg-input)',
                color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-card)'
              }}
            >
              {cat === 'all' ? 'All (28)' : cat === 'Standard' ? 'Standard (20)' : 'Difficult (8)'}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '0.75rem',
          maxHeight: '260px',
          overflowY: 'auto',
          paddingRight: '4px'
        }}
      >
        {filteredSamples.map((sample) => {
          const isSelected = sample.id === currentSampleId;
          const isDifficult = sample.difficulty === 'Difficult';

          return (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              style={{
                background: isSelected ? 'var(--primary-light)' : 'var(--bg-input)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-card)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  {isDifficult ? (
                    <AlertTriangle size={13} color="var(--accent-amber)" />
                  ) : (
                    <CheckCircle2 size={13} color="var(--primary)" />
                  )}
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isDifficult ? 'var(--accent-amber)' : 'var(--primary)' }}>
                    {sample.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {sample.title}
                </div>
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
