import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';

const BothNavbar = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('freelancer'); // 'freelancer' or 'client'

  return (
    <header className="navbar">
      <div className="container nav-container" style={{ maxWidth: '1440px', width: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Link to="/" className="nav-logo" style={{ marginLeft: '-2.5rem' }}>
          <span className="logo-icon"><Zap size={22} /></span>
          <span className="logo-text">TalentStage</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'nowrap' }}>
          {/* Mode switcher */}
          <div style={{
            display: 'flex', borderRadius: 50, overflow: 'hidden',
            border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(0,0,0,0.3)', flexShrink: 0
          }}>
            <button onClick={() => setActiveTab('freelancer')} style={{
              padding: '0.35rem 0.8rem', background: activeTab === 'freelancer' ? 'rgba(59,130,246,0.25)' : 'transparent',
              border: 'none', color: activeTab === 'freelancer' ? '#60a5fa' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s'
            }}>Freelancer</button>
            <button onClick={() => setActiveTab('client')} style={{
              padding: '0.35rem 0.8rem', background: activeTab === 'client' ? 'rgba(99,102,241,0.25)' : 'transparent',
              border: 'none', color: activeTab === 'client' ? '#818cf8' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s'
            }}>Client</button>
          </div>

          <div className="nav-menu" style={{ gap: '1.25rem' }}>
            <nav className="nav-links" style={{ gap: '1rem', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
              {activeTab === 'freelancer' ? (
                <>
                  <Link to="/explore" style={{ fontSize: '0.84rem' }}>Browse Projects</Link>
                  <Link to="/freelancer/portfolio" style={{ fontSize: '0.84rem' }}>My Portfolio</Link>
                  <Link to="/freelancer/skills" style={{ fontSize: '0.84rem' }}>Skills & Badges</Link>
                  <Link to="/freelancer/contracts" style={{ fontSize: '0.84rem' }}>Contracts</Link>
                  <Link to="/freelancer/earnings" style={{ fontSize: '0.84rem' }}>Earnings</Link>
                  <Link to="/community" style={{ fontSize: '0.84rem' }}>Community</Link>
                </>
              ) : (
                <>
                  <Link to="/explore" style={{ fontSize: '0.84rem' }}>Explore Talent</Link>
                  <Link to="/client/post-project" style={{ fontSize: '0.84rem' }}>Post Project</Link>
                  <Link to="/client/contracts" style={{ fontSize: '0.84rem' }}>My Contracts</Link>
                  <Link to="/client/payments" style={{ fontSize: '0.84rem' }}>Payments</Link>
                  <Link to="/community" style={{ fontSize: '0.84rem' }}>Community</Link>
                </>
              )}
            </nav>
            <div className="nav-actions">
              <button onClick={logout} className="btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BothNavbar;
