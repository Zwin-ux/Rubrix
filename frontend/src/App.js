import React from 'react';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './ThemeContext';
import './a11y.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div>
        <header className="app-header">AI Form Grader Dashboard</header>
        <main id="main-content">
          <div className="dashboard-container">
            <Dashboard />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
