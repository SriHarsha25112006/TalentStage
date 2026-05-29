import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';

const ClientNavbar = () => {
  const { logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-container" style={{ maxWidth: '1440px', width: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Link to="/" className="nav-logo" style={{ marginLeft: '-2.5rem' }}>
          <span className="logo-icon"><Zap size={22} /></span>
          <span className="logo-text">TalentStage</span>
        </Link>
        <div className="nav-menu" style={{ gap: '1.25rem' }}>
          <nav className="nav-links" style={{ gap: '1rem', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
            <Link to="/freelancers" style={{ fontSize: '0.84rem' }}>Find Talent</Link>
            <Link to="/client/post-project" style={{ fontSize: '0.84rem' }}>Post a Project</Link>
            <Link to="/client/contracts" style={{ fontSize: '0.84rem' }}>Active Contracts</Link>
            <Link to="/client/payments" style={{ fontSize: '0.84rem' }}>Payments</Link>
            <Link to="/community" style={{ fontSize: '0.84rem' }}>Community</Link>
          </nav>
          <div className="nav-actions">
            <button onClick={logout} className="btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;
