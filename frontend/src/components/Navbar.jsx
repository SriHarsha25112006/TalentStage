import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon"><Zap size={22} /></span>
          <span className="logo-text">TalentStage</span>
        </Link>
        <div className="nav-menu">
          <nav className="nav-links">
            <Link to="/explore">Explore Projects</Link>
            <Link to="/freelancers">Find Talent</Link>
            <Link to="/community">Community</Link>
          </nav>
          <div className="nav-actions">
            <Link to="/login" className="btn-outline" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>Sign In</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>Join Now</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
