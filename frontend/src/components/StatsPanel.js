import React from 'react';

function StatsPanel({ stats }) {
  // stats: { average, distribution, flagged }
  return (
    <div aria-label="Statistics Panel" tabIndex={0} style={{ margin: '1rem 0' }}>
      <h3>Statistics</h3>
      <div>Average Score: <strong>{stats?.average ?? 'N/A'}</strong></div>
      <div>Flagged Answers: <strong>{stats?.flagged ?? 0}</strong></div>
      {/* Accessible chart placeholder */}
      <div role="img" aria-label="Score distribution chart">
        {/* Replace with accessible chart or text-based distribution */}
        <pre style={{ background: '#f4f4f4', padding: '0.5rem' }}>{JSON.stringify(stats?.distribution ?? {}, null, 2)}</pre>
      </div>
    </div>
  );
}

export default StatsPanel;
