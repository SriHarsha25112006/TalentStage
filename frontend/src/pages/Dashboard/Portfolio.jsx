import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Pencil, Check, X, Star, BookOpen, Plus, Trash2, Save, User, Loader2 } from 'lucide-react';

const MALE_AVATARS   = ['/avatar_m1.png', '/avatar_m2.png', '/avatar_m3.png', '/avatar_m4.png', '/avatar_m5.png'];
const FEMALE_AVATARS = ['/avatar_f1.png', '/avatar_f2.png', '/avatar_f3.png', '/avatar_f4.png', '/avatar_f5.png'];

const CSE_SKILLS = [
  'Python','Java','C++','JavaScript','TypeScript','React','Vue.js','Angular','Node.js',
  'Express','Django','FastAPI','Spring Boot','SQL','MongoDB','PostgreSQL','Redis',
  'Docker','Kubernetes','AWS','GCP','Azure','Machine Learning','Deep Learning',
  'Computer Vision','NLP','Data Science','Algorithms','System Design','Cyber Security',
  'Blockchain','DevOps','Linux','Git','GraphQL','REST APIs','Microservices'
];

const Portfolio = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    bio: 'I am a passionate full-stack developer with a love for building elegant, scalable solutions.',
    hourly_rate: 50,
    availability_status: 'Available',
    avatar: '/avatar_m1.png',
    skills: ['Python', 'React', 'Node.js'],
    badges: [],
    education: [{ institution: 'NIT Warangal', degree: 'B.Tech CSE', start_year: 2024, end_year: 2028 }]
  });

  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoData, setInfoData] = useState({ hourly_rate: 50, availability_status: 'Available' });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [editingEdu, setEditingEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', start_year: 2024, end_year: 2028 });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://127.0.0.1:8000/api/portfolio/my-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const pData = data.profile || {};
        
        const mergedProfile = {
          bio: pData.bio || profile.bio,
          hourly_rate: pData.hourly_rate ?? profile.hourly_rate,
          availability_status: pData.availability_status || profile.availability_status,
          avatar: pData.avatar || profile.avatar,
          skills: pData.skills || profile.skills,
          badges: pData.badges || profile.badges,
          education: pData.education || profile.education
        };
        
        setProfile(mergedProfile);
        setBioText(mergedProfile.bio);
        setInfoData({
          hourly_rate: mergedProfile.hourly_rate,
          availability_status: mergedProfile.availability_status
        });
      }
    } catch (err) {
      console.error("Error fetching profile from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfileOnBackend = async (fields) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://127.0.0.1:8000/api/portfolio/my-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fields)
      });
    } catch (err) {
      console.error("Error saving profile update:", err);
    }
  };

  const saveBio = async () => {
    setProfile(p => ({ ...p, bio: bioText }));
    setEditingBio(false);
    await updateProfileOnBackend({ bio: bioText });
  };

  const saveInfo = async () => {
    setProfile(p => ({ ...p, ...infoData }));
    setEditingInfo(false);
    await updateProfileOnBackend({
      hourly_rate: infoData.hourly_rate,
      availability_status: infoData.availability_status
    });
  };

  const selectAvatar = async (src) => {
    setProfile(p => ({ ...p, avatar: src }));
    setShowAvatarPicker(false);
    await updateProfileOnBackend({ avatar: src });
  };

  const addSkill = async () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !profile.skills.includes(trimmedSkill)) {
      const updatedSkills = [...profile.skills, trimmedSkill];
      setProfile(p => ({ ...p, skills: updatedSkills }));
      await updateProfileOnBackend({ skills: updatedSkills });
    }
    setNewSkill('');
  };

  const removeSkill = async (s) => {
    const updatedSkills = profile.skills.filter(x => x !== s);
    setProfile(p => ({ ...p, skills: updatedSkills }));
    await updateProfileOnBackend({ skills: updatedSkills });
  };

  const addEdu = async () => {
    if (!newEdu.institution || !newEdu.degree) return;
    const updatedEdu = [...profile.education, { ...newEdu }];
    setProfile(p => ({ ...p, education: updatedEdu }));
    setNewEdu({ institution: '', degree: '', start_year: 2024, end_year: 2028 });
    setEditingEdu(false);
    await updateProfileOnBackend({ education: updatedEdu });
  };

  const removeEdu = async (idx) => {
    const updatedEdu = profile.education.filter((_, i) => i !== idx);
    setProfile(p => ({ ...p, education: updatedEdu }));
    await updateProfileOnBackend({ education: updatedEdu });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={36} color="#60a5fa" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading portfolio details...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      <h2 style={{
        fontSize: '2.2rem', fontWeight: 900, marginBottom: '2rem',
        background: 'linear-gradient(90deg,#fff,#60a5fa)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
      }}>My TalentStage Profile</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Sidebar Panel */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(59,130,246,0.12)' }}>
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 1.5rem', cursor: 'pointer' }}
            onClick={() => setShowAvatarPicker(true)}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%', padding: 3,
              background: 'linear-gradient(135deg,#3b82f6,#818cf8)',
              boxShadow: '0 0 30px rgba(59,130,246,0.25)'
            }}>
              <img src={profile.avatar} alt="Avatar"
                onError={e => { e.target.src = '/avatar_m1.png'; }}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: 2, right: 2, width: 30, height: 30, borderRadius: '50%',
              background: '#3b82f6', border: '2px solid #030711',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(59,130,246,0.5)'
            }}>
              <Pencil size={12} color="white" />
            </div>
          </div>

          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 800 }}>{user?.full_name || 'User'}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem', fontSize: '0.85rem' }}>{user?.email}</p>

          {!editingInfo ? (
            <>
              <div style={{ textAlign: 'left', marginBottom: '1.25rem', fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <p style={{ margin: '0 0 0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Hourly Rate</span>
                  <span style={{ fontWeight: 700, color: '#60a5fa' }}>${profile.hourly_rate}/hr</span>
                </p>
                <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <span style={{ fontWeight: 700, color: '#34d399' }}>● {profile.availability_status}</span>
                </p>
              </div>
              <button className="btn-outline" onClick={() => setEditingInfo(true)}
                style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem' }}>
                <Pencil size={12} /> Edit Information
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Hourly Rate ($)</label>
                <input type="number" className="form-input" value={infoData.hourly_rate}
                  onChange={e => setInfoData(p => ({ ...p, hourly_rate: Number(e.target.value) }))} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Availability</label>
                <div className="custom-select-wrapper">
                  <select className="custom-select" value={infoData.availability_status}
                    onChange={e => setInfoData(p => ({ ...p, availability_status: e.target.value }))}>
                    <option>Available</option>
                    <option>Busy</option>
                    <option>Open to Offers</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-primary" onClick={saveInfo} style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem' }}><Save size={14} /> Save</button>
                <button className="btn-outline" onClick={() => setEditingInfo(false)} style={{ padding: '0.55rem 0.75rem' }}><X size={14} /></button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 2' }}>
          
          {/* Bio Panel */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>
                <User size={18} color="#60a5fa" /> Professional Bio
              </h3>
              {!editingBio ? (
                <button className="btn-outline" onClick={() => { setBioText(profile.bio); setEditingBio(true); }}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}><Pencil size={12} /> Edit</button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" onClick={saveBio} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}><Check size={12} /> Save</button>
                  <button className="btn-outline" onClick={() => setEditingBio(false)} style={{ padding: '0.4rem 0.6rem' }}><X size={12} /></button>
                </div>
              )}
            </div>
            {editingBio ? (
              <textarea className="form-input" rows={4} value={bioText}
                onChange={e => setBioText(e.target.value)} style={{ resize: 'vertical' }} />
            ) : (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0, fontSize: '0.95rem' }}>{profile.bio}</p>
            )}
          </div>

          {/* Badges Panel */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(59,130,246,0.1)' }}>
            <h3 style={{ margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>
              <Star size={18} color="#fbbf24" /> Verified AI Skill Badges
            </h3>
            {profile.badges.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {profile.badges.map((b, i) => (
                  <div key={i} className="badge-neon" style={{ animation: 'badgeGlow 2.5s ease-in-out infinite alternate', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>⚡ {b}</div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>No verified badges. Take an AI Skill Test to verify your expertise and earn neon profile badges.</p>
            )}
          </div>

          {/* Dynamic Skills Panel (Autocomplete) */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(59,130,246,0.1)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: 800 }}>Technical Skills</h3>
            
            {profile.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {profile.skills.map((s, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.35rem 0.85rem', borderRadius: 20,
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)',
                    color: '#60a5fa', fontSize: '0.82rem', fontWeight: 700
                  }}>
                    {s}
                    <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={11} /></button>
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Add skills to display your technical expertise on explore grids.</p>
            )}

            {/* Input with datalist autocomplete */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Type a skill (e.g. Python, React) or select popular ones..."
                value={newSkill} 
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                list="popular-skills"
                style={{ flex: 1 }}
              />
              <datalist id="popular-skills">
                {CSE_SKILLS.filter(s => !profile.skills.includes(s)).map(s => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <button className="btn-primary" onClick={addSkill} disabled={!newSkill.trim()} style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <Plus size={16} /> Add Skill
              </button>
            </div>
          </div>

          {/* Education Panel */}
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>
                <BookOpen size={18} color="#818cf8" /> Education History
              </h3>
              <button className="btn-outline" onClick={() => setEditingEdu(p => !p)}
                style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}><Plus size={12} /> Add new</button>
            </div>
            
            {profile.education.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profile.education.map((e, i) => (
                  <div key={i} style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.2rem', color: 'white', fontSize: '0.95rem' }}>{e.institution}</h4>
                      <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.2rem', fontSize: '0.85rem' }}>{e.degree}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: 0 }}>{e.start_year} – {e.end_year}</p>
                    </div>
                    <button onClick={() => removeEdu(i)}
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>No education records added yet.</p>
            )}

            {editingEdu && (
              <div style={{ padding: '1.25rem', background: 'rgba(59,130,246,0.03)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.12)', marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Institution</label>
                    <input className="form-input" placeholder="e.g. NIT Warangal" value={newEdu.institution} onChange={e => setNewEdu(p => ({ ...p, institution: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Degree</label>
                    <input className="form-input" placeholder="e.g. B.Tech CSE" value={newEdu.degree} onChange={e => setNewEdu(p => ({ ...p, degree: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>Start Year</label>
                    <input type="number" className="form-input" value={newEdu.start_year} onChange={e => setNewEdu(p => ({ ...p, start_year: Number(e.target.value) }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700 }}>End Year</label>
                    <input type="number" className="form-input" value={newEdu.end_year} onChange={e => setNewEdu(p => ({ ...p, end_year: Number(e.target.value) }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-primary" onClick={addEdu} style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem' }}><Save size={14} /> Add Record</button>
                  <button className="btn-outline" onClick={() => setEditingEdu(false)} style={{ padding: '0.55rem 0.75rem' }}><X size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="modal-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div className="glass-panel" onClick={e => e.stopPropagation()} style={{
            padding: '2.5rem', width: '90%', maxWidth: 600,
            border: '1px solid rgba(59,130,246,0.25)',
            boxShadow: '0 0 60px rgba(59,130,246,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: '#60a5fa', fontWeight: 800 }}>Choose Profile Avatar</h3>
              <button onClick={() => setShowAvatarPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}><X size={20} /></button>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.25rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Male Avatars</p>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {MALE_AVATARS.map((src, i) => (
                <div key={i} onClick={() => selectAvatar(src)}
                  style={{
                    width: 75, height: 75, borderRadius: '50%', cursor: 'pointer',
                    padding: 3,
                    background: profile.avatar === src ? 'linear-gradient(135deg,#3b82f6,#818cf8)' : 'rgba(255,255,255,0.06)',
                    boxShadow: profile.avatar === src ? '0 0 20px rgba(59,130,246,0.4)' : 'none',
                    transition: 'all 0.2s',
                    transform: profile.avatar === src ? 'scale(1.08)' : 'scale(1)'
                  }}>
                  <img src={src} alt={`Male ${i+1}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.25rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Female Avatars</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {FEMALE_AVATARS.map((src, i) => (
                <div key={i} onClick={() => selectAvatar(src)}
                  style={{
                    width: 75, height: 75, borderRadius: '50%', cursor: 'pointer',
                    padding: 3,
                    background: profile.avatar === src ? 'linear-gradient(135deg,#818cf8,#ff2a85)' : 'rgba(255,255,255,0.06)',
                    boxShadow: profile.avatar === src ? '0 0 20px rgba(129,92,248,0.4)' : 'none',
                    transition: 'all 0.2s',
                    transform: profile.avatar === src ? 'scale(1.08)' : 'scale(1)'
                  }}>
                  <img src={src} alt={`Female ${i+1}`} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes badgeGlow {
          0% { box-shadow: 0 0 10px rgba(59,130,246,0.3); }
          100% { box-shadow: 0 0 20px rgba(59,130,246,0.5), 0 0 45px rgba(129,92,248,0.25); }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
