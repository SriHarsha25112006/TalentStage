import React, { useState } from 'react';
import { Users, MessageSquare, Award, X, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Community = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [postText, setPostText] = useState('');
  const toast = useToast();

  const closeModal = () => setActiveModal(null);

  const handlePost = () => {
    if (!postText.trim()) { toast.error('Write something first!'); return; }
    toast.success('🚀 Your post is live on the feed!');
    setPostText('');
    closeModal();
  };

  const handleJoinChallenge = (name) => {
    toast.success(`🏆 Joined "${name}"! Good luck!`);
    closeModal();
  };

  const handleMentorRequest = (name) => {
    toast.info(`📨 Request sent to ${name}. They'll respond shortly.`);
    closeModal();
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(0,240,255,0.08)', padding: '0.4rem 1rem',
          borderRadius: '50px', border: '1px solid rgba(0,240,255,0.25)',
          color: 'var(--neon-blue)', fontSize: '0.85rem', fontWeight: 700,
          letterSpacing: '1px', marginBottom: '1.5rem', textTransform: 'uppercase'
        }}>
          ✦ Community
        </div>
        <h2 style={{
          fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 30%, var(--neon-blue) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Community Hub
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
          Connect, learn, and grow with top-tier professionals in the TalentStage ecosystem.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

        {/* Public Feed */}
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(59,130,246,0.15)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.75rem',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(0,240,255,0.1))',
            border: '1px solid rgba(59,130,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59,130,246,0.2)'
          }}>
            <MessageSquare size={32} color="#60a5fa" />
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Public Feed</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
            Share your wins, drop knowledge, or ask for feedback from peers.
          </p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => setActiveModal('feed')}>
            <MessageSquare size={16} /> Join Discussion
          </button>
        </div>

        {/* Skill Challenges */}
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(245,158,11,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.75rem',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.1))',
            border: '1px solid rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245,158,11,0.2)'
          }}>
            <Award size={32} color="#fbbf24" />
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Skill Challenges</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
            Participate in weekly hackathons to earn exclusive neon badges.
          </p>
          <button className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg,#d97706,#f59e0b)' }} onClick={() => setActiveModal('challenges')}>
            <Award size={16} /> View Challenges
          </button>
        </div>

        {/* Mentorship */}
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(16,185,129,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.75rem',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.1))',
            border: '1px solid rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16,185,129,0.2)'
          }}>
            <Users size={32} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Mentorship</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.65, fontSize: '0.95rem' }}>
            Find a mentor to level up your career, or guide aspiring juniors.
          </p>
          <button className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg,#059669,#10b981)' }} onClick={() => setActiveModal('mentor')}>
            <Users size={16} /> Find Mentor
          </button>
        </div>
      </div>

      {/* ── MODALS ── */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="glass-panel modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,42,133,0.15)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <X size={18} />
            </button>

            {/* PUBLIC FEED MODAL */}
            {activeModal === 'feed' && (
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(90deg,#60a5fa,#00f0ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Public Feed
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
                  What's happening in the community?
                </p>

                {/* Simulated posts */}
                {[
                  { name: '@crypto_ninja', color: 'var(--neon-blue)', msg: 'Just landed a smart contract gig using TalentStage matching! 🚀 Absolutely insane experience!' },
                  { name: '@uiux_master', color: 'var(--neon-pink)', msg: 'Anyone know how to trigger a glassmorphism glow purely with CSS? Need help ASAP.' },
                  { name: '@ml_guru99', color: '#a855f7', msg: 'Just got my Machine Learning badge! Scored 95% on the AI test. Highly recommend it 🧠' },
                ].map((post, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)', padding: '1rem 1.25rem',
                    borderRadius: 12, marginBottom: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'border-color 0.2s'
                  }}>
                    <p style={{ color: post.color, margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>{post.name}</p>
                    <p style={{ margin: 0, color: '#c8d3ea', lineHeight: 1.5, fontSize: '0.95rem' }}>{post.msg}</p>
                  </div>
                ))}

                <div style={{ marginTop: '1.5rem' }}>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Share something with the community..."
                    value={postText}
                    onChange={e => setPostText(e.target.value)}
                    style={{ resize: 'none', marginBottom: '1rem' }}
                  />
                  <button className="btn-primary" style={{ width: '100%' }} onClick={handlePost}>
                    <Send size={16} /> Post Update
                  </button>
                </div>
              </div>
            )}

            {/* CHALLENGES MODAL */}
            {activeModal === 'challenges' && (
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(90deg,#fbbf24,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Weekly Hackathons
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
                  Compete, win badges, and get noticed by top clients.
                </p>

                {[
                  { title: 'Frontend Glow Challenge', desc: 'Create the most futuristic button using only HTML/CSS. Winner earns the "Design God" badge.', badge: '🎨 Design God Badge', color: '#fbbf24', glow: 'rgba(245,158,11,0.15)' },
                  { title: 'Python Algo Sprint', desc: 'Optimize a pathfinding algorithm. The fastest execution time wins a "Code Wizard" badge.', badge: '⚡ Code Wizard Badge', color: 'var(--neon-blue)', glow: 'rgba(0,240,255,0.1)' },
                  { title: 'System Design Battle', desc: 'Design a scalable real-time chat system. Best architecture wins "Architect Pro" badge.', badge: '🏗️ Architect Pro Badge', color: '#a855f7', glow: 'rgba(168,85,247,0.1)' },
                ].map((c, i) => (
                  <div key={i} style={{
                    border: `1px solid ${c.color}40`, padding: '1.25rem 1.5rem',
                    borderRadius: 12, marginBottom: '1rem',
                    background: c.glow,
                    transition: 'all 0.2s'
                  }}>
                    <h4 style={{ margin: '0 0 0.5rem', color: c.color, fontSize: '1.1rem' }}>{c.title}</h4>
                    <p style={{ margin: '0 0 0.5rem', color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5 }}>{c.desc}</p>
                    <p style={{ margin: '0 0 1rem', color: '#6b7280', fontSize: '0.82rem' }}>Reward: <span style={{ color: c.color }}>{c.badge}</span></p>
                    <button className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }} onClick={() => handleJoinChallenge(c.title)}>
                      Participate Now
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* MENTOR MODAL */}
            {activeModal === 'mentor' && (
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(90deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Find a Mentor
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Connect with senior developers who've been there.
                </p>
                <input type="text" className="form-input" placeholder="🔍 Search by skill (React, AI, DevOps...)" style={{ marginBottom: '1.5rem' }} />

                {[
                  { name: 'Sarah Jenkins', role: 'Senior React Architect', exp: '9 yrs', color: '#f472b6', badge: 'React Verified' },
                  { name: 'David Chen', role: 'Machine Learning Lead', exp: '7 yrs', color: 'var(--neon-blue)', badge: 'AI Verified' },
                  { name: 'Priya Sharma', role: 'Full Stack Engineer', exp: '6 yrs', color: '#a78bfa', badge: 'Node.js Verified' },
                ].map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12, marginBottom: '0.75rem',
                    transition: 'all 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${m.color}50`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                      background: `linear-gradient(135deg, ${m.color}60, ${m.color}20)`,
                      border: `2px solid ${m.color}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.1rem', color: m.color
                    }}>
                      {m.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.2rem', fontWeight: 700 }}>{m.name}</p>
                      <p style={{ margin: '0 0 0.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{m.role} · {m.exp} exp</p>
                      <span style={{
                        display: 'inline-block', padding: '0.15rem 0.6rem',
                        borderRadius: 8, background: `${m.color}15`,
                        border: `1px solid ${m.color}40`, color: m.color,
                        fontSize: '0.75rem', fontWeight: 600
                      }}>✓ {m.badge}</span>
                    </div>
                    <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', flexShrink: 0 }} onClick={() => handleMentorRequest(m.name)}>
                      Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
