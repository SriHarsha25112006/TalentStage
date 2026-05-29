import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ArrowDownRight, Search, ArrowUpRight, Sparkles, AlertCircle, CheckCircle2, CreditCard, Plus } from 'lucide-react';

const DEFAULT_TRANSACTIONS = [
  { id: 1, project: 'Build React Dashboard (Milestone 1)', client: 'TechCorp Inc', amount: 1200, date: '2026-05-20', status: 'Paid', type: 'Credit' },
  { id: 2, project: 'API Integration', client: 'FinStart Ltd', amount: 450, date: '2026-05-18', status: 'Pending', type: 'Credit' },
  { id: 3, project: 'Landing Page Redesign', client: 'StartupXYZ', amount: 800, date: '2026-05-10', status: 'Paid', type: 'Credit' }
];

const Payments = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Latest');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositMethod, setDepositMethod] = useState('Credit Card');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDetails, setDepositDetails] = useState('');
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('talent_stage_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      localStorage.setItem('talent_stage_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
      setTransactions(DEFAULT_TRANSACTIONS);
    }
  }, []);

  const saveTransactions = (updated) => {
    setTransactions(updated);
    localStorage.setItem('talent_stage_transactions', JSON.stringify(updated));
  };

  // Math Calculations
  // Total Spent = Sum of all 'Paid' transactions that are NOT client deposits
  const totalPaidOutlays = transactions
    .filter(t => t.status === 'Paid' && t.type !== 'Deposit' && t.project.indexOf('Withdrawal') === -1)
    .reduce((s, t) => s + t.amount, 0);

  // Escrow Committed = Sum of all 'Pending' transactions
  const escrowCommittedVal = transactions
    .filter(t => t.status === 'Pending')
    .reduce((s, t) => s + t.amount, 0);

  // Client Deposits Sum
  const totalDeposited = transactions
    .filter(t => t.type === 'Deposit')
    .reduce((s, t) => s + t.amount, 0);

  // Available Client platform balance (simulated)
  // Starts with a mock $10,000 starting budget plus deposits minus paid outlays
  const startingBudget = 10000;
  const availableBudget = startingBudget + totalDeposited - totalPaidOutlays;

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg('Please enter a valid positive deposit amount.');
      return;
    }
    
    // Add deposit transaction
    const newDepositTx = {
      id: Date.now(),
      project: `Budget Deposit (${depositMethod})`,
      client: depositDetails || 'Visa card ending in 4242',
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      type: 'Deposit'
    };

    saveTransactions([newDepositTx, ...transactions]);
    setDepositSuccess(true);
    setDepositAmount('');
    setDepositDetails('');
    setErrorMsg('');

    setTimeout(() => {
      setDepositSuccess(false);
      setShowDepositModal(false);
    }, 2000);
  };

  // Filter and Sort logic
  const filteredTxs = transactions.filter(t => {
    const matchesFilter = filterStatus === 'All' || t.status === filterStatus;
    const matchesSearch = t.project.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedTxs = [...filteredTxs].sort((a, b) => {
    if (sortBy === 'Latest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'Oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'Highest') return b.amount - a.amount;
    if (sortBy === 'Lowest') return a.amount - b.amount;
    return 0;
  });

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{
            fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem',
            background: 'linear-gradient(90deg,#fff,#818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Client Payments Portal</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Monitor contract outlays, manage escrow balances, and deposit platform budget.</p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setShowDepositModal(true)}
          style={{
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            borderColor: 'transparent',
            color: 'white',
            padding: '0.75rem 1.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 0 20px rgba(99,102,241,0.3)'
          }}
        >
          <Plus size={16} /> Deposit Funds
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {[
          { label: 'Available Budget', value: `$${availableBudget.toLocaleString()}`, icon: <CreditCard size={22} color="#818cf8" />, color: '#818cf8', glow: 'rgba(99,102,241,0.15)', desc: 'Available for new contracts' },
          { label: 'Escrow Committed', value: `$${escrowCommittedVal.toLocaleString()}`, icon: <TrendingUp size={22} color="#fbbf24" />, color: '#fbbf24', glow: 'rgba(251,191,36,0.1)', desc: 'Under review / locked' },
          { label: 'Total Paid Outlays', value: `$${totalPaidOutlays.toLocaleString()}`, icon: <ArrowDownRight size={22} color="#f87171" />, color: '#f87171', glow: 'rgba(248,113,113,0.1)', desc: 'Released to freelancers' },
        ].map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem 1.75rem', border: `1px solid ${s.color}25`, boxShadow: `0 8px 32px ${s.glow}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</span>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${s.color}15`, border: `1px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 0.25rem', fontSize: '2.1rem', fontWeight: 900, color: s.color, tracking: '-1px' }}>{s.value}</p>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>Outlays & Invoices</h3>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '0.75rem' }} />
              <input 
                type="text" 
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.5rem 1rem 0.5rem 2.2rem', background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                  color: 'white', fontSize: '0.85rem', outline: 'none', width: '180px'
                }}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                color: 'white', fontSize: '0.85rem', cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="Latest" style={{ background: '#0b1329' }}>Latest Date</option>
              <option value="Oldest" style={{ background: '#0b1329' }}>Oldest Date</option>
              <option value="Highest" style={{ background: '#0b1329' }}>Highest Amount</option>
              <option value="Lowest" style={{ background: '#0b1329' }}>Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Filter status tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {['All', 'Paid', 'Pending'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.35rem 1rem', background: filterStatus === status ? 'rgba(129,140,248,0.1)' : 'none',
                border: '1px solid', borderColor: filterStatus === status ? 'rgba(129,140,248,0.3)' : 'transparent',
                borderRadius: '16px', color: filterStatus === status ? '#818cf8' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Type', 'Project / Source', 'Recipient / Method', 'Amount', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTxs.length > 0 ? (
                sortedTxs.map((t, i) => {
                  const isDeposit = t.type === 'Deposit';
                  const isPaidOutlay = t.status === 'Paid' && t.type !== 'Deposit' && t.project.indexOf('Withdrawal') === -1;
                  return (
                    <tr key={t.id || i} style={{ borderBottom: i < sortedTxs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <td style={{ padding: '0.95rem 1rem' }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: isDeposit ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${isDeposit ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isDeposit ? (
                            <ArrowUpRight size={15} color="#34d399" />
                          ) : (
                            <ArrowDownRight size={15} color="#f87171" />
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: 600, fontSize: '0.9rem' }}>{t.project}</td>
                      <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.client}</td>
                      <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: isDeposit ? '#34d399' : '#fb923c', fontSize: '0.9rem' }}>
                        {isDeposit ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '0.95rem 1rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{t.date}</td>
                      <td style={{ padding: '0.95rem 1rem' }}>
                        <span style={{
                          padding: '0.15rem 0.6rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 800,
                          background: t.status === 'Paid' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
                          border: `1px solid ${t.status === 'Paid' ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.4)'}`,
                          color: t.status === 'Paid' ? '#34d399' : '#fbbf24'
                        }}>{t.status}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    No payment invoices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%', maxWidth: '480px', padding: '2rem',
            border: '1px solid rgba(129,140,248,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            {depositSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%', background: 'rgba(129,140,248,0.1)',
                  border: '1px solid rgba(129,140,248,0.3)', display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '1.5rem', animation: 'scaleUp 0.3s ease'
                }}>
                  <CheckCircle2 size={36} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Deposit Successful!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                  Funds have been allocated to your active budget pool.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 800 }}>Deposit Platform Funds</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Simulate funding your platform wallet using secure methods.
                </p>

                {errorMsg && (
                  <div style={{
                    display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem 1rem',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '8px', color: '#f87171', fontSize: '0.82rem', marginBottom: '1.25rem'
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleDepositSubmit}>
                  {/* Balance Display */}
                  <div style={{
                    background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.04)', marginBottom: '1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Available Budget:</span>
                    <strong style={{ fontSize: '1.2rem', color: '#818cf8' }}>${availableBudget.toLocaleString()}</strong>
                  </div>

                  {/* Method */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Funding Source</label>
                    <select
                      value={depositMethod}
                      onChange={e => setDepositMethod(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                        color: 'white', fontSize: '0.9rem', outline: 'none', cursor: 'pointer'
                      }}
                    >
                      <option value="Credit Card" style={{ background: '#0b1329' }}>Credit Card (Visa / Mastercard)</option>
                      <option value="PayPal Account" style={{ background: '#0b1329' }}>PayPal Wallet</option>
                      <option value="Crypto Deposit" style={{ background: '#0b1329' }}>Solana Payout (USDC / SOL)</option>
                    </select>
                  </div>

                  {/* Amount */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Amount ($)</label>
                    <input 
                      type="number" 
                      required
                      min={10}
                      step="any"
                      placeholder="e.g. 5000"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                        color: 'white', fontSize: '0.9rem', outline: 'none'
                      }}
                    />
                  </div>

                  {/* Account / Address Info */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {depositMethod === 'Credit Card' ? 'Card Holder Name' : 
                       depositMethod === 'PayPal Account' ? 'PayPal Email Address' : 'Solana Public Address'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={depositMethod === 'Credit Card' ? 'Sri Harsha' : 
                                   depositMethod === 'PayPal Account' ? 'you@example.com' : 'Solana address...'}
                      value={depositDetails}
                      onChange={e => setDepositDetails(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                        color: 'white', fontSize: '0.9rem', outline: 'none'
                      }}
                    />
                  </div>

                  {/* Form Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button 
                      type="button" 
                      className="btn-outline" 
                      onClick={() => setShowDepositModal(false)}
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}
                    >
                      Process Deposit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
