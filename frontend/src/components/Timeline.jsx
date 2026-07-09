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
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: `2px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                boxShadow: isCurrent ? '0 0 0 8px rgba(99, 102, 241, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                color: isActive ? 'white' : 'var(--text-secondary)'
              }}>
                <Icon size={24} />
              </div>
              <span style={{ 
                marginTop: '1rem', 
                fontSize: '0.85rem', 
                textAlign: 'center',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontWeight: isCurrent ? '600' : '400'
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
