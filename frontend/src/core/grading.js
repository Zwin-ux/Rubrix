// Core grading logic for multi-platform use (web, extension, desktop, mobile)
// This function can be imported by any platform-specific UI

export async function gradeWithGemini({ question, userAnswer, rubric }) {
  // This function calls the backend API, which proxies to Gemini securely
  const res = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, userAnswer, rubric })
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error || 'Unknown error');
  return { score: json.score, feedback: json.feedback };
}
