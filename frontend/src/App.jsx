import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          Altuni <span className="text-gradient">AI Labs</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Autonomous Equity Research & Investment Agent
        </p>
      </header>
      
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;