import React, { useState, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, XCircle, Star, Loader2 } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Legend, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';

export default function ReportViewer({ data }) {
  if (!data || !data.finalDecision) return null;

  const isSuccess = data.finalDecision.verdict.toUpperCase() === 'INVEST';
  const displayVerdict = isSuccess ? 'INVEST' : 'PASS';
  const histData = data.financialData?.historicalData || [];
  const quartData = data.financialData?.quarterlyData || [];
  
  // Format quarterly data
  const barData = quartData.map(q => ({
    name: q.quarter,
    revenue: q.revenue / 1e9 // in Billions
  }));

  // Format Pie Data (Revenue Allocation for latest quarter: Profit vs Operating Costs)
  const recentQuarter = quartData.length > 0 ? quartData[quartData.length - 1] : null;
  const pieData = recentQuarter ? [
    { name: 'Net Profit', value: Math.max(0, recentQuarter.earnings) },
    { name: 'Operating Costs', value: Math.max(0, recentQuarter.revenue - recentQuarter.earnings) }
  ] : [];
  const pieColors = ['#0ea5e9', '#4ade80']; // Match image style a bit better

  const { token, updateWatchlist } = useContext(AuthContext);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToWatchlist = async () => {
    setIsAdding(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/watchlist/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ companyName: data.companyName })
      });
      
      if (response.ok) {
        const updatedWatchlist = await response.json();
        updateWatchlist(updatedWatchlist);
        setAdded(true);
      } else {
        const err = await response.json();
        if (err.error === 'Company already in watchlist') {
          setAdded(true);
        } else {
          alert('Failed to add: ' + err.error);
        }
      }
    } catch (err) {
      alert('Error adding to watchlist');
    } finally {
      setIsAdding(false);
    }
  };

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
        <div style={{ zIndex: 1, flexGrow: 1 }}>
          <h2 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', color: isSuccess ? 'var(--success)' : 'var(--danger)', textShadow: isSuccess ? '0 0 20px var(--success-glow)' : '0 0 20px var(--danger-glow)' }}>
            {displayVerdict}
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.2rem' }}>Final Committee Decision for <strong style={{ color: 'var(--text-primary)' }}>{data.companyName}</strong></p>
        </div>
        
        <div style={{ zIndex: 1 }}>
          <button 
            onClick={handleAddToWatchlist}
            disabled={isAdding || added}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '12px 24px', 
              borderRadius: '12px', 
              border: 'none', 
              background: added ? 'rgba(0,0,0,0.05)' : 'var(--accent-primary)',
              color: added ? 'var(--text-secondary)' : '#fff',
              cursor: added ? 'default' : 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              boxShadow: added ? 'none' : '0 4px 15px rgba(255, 20, 147, 0.3)'
            }}
          >
            {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Star size={18} fill={added ? "currentColor" : "none"} />}
            {added ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>

      {/* 3-Panel Data Visualization Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Quarterly Revenue */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111', fontWeight: 700 }}>Quarterly Revenue</h3>
          {barData.length > 0 ? (
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} tickFormatter={(val) => `$${val}B`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value.toFixed(2)}B`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#4ade80" radius={[2, 2, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', margin: 'auto' }}>No data</p>
          )}
        </div>

        {/* Last Year Price */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111', fontWeight: 700 }}>Last Year</h3>
          {histData.length > 0 ? (
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={histData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} dy={10} minTickGap={30} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} tickFormatter={(val) => `$${val.toFixed(0)}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', margin: 'auto' }}>No data</p>
          )}
        </div>

        {/* Company's Allocation */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111', fontWeight: 700 }}>Company's Allocation</h3>
          {pieData.length > 0 ? (
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${(value/1e9).toFixed(2)}B`]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#666' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', margin: 'auto' }}>No data</p>
          )}
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

            {/* Charts moved to the top panel */}
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
