import React, { useEffect, useState } from 'react';
import { History, Loader2, ArrowRight, Trash2 } from 'lucide-react';

export default function SearchHistory({ onSelectHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/history`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/history/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete history');
      
      setHistory(prev => prev.filter(record => record._id !== id));
      setAlertMessage("The history record has been removed.");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ borderColor: 'var(--danger)' }}>
        <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Error Loading History</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <History size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>No previous searches found.</h3>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in">
      {alertMessage && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert" style={{
          padding: '1rem 3rem 1rem 1rem',
          marginBottom: '1.5rem',
          border: '1px solid #ffecb5',
          borderRadius: '0.375rem',
          backgroundColor: '#fff3cd',
          color: '#664d03',
          position: 'relative'
        }}>
          <strong>Deleted!</strong> {alertMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlertMessage(null)} 
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '1.15rem 1rem',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              lineHeight: 1,
              cursor: 'pointer',
              color: '#000',
              opacity: 0.5
            }}
          >
            &times;
          </button>
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <History size={20} className="text-gradient" />
        Search History
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {history.map((record, idx) => {
          // Calculate a stagger class dynamically, capping at stagger-3
          const staggerClass = `stagger-${Math.min(idx + 1, 3)}`;
          return (
            <div 
              key={record._id} 
              className={`history-card animate-fade-in ${staggerClass}`}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
              onClick={() => onSelectHistory(record._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 20, 147, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>{record.companyName}</h4>
                  {record.finalState?.finalDecision?.verdict && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      background: record.finalState.finalDecision.verdict.toUpperCase() === 'INVEST' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                      color: record.finalState.finalDecision.verdict.toUpperCase() === 'INVEST' ? 'var(--success)' : 'var(--danger)',
                      border: `1px solid ${record.finalState.finalDecision.verdict.toUpperCase() === 'INVEST' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                    }}>
                      {record.finalState.finalDecision.verdict.toUpperCase() === 'INVEST' ? 'INVEST' : 'PASS'}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(record.timestamp).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={(e) => handleDelete(e, record._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--danger)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                  title="Delete Record"
                >
                  <Trash2 size={20} />
                </button>
                <ArrowRight size={20} color="var(--accent-primary)" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
