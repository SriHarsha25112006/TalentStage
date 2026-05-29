import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, ChevronDown, ChevronUp, Square, CheckSquare, Send, Sparkles, ShieldCheck } from 'lucide-react';

const DEFAULT_CONTRACTS = [
  { 
    id: 1, 
    title: 'Build React Dashboard', 
    client: 'TechCorp Inc', 
    amount: 2400, 
    status: 'Active', 
    deadline: '2026-06-15', 
    progress: 65, 
    tasks: [
      { text: 'Set up Vite + React + React Router', completed: true },
      { text: 'Implement Core Design System & Theme CSS', completed: true },
      { text: 'Design & Code Glassmorphic Dashboard Navbar', completed: true },
      { text: 'Integrate ChartJS for Premium Visualizations', completed: false },
      { text: 'E2E Testing of signup/login flow', completed: false },
      { text: 'Production build & Vercel deployment', completed: false }
    ] 
  },
  { 
    id: 2, 
    title: 'API Integration', 
    client: 'FinStart Ltd', 
    amount: 900, 
    status: 'Under Review', 
    deadline: '2026-06-01', 
    progress: 90, 
    tasks: [
      { text: 'Integrate Stripe API & Payment gateways', completed: true },
      { text: 'Setup JWT authentication & secure cookies', completed: true },
      { text: 'Create dynamic skill badge backend API', completed: true },
      { text: 'Solve self-hiring API validation edge-cases', completed: true },
      { text: 'Verify cross-role permission controls', completed: false }
    ] 
  }
];

const DEFAULT_TRANSACTIONS = [
  { project: 'Build React Dashboard (Milestone 1)', client: 'TechCorp Inc', amount: 1200, date: '2026-05-20', status: 'Paid' },
  { project: 'API Integration', client: 'FinStart Ltd', amount: 450, date: '2026-05-18', status: 'Pending' },
  { project: 'Landing Page Redesign', client: 'StartupXYZ', amount: 800, date: '2026-05-10', status: 'Paid' }
];

const statusColors = { Active: '#60a5fa', 'Under Review': '#fbbf24', Completed: '#10b981' };

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitContractId, setSubmitContractId] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('talent_stage_contracts');
    if (stored) {
      setContracts(JSON.parse(stored));
    } else {
      localStorage.setItem('talent_stage_contracts', JSON.stringify(DEFAULT_CONTRACTS));
      setContracts(DEFAULT_CONTRACTS);
    }
  }, []);

  const saveContracts = (updated) => {
    setContracts(updated);
    localStorage.setItem('talent_stage_contracts', JSON.stringify(updated));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleTask = (contractId, taskIndex) => {
    const updated = contracts.map(c => {
      if (c.id === contractId) {
        const newTasks = [...c.tasks];
        newTasks[taskIndex] = { ...newTasks[taskIndex], completed: !newTasks[taskIndex].completed };
        const completedCount = newTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / newTasks.length) * 100);
        return { ...c, tasks: newTasks, progress };
      }
      return c;
    });
    saveContracts(updated);
  };

  const openSubmitModal = (id) => {
    setSubmitContractId(id);
    setShowSubmitModal(true);
  };

  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    const updated = contracts.map(c => {
      if (c.id === submitContractId) {
        return { ...c, status: 'Under Review' };
      }
      return c;
    });

    saveContracts(updated);
    setShowSubmitModal(false);
    setRepoUrl('');
    setSubmitNotes('');

    // Update pending transactions in localStorage
    const storedTx = localStorage.getItem('talent_stage_transactions');
    const txs = storedTx ? JSON.parse(storedTx) : DEFAULT_TRANSACTIONS;
    const targetContract = contracts.find(c => c.id === submitContractId);
    
    // Add pending payout
    const newTx = {
      project: targetContract.title,
      client: targetContract.client,
      amount: targetContract.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    
    localStorage.setItem('talent_stage_transactions', JSON.stringify([newTx, ...txs]));
  };

  const handleClientApprove = (contractId) => {
    const updated = contracts.map(c => {
      if (c.id === contractId) {
        return { ...c, status: 'Completed', progress: 100 };
      }
      return c;
    });
    saveContracts(updated);

    // Update transaction to paid
    const storedTx = localStorage.getItem('talent_stage_transactions');
    const txs = storedTx ? JSON.parse(storedTx) : DEFAULT_TRANSACTIONS;
    const targetContract = contracts.find(c => c.id === contractId);

    const updatedTxs = txs.map(t => {
      if (t.project === targetContract.title && t.client === targetContract.client) {
        return { ...t, status: 'Paid' };
      }
      return t;
    });

    // If transaction doesn't exist, create it as Paid
    const exists = txs.some(t => t.project === targetContract.title && t.client === targetContract.client);
    if (!exists) {
      updatedTxs.unshift({
        project: targetContract.title,
        client: targetContract.client,
        amount: targetContract.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'Paid'
      });
    }

    localStorage.setItem('talent_stage_transactions', JSON.stringify(updatedTxs));
  };

  const filteredContracts = contracts.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{
            fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem',
            background: 'linear-gradient(90deg,#fff,#60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Active Contracts</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Manage milestones, complete deliverables, and request client approvals.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <input 
            type="text" 
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
              color: 'white', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s'
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
        {['All', 'Active', 'Under Review', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1.25rem', background: activeTab === tab ? 'rgba(59,130,246,0.12)' : 'none',
              border: '1px solid', borderColor: activeTab === tab ? 'rgba(59,130,246,0.3)' : 'transparent',
              borderRadius: '20px', color: activeTab === tab ? '#60a5fa' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contract list */}
      {filteredContracts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredContracts.map((c) => {
            const isExpanded = expandedId === c.id;
            return (
              <div 
                key={c.id} 
                className="glass-panel" 
                style={{ 
                  padding: '1.5rem 1.75rem', 
                  border: isExpanded ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: isExpanded ? '0 10px 30px rgba(59,130,246,0.05)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => toggleExpand(c.id)}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FileText size={18} color="#60a5fa" />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{c.title}</h3>
                      <span style={{ 
                        padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800,
                        background: `${statusColors[c.status]}15`, border: `1px solid ${statusColors[c.status]}35`,
                        color: statusColors[c.status] 
                      }}>
                        {c.status}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>
                      Client: <span style={{ color: '#e2e8f0' }}>{c.client}</span> · Due: {c.deadline}
                    </p>
                  </div>
                  
                  {/* Progress Ring / Percentage */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '150px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Progress</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{c.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, position: 'relative' }}>
                      <div style={{ 
                        height: '100%', width: `${c.progress}%`, 
                        background: 'linear-gradient(90deg,#3b82f6,#818cf8)', 
                        borderRadius: 3, transition: 'width 0.4s ease',
                        boxShadow: '0 0 10px rgba(59,130,246,0.8), 0 0 20px rgba(129,140,248,0.5)'
                      }} />
                    </div>
                  </div>

                  {/* Value */}
                  <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '100px' }}>
                    <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>${c.amount}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Value</p>
                  </div>

                  {/* Accordion Arrow */}
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div 
                    style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={e => e.stopPropagation()} // Prevent collapse when clicking inside details
                  >
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', fontWeight: 700 }}>Milestone Checklist</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {c.tasks.map((task, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => c.status === 'Active' && toggleTask(c.id, idx)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.75rem', 
                            padding: '0.75rem 1rem', background: task.completed ? 'rgba(59,130,246,0.03)' : 'rgba(255,255,255,0.01)',
                            border: '1px solid', borderColor: task.completed ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.04)',
                            borderRadius: '8px', cursor: c.status === 'Active' ? 'pointer' : 'default', transition: 'all 0.15s'
                          }}
                        >
                          {task.completed ? (
                            <CheckSquare size={18} color="#60a5fa" />
                          ) : (
                            <Square size={18} color="rgba(255,255,255,0.3)" />
                          )}
                          <span style={{ 
                            fontSize: '0.9rem', 
                            color: task.completed ? 'var(--text-secondary)' : '#fff',
                            textDecoration: task.completed ? 'line-through' : 'none' 
                          }}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {c.status === 'Active' && (
                        <button 
                          className="btn-primary" 
                          onClick={() => openSubmitModal(c.id)}
                          style={{ padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                          <Send size={14} /> Submit Work for Review
                        </button>
                      )}

                      {c.status === 'Under Review' && (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', justifyContent: 'space-between', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} /> Work is currently under review by {c.client}.
                          </span>
                          <button 
                            onClick={() => handleClientApprove(c.id)}
                            style={{ 
                              background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '8px', 
                              color: 'white', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}
                          >
                            <Sparkles size={12} /> Client Action: Approve & Pay
                          </button>
                        </div>
                      )}

                      {c.status === 'Completed' && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.875rem', width: '100%' }}>
                          <ShieldCheck size={18} />
                          <span>This contract has been successfully completed, and full payment of <strong>${c.amount}</strong> was sent to your Earnings wallet!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px solid rgba(59,130,246,0.1)' }}>
          <Clock size={48} color="#3b82f6" style={{ marginBottom: '1.25rem', opacity: 0.4 }} />
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>No contracts found</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Try changing your tab filter or search query.</p>
        </div>
      )}

      {/* Work Submission Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%', maxWidth: '520px', padding: '2rem',
            border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 800 }}>Submit Milestone Deliverables</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Please provide the repository link and execution details for client evaluation.
            </p>

            <form onSubmit={handleSubmitWork}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Github Repository / Project Link</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/user/project"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                    color: 'white', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Submission Notes</label>
                <textarea 
                  rows={4}
                  placeholder="Summarize the work done, verification commands, and checklist accomplishments..."
                  value={submitNotes}
                  onChange={e => setSubmitNotes(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                    color: 'white', fontSize: '0.9rem', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn-outline" 
                  onClick={() => setShowSubmitModal(false)}
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}
                >
                  Submit Review Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
