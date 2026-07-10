import React, { useState, useContext } from 'react';
import { Search, Loader2, History, Plus, Star } from 'lucide-react';
import Timeline from './Timeline';
import ReportViewer from './ReportViewer';
import SearchHistory from './SearchHistory';
import Watchlist from './Watchlist';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('new');

  const loadHistoricReport = async (id) => {
    try {
      setIsProcessing(true);
      setReportData(null);
      setError(null);
      setViewMode('new');
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to load past report.");
      
      const data = await response.json();
      setReportData(data.finalState);
      setCompanyName(data.companyName);
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const startResearch = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsProcessing(true);
    setReportData(null);
    setError(null);
    setViewMode('new');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const historyRes = await fetch(`${API_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        const match = historyData.find(item => item.companyName.toLowerCase() === companyName.trim().toLowerCase());
        if (match) {
           await loadHistoricReport(match._id);
           return;
        }
      }
    } catch(err) {
      console.warn("Failed to check history", err);
    }

    setCurrentStep('INIT');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const eventSource = new EventSource(`${API_URL}/api/research?companyName=${encodeURIComponent(companyName)}&token=${token}`);

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

        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
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
      <div className="glass-panel animate-fade-in stagger-1" style={{ marginBottom: '3rem', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background glow */}
        <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', background: 'var(--accent-gradient-subtle)', filter: 'blur(60px)', zIndex: 0, opacity: 0.5, borderRadius: '50%' }} />
        
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem', zIndex: 1 }}>
          Target Company <span className="text-gradient">Analysis</span>
        </h2>
        
        <form onSubmit={startResearch} style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '650px', zIndex: 1 }}>
          <div style={{ position: 'relative', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Search style={{ position: 'absolute', left: '20px', color: 'var(--text-secondary)' }} size={24} />
            <input 
              type="text" 
              placeholder="Enter company name (e.g., Apple, Nvidia, Tesla)" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '20px 24px 20px 56px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                outline: 'none',
                fontFamily: 'Inter',
                transition: 'all 0.3s ease',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.02), 0 0 20px rgba(255, 20, 147, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                e.target.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.02)';
              }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isProcessing || !companyName.trim()} style={{ borderRadius: '16px', padding: '0 32px' }}>
            {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
            <span style={{ fontSize: '1.1rem' }}>{isProcessing ? 'Analyzing' : 'Analyze'}</span>
          </button>
        </form>
      </div>

      <div className="animate-fade-in stagger-2" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div className="segmented-control">
          <div className="segment-active-bg" style={{ 
            width: '150px', 
            left: '6px',
            transform: viewMode === 'new' ? 'translateX(0)' : viewMode === 'history' ? 'translateX(150px)' : 'translateX(300px)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
          <button 
            className={`segment-btn ${viewMode === 'new' ? 'active' : ''}`}
            onClick={() => setViewMode('new')}
            style={{ width: '150px', justifyContent: 'center' }}
          >
            <Plus size={18} /> New Search
          </button>
          <button 
            className={`segment-btn ${viewMode === 'history' ? 'active' : ''}`}
            onClick={() => setViewMode('history')}
            style={{ width: '150px', justifyContent: 'center' }}
          >
            <History size={18} /> History
          </button>
          <button 
            className={`segment-btn ${viewMode === 'watchlist' ? 'active' : ''}`}
            onClick={() => setViewMode('watchlist')}
            style={{ width: '150px', justifyContent: 'center', position: 'relative' }}
          >
            <Star size={18} /> Watchlist
            {user?.watchlist?.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                minWidth: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                lineHeight: 1,
                zIndex: 10
              }}>
                {user.watchlist.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel animate-fade-in" style={{ borderColor: 'var(--danger)', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Analysis Failed</h3>
          <p>{error}</p>
        </div>
      )}

      {isProcessing && <Timeline currentStep={currentStep} />}
      
      {viewMode === 'history' && !isProcessing && (
        <SearchHistory onSelectHistory={loadHistoricReport} />
      )}

      {viewMode === 'watchlist' && !isProcessing && (
        <Watchlist onSelectCompany={(name) => {
          setCompanyName(name);
          setViewMode('new');
        }} />
      )}

      {reportData && !isProcessing && viewMode === 'new' && <ReportViewer data={reportData} />}
    </div>
  );
}
