import React from 'react';

export default function StarWarsToggle({ enabled, onToggle }) {
  return (
    <button
      className={"toggle-btn starwars-toggle" + (enabled ? " active" : "")}
      aria-pressed={enabled}
      title="Activate Star Wars Mode"
      onClick={onToggle}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: enabled ? '#222' : '#ffe81f', color: enabled ? '#ffe81f' : '#222', border: '2px solid #ffe81f', boxShadow: enabled ? '0 0 8px 2px #ffe81f55' : 'none', fontWeight: 700 }}
    >
      <span role="img" aria-label="lightsaber">⚡</span>
      Star Wars Mode
      <span style={{ fontSize: 18 }}>{enabled ? '🛸' : '🌌'}</span>
    </button>
  );
}
