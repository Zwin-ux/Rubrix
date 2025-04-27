import React from 'react';

function GoogleIntegrationPanel() {
  return (
    <div aria-label="Google Integration" tabIndex={0} style={{ margin: '1rem 0' }}>
      <h3>Google Sheets/Drive</h3>
      <button disabled>Connect Google Account (coming soon)</button>
      <button disabled style={{ marginLeft: '0.5rem' }}>Import from Sheets</button>
      <button disabled style={{ marginLeft: '0.5rem' }}>Export to Sheets</button>
      <div style={{ fontSize: '0.9em', marginTop: '0.5rem', color: '#888' }}>
        (Direct integration coming soon)
      </div>
    </div>
  );
}

export default GoogleIntegrationPanel;
