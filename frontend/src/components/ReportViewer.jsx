import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ReportViewer({ data }) {
  if (!data || !data.finalDecision) return null;

  const isInvest = data.finalDecision.verdict === 'INVEST';

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      
      {/* Verdict Header */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1.5rem',
        background: isInvest ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderColor: isInvest ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
      }}>
        {isInvest ? <CheckCircle size={48} color="var(--success)" /> : <XCircle size={48} color="var(--danger)" />}
        <div>
          <h2 style={{ fontSize: '2rem', margin: 0, color: isInvest ? 'var(--success)' : 'var(--danger)' }}>
            {data.finalDecision.verdict}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Final Committee Decision for {data.companyName}</p>
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
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Price</span>
                  <strong>${data.financialData.currentPrice?.toFixed(2) || 'N/A'}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Market Cap</span>
                  <strong>{data.financialData.marketCap ? `$${(data.financialData.marketCap / 1e9).toFixed(2)}B` : 'N/A'}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Trailing P/E</span>
                  <strong>{data.financialData.trailingPE?.toFixed(2) || 'N/A'}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Revenue Growth</span>
                  <strong>{data.financialData.revenueGrowth ? `${(data.financialData.revenueGrowth * 100).toFixed(2)}%` : 'N/A'}</strong>
                </li>
              </ul>
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
