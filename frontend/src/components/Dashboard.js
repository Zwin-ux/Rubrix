import React, { useState, useEffect } from 'react';

const LANGS = {
  en: {
    welcome: 'Welcome to AI Form Grader!',
    onboarding: [
      'Open Google Forms or Sheets and click the AI Grader button to launch the sidebar.',
      'Import questions and responses automatically, or upload a CSV.',
      'Review, grade, and export results—all with accessibility in mind!'
    ]
  },
  es: {
    welcome: '¡Bienvenido a AI Form Grader!',
    onboarding: [
      'Abre Formularios o Hojas de Google y haz clic en el botón AI Grader para lanzar la barra lateral.',
      'Importa preguntas y respuestas automáticamente o sube un archivo CSV.',
      '¡Revisa, califica y exporta resultados, todo con accesibilidad en mente!'
    ]
  },
  fr: {
    welcome: 'Bienvenue sur AI Form Grader!',
    onboarding: [
      'Ouvrez Google Forms ou Sheets et cliquez sur le bouton AI Grader pour lancer la barre latérale.',
      'Importez automatiquement les questions et réponses ou téléchargez un CSV.',
      'Examinez, notez et exportez les résultats, tout en gardant l’accessibilité à l’esprit!'
    ]
  },
  ar: {
    welcome: 'مرحبًا بك في AI Form Grader!',
    onboarding: [
      'افتح نماذج أو جداول بيانات Google واضغط على زر AI Grader لفتح الشريط الجانبي.',
      'استورد الأسئلة والإجابات تلقائيًا أو حمّل ملف CSV.',
      'راجع وقيّم وصدّر النتائج مع مراعاة سهولة الوصول!'
    ]
  },
  zh: {
    welcome: '欢迎使用AI Form Grader！',
    onboarding: [
      '打开Google表单或表格，点击AI Grader按钮启动侧边栏。',
      '自动导入问题和答案，或上传CSV文件。',
      '审核、评分并导出结果——始终注重无障碍！'
    ]
  }
};

import ImportPanel from './ImportPanel';
import RubricPanel from './RubricPanel';
import ResultsTable from './ResultsTable';
import BatchGradingControls from './BatchGradingControls';
import ExportPanel from './ExportPanel';
import StatsPanel from './StatsPanel';
import AccessibilitySettings from './AccessibilitySettings';
import StarWarsToggle from './StarWarsToggle';
const { starWarsFormat } = require('../../core/starwars');

async function gradeAllResponses(responses, rubric, apiKey) {
  // Call backend for each response (in parallel for speed)
  const results = await Promise.all(responses.map(async ({ question, answer }) => {
    const res = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer: answer, rubric, apiKey })
    });
    const json = await res.json();
    return {
      answer,
      score: json.score,
      feedback: json.feedback,
      overridden: false
    };
  }));
  return results;
}

function Dashboard() {
  const [starWarsMode, setStarWarsMode] = useState(false);
  const [mayFourth, setMayFourth] = useState(false);

  // Main state (declare only once)
  const [questions, setQuestions] = useState([]); // array of question strings
  const [responses, setResponses] = useState([]); // { user, answers: { [question]: answer } }
  const [rubrics, setRubrics] = useState({}); // { [question]: rubric }
  const [results, setResults] = useState([]); // [{ user, scores: { [question]: { score, feedback, overridden } } }]
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState('');
  const [stats, setStats] = useState({ average: null, distribution: {}, flagged: 0 });
  const [settings, setSettings] = useState({ language: 'en', darkmode: false, highcontrast: false, onboarding: true });
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Auto-enable Star Wars mode or greeting on May 4th
  useEffect(() => {
    const now = new Date();
    if (now.getMonth() === 4 && now.getDate() === 4) {
      setMayFourth(true);
      setStarWarsMode(true);
    }
  }, []);
  const [questions, setQuestions] = useState([]); // array of question strings
  const [responses, setResponses] = useState([]); // { user, answers: { [question]: answer } }
  const [rubrics, setRubrics] = useState({}); // { [question]: rubric }
  const [results, setResults] = useState([]); // [{ user, scores: { [question]: { score, feedback, overridden } } }]
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState('');
  const [stats, setStats] = useState({ average: null, distribution: {}, flagged: 0 });
  const [settings, setSettings] = useState({ language: 'en', darkmode: false, highcontrast: false, onboarding: true });
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load settings from chrome.storage.sync if extension context
  useEffect(() => {
    if (window.chrome && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['language','darkmode','highcontrast','onboarding'], (data) => {
        setSettings(s => ({
          ...s,
          ...data,
          language: data.language || 'en',
          darkmode: data.darkmode || false,
          highcontrast: data.highcontrast || false,
          onboarding: data.onboarding !== undefined ? data.onboarding : true
        }));
        if (data.onboarding !== false) setShowOnboarding(true);
      });
    } else {
      setShowOnboarding(true);
    }
  }, []);

  // Apply theme classes to root
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    root.classList.toggle('darkmode', !!settings.darkmode);
    root.classList.toggle('highcontrast', !!settings.highcontrast);
    if (settings.language === 'ar') {
      root.dir = 'rtl';
    } else {
      root.dir = 'ltr';
    }
  }, [settings]);

  // Import responses from ImportPanel
  const handleImport = (parsedResponses, detectedQuestions) => {
    setQuestions(detectedQuestions);
    setResponses(parsedResponses);
    setResults([]); // Clear old results
    setRubrics(rubrics => {
      // Remove rubrics for removed questions
      const newRubrics = { ...rubrics };
      Object.keys(newRubrics).forEach(k => { if (!detectedQuestions.includes(k)) delete newRubrics[k]; });
      return newRubrics;
    });
  };

  // Rubric change
  const handleRubricChange = (question, val) => {
    setRubrics(rubrics => ({ ...rubrics, [question]: val }));
  };

  // Batch grading for all users and questions
  const announce = msg => {
    const live = document.getElementById('live-region');
    if (live) { live.textContent = msg; }
  };

  const handleGradeAll = async () => {
    setGrading(true);
    setGradeError('');
    announce('Grading in progress');
    try {
      // For each user, grade each question with its rubric
      const graded = await Promise.all(responses.map(async ({ user, answers }) => {
        const scores = {};
        await Promise.all(questions.map(async (q) => {
          const rubric = rubrics[q] || '';
          const answer = answers[q] || '';
          // Only grade if rubric and answer exist
          if (rubric && answer) {
            try {
              const res = await fetch('/api/grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q, userAnswer: answer, rubric })
              });
              const json = await res.json();
              if (!res.ok || json.error) {
                throw new Error(json.error || 'Unknown error');
              }
              scores[q] = { score: json.score, feedback: json.feedback, overridden: false };
            } catch (err) {
              scores[q] = { score: '', feedback: `Error: ${err.message}`, overridden: false };
              setGradeError(`Gemini error for ${user}, ${q}: ${err.message}`);
              announce(`Error grading ${user}, question ${q}: ${err.message}`);
            }
          } else {
            scores[q] = { score: '', feedback: '', overridden: false };
          }
        }));
        return { user, scores };
      }));
      setResults(graded);
      // Update stats (average of all scores)
      const allScores = graded.flatMap(r => questions.map(q => Number(r.scores[q]?.score)).filter(n => !isNaN(n)));
      const average = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2) : null;
      const distribution = allScores.reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});
      setStats({ average, distribution, flagged: allScores.filter(s => s < 3).length });
      announce('Grading complete');
    } catch (err) {
      setGradeError(`Gemini grading failed: ${err.message}`);
      announce(`Gemini grading failed: ${err.message}`);
    } finally {
      setGrading(false);
    }
  };

  // Export
  const handleExportCSV = () => {
    if (!results.length) return;
    // Header: user, then for each question: answer, score, feedback, overridden
    const header = ['User', ...questions.flatMap(q => [`${q} Answer`, `${q} Score`, `${q} Feedback`, `${q} Overridden`])];
    const rows = results.map(r => [
      r.user,
      ...questions.flatMap(q => [
        (responses.find(resp => resp.user === r.user)?.answers[q] || '').replace(/"/g, '""'),
        r.scores[q]?.score ?? '',
        (r.scores[q]?.feedback ?? '').replace(/"/g, '""'),
        r.scores[q]?.overridden ?? ''
      ])
    ]);
    const csv = [header.join(','), ...rows.map(row => row.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graded_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportJSON = () => {
    if (!results.length) return;
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graded_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Override handler
  const handleOverride = (userIdx, question, newScore, newFeedback) => {
    setResults(results => results.map((r, i) =>
      i === userIdx ? {
        ...r,
        scores: {
          ...r.scores,
          [question]: { ...r.scores[question], score: newScore, feedback: newFeedback, overridden: true }
        }
      } : r
    ));
  };

  return (
    <div className={"dashboard-container" + (starWarsMode ? " starwars-bg" : "") }>
      <aside className="sidebar">
        <div style={{ marginBottom: 12 }}>
          <StarWarsToggle enabled={starWarsMode} onToggle={() => setStarWarsMode(sw => !sw)} />
          {mayFourth && (
            <div style={{ color: '#ffe81f', fontWeight: 'bold', margin: '8px 0 0 0', textShadow: '0 0 4px #222' }}>
              May the Fourth be with you!
            </div>
          )}
        </div>
        <div>
          <label htmlFor="import-responses"><b>Import Responses</b></label>
          <ImportPanel onImport={handleImport} />
        </div>
        <div>
          <RubricPanel questions={questions} rubrics={rubrics} onRubricChange={handleRubricChange} />
        </div>
        <div>
          <AccessibilitySettings />
        </div>
      </aside>
      <section className="main-content">
        <header className={starWarsMode ? "app-header starwars-header" : "app-header"}>
          {starWarsMode ? 'AI Form Grader: Star Wars Mode' : 'AI Form Grader Dashboard'}
        </header>
        <div className="batch-grading">
          <BatchGradingControls
            onGradeAll={handleGradeAll}
            grading={grading}
            canGrade={!!(responses.length && questions.length && questions.every(q => rubrics[q] && rubrics[q].trim()))}
          />
          {gradeError && (
            <div role="alert" aria-live="assertive" style={{ color: '#b00', background: '#fff0f0', padding: 8, margin: '8px 0', borderRadius: 4 }}>
              <b>Error:</b> {gradeError}
            </div>
          )}
        </div>
        <div className="export-panel">
          <ExportPanel onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} />
        </div>
        <div className="stats-panel">
          <StatsPanel stats={stats} />
        </div>
        <div className="results-table">
          <ResultsTable questions={questions} responses={responses} results={starWarsMode ? results.map(row => ({
            ...row,
            scores: Object.fromEntries(Object.entries(row.scores).map(([q, s]) => ({
              key: q,
              value: {
                ...s,
                feedback: starWarsFormat(s.feedback || '', { emoji: true }),
                score: s.score !== '' && !isNaN(Number(s.score)) ? starWarsFormat(`${s.score}`, {}) : s.score
              }
            })).map(({key, value}) => [key, value]))
          })) : results} onOverride={handleOverride} />
        </div>
      </section>
    </div>
  );
}



export default Dashboard;
