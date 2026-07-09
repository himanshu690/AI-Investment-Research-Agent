import React from 'react';
import { Database, FileText, Scale } from 'lucide-react';

export default function Timeline({ currentStep }) {
  const steps = [
    { id: 'INIT', label: 'Initializing Agents', icon: Database },
    { id: 'RESEARCH_COMPLETE', label: 'Scraping Financials & News', icon: Database },
    { id: 'ANALYSIS_COMPLETE', label: 'Quantitative & Sentiment Analysis', icon: FileText },
    { id: 'COMMITTEE_VERDICT', label: 'Investment Committee Review', icon: Scale }
  ];

  const getStepIndex = (stepId) => {
    const idx = steps.findIndex(s => s.id === stepId);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
        Agents at Work...
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Connecting line */}
        <div style={{ 
          position: 'absolute', 
          top: '24px', 
          left: '0', 
          right: '0', 
          height: '2px', 
          background: 'var(--border-color)', 
          zIndex: 0 
        }}>
          <div style={{ 
            height: '100%', 
            background: 'var(--accent-gradient)', 
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>

        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '120px' }}>
              <div style={{ 
                position: 'relative',
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: isActive ? 'var(--accent-gradient)' : 'rgba(0,0,0,0.02)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: isActive ? 'none' : '2px solid rgba(0,0,0,0.05)',
                boxShadow: isActive ? '0 4px 15px rgba(255, 20, 147, 0.4)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                color: isActive ? 'white' : 'var(--text-secondary)'
              }}>
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    borderRadius: '50%',
                    border: '2px solid var(--accent-primary)',
                    animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }} />
                )}
                <Icon size={24} style={{ zIndex: 1 }} />
              </div>
              <span style={{ 
                marginTop: '1rem', 
                fontSize: '0.85rem', 
                textAlign: 'center',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isCurrent ? '700' : '500'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
