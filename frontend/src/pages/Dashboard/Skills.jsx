import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, ChevronLeft, Trophy, BookOpen, Clock, CheckCircle, XCircle, RotateCcw, Zap } from 'lucide-react';

const SKILLS = [
  { value: 'Python', label: 'Python Programming' },
  { value: 'Java', label: 'Java & Spring Boot' },
  { value: 'C++', label: 'C++ & Data Structures' },
  { value: 'JavaScript', label: 'JavaScript Core' },
  { value: 'React', label: 'React & Modern UI' },
  { value: 'Node.js', label: 'Node.js Backend' },
  { value: 'SQL', label: 'SQL & Database Design' },
  { value: 'MongoDB', label: 'MongoDB / NoSQL' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Docker', label: 'Docker & Containers' },
  { value: 'Kubernetes', label: 'Kubernetes' },
  { value: 'AWS', label: 'Amazon Web Services' },
  { value: 'Cyber Security', label: 'Cyber Security' },
  { value: 'Algorithms', label: 'Algorithms & Complexity' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'System Design', label: 'System Design & Architecture' },
  { value: 'Linux Administration', label: 'Linux Administration' },
  { value: 'Git & Version Control', label: 'Git & Version Control' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Go', label: 'Go (Golang)' },
];

const renderQuestionText = (text) => {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('```')) {
      const lines = part.replace(/```[a-zA-Z]*\n?|```$/g, '').trim();
      return (
        <pre key={idx} style={{
          background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px', padding: '1.25rem', fontFamily: 'monospace',
          fontSize: '0.9rem', color: '#60a5fa', overflowX: 'auto',
          whiteSpace: 'pre-wrap', marginTop: '1rem', marginBottom: '1rem', lineHeight: 1.5
        }}>
          <code>{lines}</code>
        </pre>
      );
    }
    return <span key={idx} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
  });
};

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000';
  }
  return 'https://talentstage-backend.onrender.com';
};

const API_BASE_URL = getBaseURL();

const Skills = () => {
  const [skillInput, setSkillInput] = useState('Python');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testData, setTestData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setError('');
            return 0;
          }
          setError(`You can try this test again in ${prev - 1} seconds.`);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Get token from localStorage (NOT from user.token — that doesn't exist)
  const getToken = () => localStorage.getItem('token');

  const handleGenerateTest = async (e) => {
    e.preventDefault();
    if (countdown > 0) {
      navigate('/freelancer/portfolio');
      return;
    }
    setIsGenerating(true);
    setError('');
    try {
      const token = getToken();
      if (!token) { setError('You must be logged in to take a test.'); return; }

      const response = await fetch(`${API_BASE_URL}/api/skills/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ skill: skillInput })
      });
      const data = await response.json();
      if (response.ok) {
        setTestData(data);
        setCurrentQIndex(0);
        setAnswers({});
        setTestResult(null);
      } else {
        const errorMsg = data.detail || 'Failed to generate test.';
        const match = errorMsg.match(/in (\d+) seconds/i);
        if (match) {
          setCountdown(parseInt(match[1], 10));
          setError(`You can try this test again in ${match[1]} seconds.`);
          navigate('/freelancer/portfolio');
        } else {
          setError(errorMsg);
        }
      }
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (opt) => {
    setAnswers(prev => ({ ...prev, [currentQIndex]: { question_index: currentQIndex, selected_answer: opt } }));
  };

  const handleSubmitTest = async () => {
    setIsGenerating(true);
    try {
      const token = getToken();
      const correct_answers = testData.questions.map(q => q.correct_answer);
      const answersArr = Object.values(answers);

      const response = await fetch(`${API_BASE_URL}/api/skills/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ skill: skillInput, answers: answersArr, correct_answers })
      });
      const data = await response.json();
      if (response.ok) { 
        setTestResult(data); 
        setTestData(null); 
        if (!data.passed) {
          setCountdown(60);
          setError("You can try this test again in 60 seconds.");
        }
      }
      else setError(data.detail || 'Submission failed.');
    } catch {
      setError('Failed to submit test.');
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = testData ? Math.round(((currentQIndex + 1) / testData.questions.length) * 100) : 0;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(59,130,246,0.1)', padding: '0.4rem 1rem',
          borderRadius: '50px', border: '1px solid rgba(59,130,246,0.3)',
          color: '#60a5fa', fontSize: '0.82rem', fontWeight: 700,
          letterSpacing: '1px', marginBottom: '1rem', textTransform: 'uppercase'
        }}>
          <Zap size={13} /> AI-Powered
        </div>
        <h2 style={{
          fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem',
          background: 'linear-gradient(135deg, #fff 0%, #60a5fa 60%, #818cf8 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>AI Skill Verification</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600 }}>
          Take dynamic, AI-generated 10-question tests. Score 80%+ to earn a verified neon badge on your profile.
        </p>
      </div>

      {error && (
        <div className="error-box" style={{ marginBottom: '2rem' }}>
          <XCircle size={16} />
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* ── SKILL PICKER ── */}
      {!testData && !testResult && (
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '3rem 2.5rem', textAlign: 'center', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 0 60px rgba(59,130,246,0.06)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <Brain size={48} color="#60a5fa" style={{ filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.6))' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Verify a New Skill</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Select a skill — The simulator will prepare 10 unique medium-difficulty questions for your assessment.</p>

            <form onSubmit={handleGenerateTest}>
              <div className="custom-select-wrapper" style={{ marginBottom: '1.5rem' }}>
                <select
                  className="custom-select"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  disabled={isGenerating}
                >
                  {SKILLS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem 2rem', fontSize: '1rem' }} disabled={isGenerating}>
                {isGenerating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Your test is being simulated... (~10s)
                  </span>
                ) : <><Brain size={18} /> Start Assessment</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {testData && (
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {/* Progress bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Brain size={14} /> Testing: <strong style={{ color: '#60a5fa' }}>{skillInput}</strong>
              </span>
              <span>Q {currentQIndex + 1} / {testData.questions.length}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #818cf8)', borderRadius: 3, transition: 'width 0.4s ease', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }} />
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid rgba(59,130,246,0.15)' }}>
            <div style={{ fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2rem', color: 'white', fontWeight: 600 }}>
              {renderQuestionText(testData.questions[currentQIndex].question_text)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
              {['A', 'B', 'C', 'D'].map(opt => {
                const text = testData.questions[currentQIndex][`option_${opt.toLowerCase()}`];
                const sel = answers[currentQIndex]?.selected_answer === opt;
                return (
                  <button key={opt} onClick={() => handleSelectAnswer(opt)} style={{
                    padding: '1rem 1.25rem', textAlign: 'left',
                    background: sel ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sel ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12, color: 'white', cursor: 'pointer',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    boxShadow: sel ? '0 0 15px rgba(59,130,246,0.2)' : 'none'
                  }}>
                    <span style={{
                      minWidth: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: sel ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                      fontSize: '0.78rem', fontWeight: 800, flexShrink: 0, marginTop: 1
                    }}>{opt}</span>
                    <span style={{ lineHeight: 1.5, fontSize: '0.95rem' }}>{text}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-outline" onClick={() => setCurrentQIndex(p => Math.max(0, p - 1))} disabled={currentQIndex === 0}
                style={{ padding: '0.6rem 1.5rem' }}>
                <ChevronLeft size={16} /> Prev
              </button>
              {currentQIndex < testData.questions.length - 1 ? (
                <button className="btn-primary" onClick={() => setCurrentQIndex(p => p + 1)} disabled={!answers[currentQIndex]}
                  style={{ padding: '0.6rem 1.5rem' }}>
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn-primary" onClick={handleSubmitTest}
                  disabled={!answers[currentQIndex] || isGenerating}
                  style={{ padding: '0.6rem 1.75rem', background: 'linear-gradient(135deg,#059669,#10b981)' }}>
                  {isGenerating ? 'Grading...' : <><CheckCircle size={16} /> Submit Test</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {testResult && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="glass-panel animate-fade-in" style={{
            padding: '3rem 2.5rem', textAlign: 'center',
            border: `1px solid ${testResult.passed ? 'rgba(59,130,246,0.4)' : 'rgba(239,68,68,0.3)'}`,
            boxShadow: testResult.passed ? '0 0 60px rgba(59,130,246,0.15)' : '0 0 40px rgba(239,68,68,0.08)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
              {testResult.passed ? '🏆' : '📚'}
            </div>
            <h2 style={{
              fontSize: '2rem', fontWeight: 900, marginBottom: '1rem',
              background: testResult.passed
                ? 'linear-gradient(90deg,#60a5fa,#818cf8)' : 'linear-gradient(90deg,#f87171,#fb923c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              {testResult.passed ? '🎉 Assessment Passed!' : 'Keep Practicing!'}
            </h2>

            <div style={{
              margin: '2rem 0', padding: '1.75rem',
              background: 'rgba(0,0,0,0.3)', borderRadius: 16,
              border: `1px solid ${testResult.passed ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.15)'}`
            }}>
              <p style={{ fontSize: '4rem', fontWeight: 900, margin: '0 0 0.5rem', color: testResult.passed ? '#60a5fa' : '#f87171', lineHeight: 1 }}>
                {testResult.score}%
              </p>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {testResult.correct_count} / {testResult.total} correct
              </p>
            </div>

            {testResult.passed && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: 12,
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.4)',
                color: '#60a5fa', fontWeight: 700, marginBottom: '1.5rem',
                boxShadow: '0 0 20px rgba(59,130,246,0.2)',
                fontSize: '1rem'
              }}>
                <Trophy size={20} /> Badge Earned: {skillInput} Verified ⚡
              </div>
            )}

            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              {testResult.passed
                ? `Your "${skillInput} Verified" badge has been added to your profile!`
                : `Score 80%+ to earn the "${skillInput} Verified" badge. You can retake after 1 minute.`}
            </p>

            <button className="btn-primary" onClick={() => { setTestResult(null); setSkillInput('Python'); }}>
              <RotateCcw size={16} /> Take Another Test
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Skills;
