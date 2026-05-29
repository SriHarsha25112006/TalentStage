import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, User, Mail, Lock, ChevronDown, ArrowRight, AlertCircle } from 'lucide-react';

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'Freelancer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Once user is set by signup → redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'Client') navigate('/freelancers', { replace: true });
      else if (user.role === 'Both') navigate('/dashboard', { replace: true });
      else navigate('/freelancer/portfolio', { replace: true });
    }
  }, [user]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(formData);
      // redirect handled by useEffect above when user state updates
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        let msg = detail[0].msg || 'Validation error';
        if (msg.startsWith('Value error, ')) {
          msg = msg.replace('Value error, ', '');
        }
        setError(msg);
      } else if (!err.response || err.message === 'Network Error') {
        setError('Cannot connect to server. Ensure backend is running.');
      } else {
        setError('Signup failed. Email may already be in use.');
      }
      setLoading(false);
    }
  };

  const roles = [
    { value: 'Freelancer', label: '🎯 Freelancer — I want to get hired', desc: 'Apply to projects, take skill tests, earn badges' },
    { value: 'Client', label: '💼 Client — I want to hire talent', desc: 'Post projects, review proposals, manage contracts' },
    { value: 'Both', label: '⚡ Both — Hire & get hired', desc: 'Full access to all freelancer and client features' },
  ];

  return (
    <div style={{
      minHeight: '92vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1
    }}>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel animate-fade-in" style={{
        padding: '3rem 2.5rem', width: '100%', maxWidth: '480px',
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: '0 0 60px rgba(99,102,241,0.07), 0 0 60px rgba(59,130,246,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))',
            border: '1px solid rgba(99,102,241,0.4)', marginBottom: '1rem'
          }}>
            <Zap size={26} color="#818cf8" />
          </div>
          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.75rem', fontWeight: 800 }}>Join TalentStage</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Start your journey — it's completely free
          </p>
        </div>

        {error && (
          <div className="error-box" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.45rem' }}>
              <User size={13} /> Full Name
            </label>
            <input type="text" name="full_name" required className="form-input"
              placeholder="Sri Harsha" onChange={handleChange} />
          </div>

          {/* Email */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.45rem' }}>
              <Mail size={13} /> Email Address
            </label>
            <input type="email" name="email" required className="form-input"
              placeholder="you@example.com" onChange={handleChange} />
          </div>

          {/* Password */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.45rem' }}>
              <Lock size={13} /> Password
            </label>
            <input type="password" name="password" required className="form-input"
              placeholder="Min. 6 characters" onChange={handleChange} />
          </div>

          {/* Role Selector Cards */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
              <ChevronDown size={13} /> I want to...
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {roles.map(r => (
                <label key={r.value} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.9rem 1rem', borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${formData.role === r.value ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.07)'}`,
                  background: formData.role === r.value ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s',
                  boxShadow: formData.role === r.value ? '0 0 15px rgba(99,102,241,0.15)' : 'none'
                }}>
                  <input type="radio" name="role" value={r.value}
                    checked={formData.role === r.value}
                    onChange={handleChange}
                    style={{ marginTop: 3, accentColor: '#818cf8' }} />
                  <div>
                    <p style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '0.9rem' }}>{r.label}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{r.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary"
            style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem' }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Creating your account...
              </span>
            ) : <><ArrowRight size={16} /> Create Account</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#60a5fa', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Signup;
