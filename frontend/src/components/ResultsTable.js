import React from 'react';

function ResultsTable({ questions, responses, results, onOverride }) {
  // Map user to row index for override
  const userIdxMap = results.reduce((acc, r, i) => { acc[r.user] = i; return acc; }, {});
  const getAnswer = (user, q) => responses.find(r => r.user === user)?.answers[q] || '';

  const handleOverride = (userIdx, q, oldScore, oldFeedback) => {
    const newScore = prompt(`Enter new score for ${q}:`, oldScore);
    const newFeedback = prompt(`Enter new feedback for ${q}:`, oldFeedback);
    if (newScore !== null && newFeedback !== null) {
      onOverride(userIdx, q, newScore, newFeedback);
    }
  };

  return (
    <div aria-label="Results Table" tabIndex={0}>
      <h2>Results</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Graded Results Table" role="table">
        <thead>
          <tr>
            <th scope="col" aria-label="User Identifier" title="User Identifier">User</th>
            {questions.map(q => (
              <th key={q} colSpan={4} aria-label={`Question: ${q}`} title={`Question: ${q}`}>{q}</th>
            ))}
          </tr>
          <tr>
            <th></th>
            {questions.map(q => [
              <th key={q + '-answer'} scope="col" aria-label={`Answer for ${q}`} title={`Answer for ${q}`}>Answer</th>,
              <th key={q + '-score'} scope="col" aria-label={`Score for ${q}`} title={`Score for ${q}`}>Score</th>,
              <th key={q + '-feedback'} scope="col" aria-label={`Feedback for ${q}`} title={`Feedback for ${q}`}>Feedback</th>,
              <th key={q + '-override'} scope="col" aria-label={`Override for ${q}`} title={`Override for ${q}`}>Override</th>
            ])}
          </tr>
        </thead>
        <tbody>
          {results.map((row, userIdx) => (
            <tr key={row.user}>
              <td tabIndex={0} aria-label={`User ${row.user}`} role="rowheader">{row.user}</td>
              {questions.map(q => (
                <React.Fragment key={q}>
                  <td tabIndex={0} aria-label={`Answer for ${q}: ${getAnswer(row.user, q)}`}>{getAnswer(row.user, q)}</td>
                  <td tabIndex={0} aria-label={`Score for ${q}: ${row.scores[q]?.score ?? ''}`}>{row.scores[q]?.score ?? ''}</td>
                  <td tabIndex={0} aria-label={`Feedback for ${q}: ${row.scores[q]?.feedback ?? ''}`}>{row.scores[q]?.feedback ?? ''}</td>
                  <td>
                    <button
                      onClick={() => handleOverride(userIdx, q, row.scores[q]?.score, row.scores[q]?.feedback)}
                      aria-label={`Override score and feedback for ${q} and user ${row.user}`}
                      title={`Override score and feedback for ${q} and user ${row.user}`}
                    >Override</button>
                    {row.scores[q]?.overridden && <span aria-label="Overridden" title="This cell has been overridden" style={{ color: '#b8860b', fontWeight: 'bold', marginLeft: 4 }}>Overridden</span>}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#666' }}>
        Tip: Use Tab/Shift+Tab to navigate cells. Overrides are highlighted.
      </div>
    </div>
  );
}

export default ResultsTable;
