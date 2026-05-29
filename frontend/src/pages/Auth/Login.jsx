import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // role-based redirect handled by AuthContext user update
      // we navigate after login resolves
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // redirect once user is set
  React.useEffect(() => {
    if (user) {
      if (user.role === 'Client') navigate('/freelancers');
      else if (user.role === 'Freelancer') navigate('/freelancer/portfolio');
      else navigate('/explore');
    }
  }, [user]);

  return (
    <div style={{
      minHeight: '90vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1
    }}>
      {/* Glow orb behind card */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,240,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel animate-fade-in" style={{
        padding: '3rem 2.5rem', width: '100%', maxWidth: '420px',
        border: '1px solid rgba(0,240,255,0.15)',
        boxShadow: '0 0 60px rgba(0,240,255,0.06), 0 0 60px rgba(255,42,133,0.04)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(255,42,133,0.2))',
            border: '1px solid rgba(0,240,255,0.3)',
            marginBottom: '1rem'
          }}>
            <Zap size={26} color="#00f0ff" />
          </div>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to your TalentStage account
          </p>
        </div>

        {error && (
          <div className="error-box" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email" required className="form-input"
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password" required className="form-input"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit" className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Signing in...
              </span>
            ) : (
              <><ArrowRight size={16} /> Sign In</>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>Join Now</Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
