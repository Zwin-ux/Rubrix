import React from 'react';

function ExportPanel({ onExportCSV, onExportJSON }) {
  return (
    <div aria-label="Export Panel" tabIndex={0} style={{ margin: '1rem 0' }}>
      <h3>Export Results</h3>
      <button onClick={onExportCSV} style={{ marginRight: '0.5rem' }}>Export as CSV</button>
      <button onClick={onExportJSON}>Export as JSON</button>
    </div>
  );
}

export default ExportPanel;
