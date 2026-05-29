import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

const PostProject = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      <h2 style={{
        fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem',
        background: 'linear-gradient(90deg, #fff, var(--neon-blue))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
      }}>
        Post a New Project
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Describe your requirements and our AI will help you scope the project.
      </p>

      <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: 680 }}>
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" className="form-input" placeholder="e.g., Build a React Dashboard" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input" rows={5} placeholder="Describe the scope of work..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Budget ($)</label>
              <input type="number" className="form-input" placeholder="e.g., 2000" />
            </div>
            <div className="form-group">
              <label>Timeline (days)</label>
              <input type="number" className="form-input" placeholder="e.g., 14" />
            </div>
          </div>
          <div className="form-group">
            <label>Required Skills (comma separated)</label>
            <input type="text" className="form-input" placeholder="React, Node.js, MongoDB" />
          </div>
          <button type="button" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
            <Cpu size={18} /> Use AI to Scope Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
