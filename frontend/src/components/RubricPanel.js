import React from 'react';

function RubricPanel({ questions, rubrics, onRubricChange }) {
  return (
    <div aria-label="Rubric Management" tabIndex={0}>
      <h2>Rubrics</h2>
      {questions.length === 0 && <div style={{ color: '#888' }}>Import responses to set up per-question rubrics.</div>}
      {questions.map((q, idx) => (
        <div key={q} style={{ marginBottom: '1.2rem' }}>
          <label htmlFor={`rubric-text-${idx}`}>{q}</label>
          <textarea
            id={`rubric-text-${idx}`}
            rows={3}
            style={{ width: '100%' }}
            placeholder={`Describe grading criteria or ideal answers for: ${q}`}
            aria-label={`Rubric for ${q}`}
            value={rubrics[q] || ''}
            onChange={e => onRubricChange(q, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default RubricPanel;
