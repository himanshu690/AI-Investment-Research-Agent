import React, { useContext } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { AuthContext } from './context/AuthContext';
import './index.css';

function App() {
  const { token, logout, user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="app-container">
      {/* Sticky Premium Header */}
      <header style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        padding: '1.5rem 0',
        marginBottom: '4rem',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, lineHeight: 1 }}>
              Altuni <span className="text-gradient">AI Labs</span>
            </h1>
          </div>
          <div>
             <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0, fontWeight: 600, background: 'rgba(255, 20, 147, 0.05)', padding: '8px 16px', borderRadius: '99px', border: '1px solid rgba(255, 20, 147, 0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <span>Autonomous Equity Research Agent</span>
               {user && (
                 <>
                   <span style={{ width: '1px', height: '16px', background: 'rgba(0,0,0,0.1)' }}></span>
                   <span style={{ fontSize: '0.9rem' }}>{user.username}</span>
                   <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
                 </>
               )}
             </p>
          </div>
        </div>
      </header>
      
      <main style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
        {token ? <Dashboard /> : <Auth />}
      </main>
    </div>
  );
}

export default App;