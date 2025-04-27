import React from 'react';

function BatchGradingControls({ onGradeAll, grading, canGrade }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>Batch Grading</h2>
      <div style={{ marginBottom: 8, color: '#333', fontSize: '1em' }}>
        Grading will use <b>Google Gemini</b> securely via the server. No API key is needed.
      </div>
      <button
        onClick={() => onGradeAll()}
        disabled={!canGrade || grading}
        aria-busy={grading}
        style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold', background: grading ? '#ccc' : '#005fcc', color: '#fff', border: 'none', borderRadius: 4, cursor: canGrade && !grading ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
      >
        {grading ? 'Grading...' : 'Grade All Responses'}
      </button>
      <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
        Grading is performed securely on the backend using Google Gemini.
      </div>
    </div>
  );
}

export default BatchGradingControls;
