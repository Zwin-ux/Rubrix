import React from 'react';

function AuditTrailPanel({ logs }) {
  return (
    <div aria-label="Audit Trail" tabIndex={0} style={{ margin: '1rem 0' }}>
      <h3>Audit Trail</h3>
      <ul style={{ maxHeight: '120px', overflowY: 'auto', background: '#f9f9f9', padding: '0.5rem', border: '1px solid #eee' }}>
        {logs && logs.length ? logs.map((log, i) => (
          <li key={i} style={{ fontSize: '0.95em' }}>{log}</li>
        )) : <li>No actions yet.</li>}
      </ul>
    </div>
  );
}

export default AuditTrailPanel;
