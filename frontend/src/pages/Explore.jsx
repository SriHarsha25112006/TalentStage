import React, { useState } from 'react';
import { Search, DollarSign, Clock, Zap, X, Briefcase, Calendar, Award } from 'lucide-react';

const ALL_PROJECTS = [
  { title: "Senior React Developer Needed", budget: "$3,000–$5,000", type: "Fixed", skills: ["React", "TypeScript", "Tailwind"], color: '#00f0ff', desc: "We are looking for a Senior React Developer to join our team for building a high-fidelity analytics dashboard. The ideal candidate will have strong experience in React, TypeScript, and state management libraries like Redux Toolkit. You will be responsible for creating modern visual layouts, implementing custom-select dropdown elements, and integrating REST API services.", duration: "2 Months", client: "AlphaTech Inc.", experience: "Expert" },
  { title: "UI/UX Designer for Fintech App", budget: "$45/hr", type: "Hourly", skills: ["Figma", "Prototyping", "UX Research"], color: '#ff2a85', desc: "Fintech Startup is seeking a talented UI/UX Designer to craft premium, interactive web and mobile prototypes. Your main task will be creating harmonious dark-theme color palettes, designing smooth micro-animations, and planning pixel-perfect dashboards. Experience with HSL color tailored layouts is highly desired.", duration: "3 Months", client: "CoinFlow Ltd.", experience: "Intermediate" },
  { title: "Backend API for E-commerce", budget: "$1,500–$2,500", type: "Fixed", skills: ["Node.js", "Express", "PostgreSQL"], color: '#10b981', desc: "We need a robust, scalable backend for our new e-commerce platform. You will build REST APIs using Node.js and Express, connected to a PostgreSQL database. Must have experience with JWT authentication, payment gateway integration, and database schema optimization.", duration: "1 Month", client: "ShopNest Global", experience: "Intermediate" },
  { title: "Smart Contract Auditor", budget: "$120/hr", type: "Hourly", skills: ["Solidity", "Web3", "Security"], color: '#a855f7', desc: "Seeking an experienced Smart Contract Auditor to review our DeFi protocols before mainnet launch. You will identify vulnerabilities, gas optimization opportunities, and ensure adherence to best practices in Solidity. Familiarity with Hardhat and security analysis tools is required.", duration: "2 Weeks", client: "DeFi Protocol X", experience: "Expert" },
  { title: "Machine Learning Model for NLP", budget: "$4,000–$7,000", type: "Fixed", skills: ["Python", "PyTorch", "NLP"], color: '#f59e0b', desc: "Develop a custom NLP model for sentiment analysis and entity extraction on financial news. You will be working with PyTorch and huggingface transformers. The final deliverable must include a Dockerized API wrapper for inference.", duration: "6 Weeks", client: "QuantEdge Analytics", experience: "Expert" },
  { title: "Mobile App Developer — React Native", budget: "$60/hr", type: "Hourly", skills: ["React Native", "Firebase", "Expo"], color: '#00f0ff', desc: "Looking for a React Native developer to build a cross-platform fitness application. The app includes real-time tracking, social features, and push notifications via Firebase. Must be comfortable with Expo and UI animations.", duration: "3 Months", client: "FitLife Apps", experience: "Intermediate" },
];

const Explore = () => {
  const [search, setSearch] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = ALL_PROJECTS.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,240,255,0.08)', padding: '0.4rem 1rem',
          borderRadius: '50px', border: '1px solid rgba(0,240,255,0.25)',
          color: 'var(--neon-blue)', fontSize: '0.82rem', fontWeight: 700,
          letterSpacing: '1px', marginBottom: '1.25rem', textTransform: 'uppercase'
        }}>
          <Zap size={13} /> Live Projects
        </div>
        <h2 style={{
          fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #fff 30%, var(--neon-blue) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>
          Explore Open Projects
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Find your next opportunity from premium clients worldwide
        </p>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 500, margin: '0 auto 3rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input
          type="text" className="form-input"
          placeholder="Search by title or skill..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: '2.75rem', borderRadius: '50px', borderColor: 'rgba(0,240,255,0.2)' }}
        />
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((p, i) => (
          <div
            key={i}
            className="glass-card"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              padding: '1.75rem',
              borderColor: hoveredIdx === i ? `${p.color}40` : 'rgba(255,255,255,0.06)',
              boxShadow: hoveredIdx === i ? `0 0 30px ${p.color}15, 0 20px 40px rgba(0,0,0,0.3)` : '',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: p.color,
                boxShadow: `0 0 8px ${p.color}`, marginTop: 6, flexShrink: 0
              }} />
              <span style={{
                background: p.type === 'Fixed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                border: `1px solid ${p.type === 'Fixed' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
                color: p.type === 'Fixed' ? '#34d399' : '#fbbf24',
                padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700
              }}>
                {p.type === 'Fixed' ? <><DollarSign size={11} style={{ verticalAlign: 'middle' }} /> Fixed</> : <><Clock size={11} style={{ verticalAlign: 'middle' }} /> Hourly</>}
              </span>
            </div>

            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', lineHeight: 1.4, color: 'white' }}>{p.title}</h3>
            <p style={{ color: p.color, fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>{p.budget}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {p.skills.map((s, idx) => (
                <span key={idx} style={{
                  background: `${p.color}12`, border: `1px solid ${p.color}30`,
                  color: p.color, padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600
                }}>{s}</span>
              ))}
            </div>

            <button 
              className="btn-outline" 
              onClick={() => setSelectedProject(p)}
              style={{
                width: '100%', padding: '0.65rem',
                borderColor: `${p.color}60`, color: p.color, cursor: 'pointer'
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <Search size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
          <p>No projects match your search. Try a different keyword.</p>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '2rem'
        }} onClick={() => setSelectedProject(null)}>
          
          <div className="glass-panel animate-fade-in" style={{
            width: '100%', maxWidth: 650, padding: '2.5rem', position: 'relative',
            border: `1px solid ${selectedProject.color}40`,
            boxShadow: `0 0 80px ${selectedProject.color}15`,
            maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: 20, background: `${selectedProject.color}15`, color: selectedProject.color, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1rem', border: `1px solid ${selectedProject.color}30` }}>
              {selectedProject.type === 'Fixed' ? 'Fixed Price' : 'Hourly Contract'}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2 }}>{selectedProject.title}</h2>
            <p style={{ color: selectedProject.color, fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>{selectedProject.budget}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <Briefcase size={14} /> Client
                </span>
                <strong style={{ color: 'white' }}>{selectedProject.client}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <Calendar size={14} /> Duration
                </span>
                <strong style={{ color: 'white' }}>{selectedProject.duration}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <Award size={14} /> Experience Level
                </span>
                <strong style={{ color: 'white' }}>{selectedProject.experience}</strong>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Project Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {selectedProject.desc}
            </p>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {selectedProject.skills.map((s, idx) => (
                <span key={idx} style={{
                  background: `${selectedProject.color}10`, border: `1px solid ${selectedProject.color}30`,
                  color: selectedProject.color, padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600
                }}>{s}</span>
              ))}
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', background: `linear-gradient(135deg, ${selectedProject.color}90, ${selectedProject.color})` }}>
              Submit Proposal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Explore;
