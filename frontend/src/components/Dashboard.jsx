import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Timeline from './Timeline';
import ReportViewer from './ReportViewer';

export default function Dashboard() {
  const [companyName, setCompanyName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const startResearch = (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsProcessing(true);
    setReportData(null);
    setError(null);
    setCurrentStep('INIT');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const eventSource = new EventSource(`${API_URL}/api/research?companyName=${encodeURIComponent(companyName)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE update:", data);

      if (data.step === 'ERROR') {
        setError(data.message);
        setIsProcessing(false);
        eventSource.close();
      } else if (data.step === 'DONE') {
        setReportData(data.state);
        setIsProcessing(false);
        eventSource.close();
      } else {
        setCurrentStep(data.step);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setError("Lost connection to the agent backend.");
      setIsProcessing(false);
      eventSource.close();
    };
  };

  return (
    <div className="dashboard-wrapper">
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Target Company Analysis</h2>
        
        <form onSubmit={startResearch} style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Enter company name (e.g. Apple, Nvidia, Tesla)" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '16px 24px 16px 48px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-color)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'Inter',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isProcessing || !companyName.trim()}>
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            {isProcessing ? 'Researching...' : 'Analyze'}
          </button>
        </form>
      </div>

      {error && (
        <div className="glass-panel animate-fade-in" style={{ borderColor: 'var(--danger)', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Analysis Failed</h3>
          <p>{error}</p>
        </div>
      )}

      {isProcessing && <Timeline currentStep={currentStep} />}
      
      {reportData && !isProcessing && <ReportViewer data={reportData} />}
    </div>
  );
}
