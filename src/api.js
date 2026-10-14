export async function fetchSamples() {
  const res = await fetch('/api/samples');
  if (!res.ok) throw new Error('Failed to fetch sample emails');
  return await res.json();
}

export async function analyzeEmail(payload) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(err.detail || 'Analysis failed');
  }
  return await res.json();
}

export async function runBenchmark() {
  const res = await fetch('/api/benchmark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Benchmark execution failed' }));
    throw new Error(err.detail || 'Benchmark execution failed');
  }
  return await res.json();
}
