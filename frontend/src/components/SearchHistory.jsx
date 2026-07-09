import React, { useEffect, useState } from 'react';
import { History, Loader2, ArrowRight } from 'lucide-react';

export default function SearchHistory({ onSelectHistory }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{record.companyName}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(record.timestamp).toLocaleString()}
                </span>
              </div>
              <ArrowRight size={20} color="var(--accent-primary)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
