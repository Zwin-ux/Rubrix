import React, { useEffect, useState } from 'react';

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { responses: [], questions: [] };
  const headers = lines[0].split(',');
  const questions = headers.slice(1); // Assume first column is user/id, rest are questions
  const responses = lines.slice(1).map(line => {
    const cols = line.split(',');
    const user = cols[0] || `User${Math.random().toString(36).slice(2, 7)}`;
    const answers = {};
    questions.forEach((q, i) => { answers[q] = cols[i + 1] || ''; });
    return { user, answers };
  });
  return { responses, questions };
}

function ImportPanel({ onImport }) {
  const fileInputRef = React.useRef();
  const [autoImportStatus, setAutoImportStatus] = useState('');
  const [autoImportData, setAutoImportData] = useState(null);

  // Auto-import from extension sidebar
  useEffect(() => {
    if (window.parent !== window && window.location !== window.parent.location) {
      // Running in iframe (extension sidebar)
      setAutoImportStatus('Requesting import data from page...');
      window.parent.postMessage({ type: 'AI_FORM_GRADER_IMPORT_REQUEST' }, '*');
      const handler = (e) => {
        if (!e.data || typeof e.data !== 'object') return;
        if (e.data.type === 'AI_FORM_GRADER_IMPORT_DATA') {
          setAutoImportData({ questions: e.data.questions, responses: e.data.responses });
          setAutoImportStatus('Import data received from page. Review and accept.');
        }
      };
      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }
  }, []);

  const handleFile = async (file) => {
    const text = await file.text();
    const { responses, questions } = parseCSV(text);
    onImport(responses, questions);
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (text) {
      const { responses, questions } = parseCSV(text);
      onImport(responses, questions);
    }
  };

  const handleAutoImport = () => {
    if (autoImportData) {
      onImport(autoImportData.responses, autoImportData.questions);
      setAutoImportStatus('Imported from page!');
    }
  };

  return (
    <section aria-label="Import Responses" style={{ marginBottom: '1.5rem' }}>
      <h2>Import Responses</h2>
      {autoImportStatus && (
        <div style={{ margin: '8px 0', color: '#005fcc', fontWeight: 'bold' }} aria-live="polite">{autoImportStatus}</div>
      )}
      {autoImportData && (
        <div style={{ marginBottom: 8, background: '#f6faff', padding: 8, borderRadius: 4 }}>
          <b>Auto-imported from page:</b>
          <div style={{ fontSize: '0.95em', margin: '4px 0' }}>
            <b>Questions:</b> {autoImportData.questions.join(', ') || '(none)'}
          </div>
          <button onClick={handleAutoImport} style={{ marginRight: 8 }}>Accept Import</button>
          <span style={{ color: '#666', fontSize: '0.9em' }}>You may edit or override below.</span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSV}
        aria-label="Import CSV File"
        style={{ marginBottom: 8 }}
      />
      <button onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ marginRight: 8 }}>
        Choose CSV File
      </button>
      <span style={{ color: '#666', fontSize: '0.9em' }}>or paste CSV data below</span>
      <textarea
        rows={3}
        style={{ width: '100%', marginTop: 8 }}
        onPaste={handlePaste}
        aria-label="Paste CSV Data"
      />
    </section>
  );
}

export default ImportPanel;
