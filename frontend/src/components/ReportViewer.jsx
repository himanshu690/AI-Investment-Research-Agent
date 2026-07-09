import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ReportViewer({ data }) {
  if (!data || !data.finalDecision) return null;

  const isSuccess = ['INVEST', 'PASS'].includes(data.finalDecision.verdict.toUpperCase());

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      
      {/* Verdict Header */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '2rem',
        background: isSuccess ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
        borderColor: isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
        boxShadow: isSuccess ? '0 8px 32px var(--success-glow)' : '0 8px 32px var(--danger-glow)',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow behind icon */}
        <div style={{ position: 'absolute', width: '150px', height: '150px', background: isSuccess ? 'var(--success)' : 'var(--danger)', filter: 'blur(80px)', opacity: 0.2 }} />
        
        {isSuccess ? <CheckCircle size={64} color="var(--success)" style={{ zIndex: 1 }} /> : <XCircle size={64} color="var(--danger)" style={{ zIndex: 1 }} />}
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', color: isSuccess ? 'var(--success)' : 'var(--danger)', textShadow: isSuccess ? '0 0 20px var(--success-glow)' : '0 0 20px var(--danger-glow)' }}>
            {data.finalDecision.verdict}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.2rem' }}>Final Committee Decision for <strong style={{ color: 'var(--text-primary)' }}>{data.companyName}</strong></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Thesis Column */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Investment Thesis
          </h3>
          <div className="markdown-body">
            <ReactMarkdown>{data.finalDecision.thesis}</ReactMarkdown>
          </div>
        </div>

        {/* Data / Facts Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem' }}>Key Financials</h3>
            {data.financialData && !data.financialData.error ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Current Price</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>${data.financialData.currentPrice?.toFixed(2) || 'N/A'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Market Cap</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{data.financialData.marketCap ? `$${(data.financialData.marketCap / 1e9).toFixed(2)}B` : 'N/A'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Trailing P/E</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{data.financialData.trailingPE?.toFixed(2) || 'N/A'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Revenue Growth</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: data.financialData.revenueGrowth > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                    {data.financialData.revenueGrowth ? `${(data.financialData.revenueGrowth * 100).toFixed(2)}%` : 'N/A'}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>Data unavailable or parsing failed.</p>
            )}
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem' }}>Raw Analyst Notes</h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxHeight: '300px', overflowY: 'auto' }}>
               <ReactMarkdown>{data.analystReport}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
