import React, { useState } from 'react';
import { ArrowRight, Code, PenTool, Sparkles, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '5rem', paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', paddingBottom: '5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 240, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--neon-blue)', marginBottom: '2rem', color: 'var(--neon-blue)' }}>
          <Sparkles size={16} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Welcome to the Future of Work</span>
        </div>
        
        <h1 style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: '1.1', textShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}>
          Where Top Talent Meets <span className="neon-title" style={{ display: 'inline-block' }}>AI-Powered</span> Matching
        </h1>
        
        <p style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginBottom: '3rem', lineHeight: '1.6', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          Join the next-generation platform for creatives and developers. 
          Showcase your work, get verified by AI, and land premium contracts in an immersive digital ecosystem.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/signup" className="btn-primary" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '50px' }}>
            <Rocket size={20} style={{ marginRight: '0.75rem' }} /> Enter The Stage
          </Link>
          <Link to="/explore" className="btn-outline" style={{ display: 'flex', alignItems: 'center', padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '50px' }}>
            Explore Grid <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Card 1 */}
        <div 
          className="glass-card" 
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            padding: '3rem 2rem', 
            borderRadius: '24px', 
            textAlign: 'center',
            transform: hoveredCard === 1 ? 'translateY(-10px)' : 'translateY(0)',
            boxShadow: hoveredCard === 1 ? '0 20px 40px rgba(0, 240, 255, 0.2)' : 'none',
            border: hoveredCard === 1 ? '1px solid var(--neon-blue)' : '1px solid var(--glass-border)'
          }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-pink))', 
            width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
            boxShadow: '0 0 20px var(--neon-pink)'
          }}>
            <Sparkles color="white" size={40} />
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>AI Skill Verification</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem' }}>
            Prove your expertise with highly personalized, dynamically generated skill assessments that set you apart.
          </p>
        </div>

        {/* Card 2 */}
        <div 
          className="glass-card" 
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            padding: '3rem 2rem', 
            borderRadius: '24px', 
            textAlign: 'center',
            transform: hoveredCard === 2 ? 'translateY(-10px)' : 'translateY(0)',
            boxShadow: hoveredCard === 2 ? '0 20px 40px rgba(16, 185, 129, 0.2)' : 'none',
            border: hoveredCard === 2 ? '1px solid var(--success)' : '1px solid var(--glass-border)'
          }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981, #059669)', 
            width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
            boxShadow: '0 0 20px #10b981'
          }}>
            <Code color="white" size={40} />
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>Smart Matching</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem' }}>
            Our neural network analyzes project scopes and freelancer portfolios to recommend the perfect fit in milliseconds.
          </p>
        </div>

        {/* Card 3 */}
        <div 
          className="glass-card" 
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ 
            padding: '3rem 2rem', 
            borderRadius: '24px', 
            textAlign: 'center',
            transform: hoveredCard === 3 ? 'translateY(-10px)' : 'translateY(0)',
            boxShadow: hoveredCard === 3 ? '0 20px 40px rgba(245, 158, 11, 0.2)' : 'none',
            border: hoveredCard === 3 ? '1px solid var(--warning)' : '1px solid var(--glass-border)'
          }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem',
            boxShadow: '0 0 20px #f59e0b'
          }}>
            <PenTool color="white" size={40} />
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>Neon Portfolios</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem' }}>
            Showcase your best work in a stunning glassmorphism gallery, with AI-driven feedback to improve your presentation.
          </p>
        </div>

      </section>
    </div>
  );
};

export default Home;
