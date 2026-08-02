import React, { useState, useEffect } from 'react';
import { ProtocolState } from '../engine/ProtocolState';
import { DollarSign, Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, Plus, CheckCircle2, TrendingUp } from 'lucide-react';

export const LenderPortal = () => {
  const [state, setState] = useState(ProtocolState.getState());
  const [depositAmount, setDepositAmount] = useState('1000');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [newDomain, setNewDomain] = useState('');
  const [newCategory, setNewCategory] = useState('AI Inference');
  const [newScore, setNewScore] = useState(90);

  useEffect(() => {
    const unsubscribe = ProtocolState.subscribe(setState);
    return unsubscribe;
  }, []);

  const handleDeposit = (e) => {
    e.preventDefault();
    if (ProtocolState.depositCapital(depositAmount)) {
      setDepositAmount('');
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (ProtocolState.withdrawCapital(withdrawAmount)) {
      setWithdrawAmount('');
    }
  };

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (newDomain) {
      ProtocolState.addVendorWhitelist(newDomain, newCategory, parseInt(newScore, 10));
      setNewDomain('');
    }
  };

  const userSharePercent = ((state.userInvestment / Math.max(1, state.lenderPool)) * 100).toFixed(2);

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><Wallet className="inline-icon" /> Dynamic Lender & Capital Pool Portal</h2>
          <p className="subtitle">Deposit your own liquidity into the protocol capital pool, earn agent borrow APY, and manage whitelisted risk rules.</p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Investor Capital Pool & Deposit/Withdraw */}
        <div className="panel card-glass">
          <h3 className="panel-title"><DollarSign className="panel-icon" /> Your Lender Liquidity Position</h3>

          <div className="investor-hero-card border-cyan">
            <div className="hero-stat">
              <span className="hero-label">Your Active Capital Deposited</span>
              <span className="hero-val cyan-text">${state.userInvestment.toLocaleString()} USDC</span>
            </div>

            <div className="hero-stat-row">
              <div>
                <span className="sub-label">Protocol Pool Share</span>
                <span className="sub-val font-mono">{userSharePercent}%</span>
              </div>
              <div>
                <span className="sub-label">Your Total Interest Earned</span>
                <span className="sub-val emerald-text font-mono">+${state.userYieldEarned.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>

          <div className="capital-actions-grid">
            <form onSubmit={handleDeposit} className="action-box">
              <h4 className="subpanel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowDownRight style={{ width: '1rem', height: '1rem', color: 'var(--primary-emerald)' }} /> Deposit Capital to Pool
              </h4>
              <div className="input-with-btn">
                <input 
                  type="number" 
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="input-dark font-mono"
                  placeholder="Amount ($)"
                  required
                />
                <button type="submit" className="btn-primary">Deposit</button>
              </div>
            </form>

            <form onSubmit={handleWithdraw} className="action-box">
              <h4 className="subpanel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowUpRight style={{ width: '1rem', height: '1rem', color: 'var(--primary-amber)' }} /> Withdraw Liquidity
              </h4>
              <div className="input-with-btn">
                <input 
                  type="number" 
                  value={withdrawAmount} 
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="input-dark font-mono"
                  placeholder="Amount ($)"
                  required
                />
                <button type="submit" className="btn-secondary">Withdraw</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Whitelisted Vendor Domain Registry */}
        <div className="panel card-glass">
          <h3 className="panel-title"><ShieldCheck className="panel-icon" /> Whitelisted Vendor Scope Registry</h3>
          <p className="panel-desc">Agent loans are strictly constrained by Account Abstraction to spend only on these whitelisted domains.</p>

          {/* Whitelist Table */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0',
              fontSize: '0.85rem'
            }}>
              <thead>
                <tr>
                  {['Vendor Domain', 'Category', 'Trust Score', 'Status'].map((header) => (
                    <th key={header} style={{
                      padding: '0.75rem 0.85rem',
                      textAlign: 'left',
                      borderBottom: '2px solid rgba(56, 189, 248, 0.15)',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.whitelistedVendors.map((vendor, idx) => (
                  <tr key={idx} style={{
                    transition: 'background 0.15s ease'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{
                      padding: '0.75rem 0.85rem',
                      borderBottom: '1px solid var(--border-color)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--primary-cyan)',
                      fontWeight: 500,
                      fontSize: '0.82rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px'
                    }}>
                      {vendor.domain}
                    </td>
                    <td style={{
                      padding: '0.75rem 0.85rem',
                      borderBottom: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}>
                      {vendor.category}
                    </td>
                    <td style={{
                      padding: '0.75rem 0.85rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <span style={{
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        background: vendor.trustScore > 90
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)',
                        color: vendor.trustScore > 90
                          ? 'var(--primary-emerald)'
                          : 'var(--primary-amber)'
                      }}>
                        {vendor.trustScore}/100
                      </span>
                    </td>
                    <td style={{
                      padding: '0.75rem 0.85rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--primary-emerald)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        Whitelisted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Vendor Form */}
          <form onSubmit={handleAddVendor} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: '0.75rem'
            }}>
              Add New Whitelisted API Endpoint
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr auto',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <input 
                type="text" 
                placeholder="Domain e.g. api.modal.com" 
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="input-dark font-mono"
                required
              />
              <input 
                type="text" 
                placeholder="Category" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-dark"
                required
              />
              <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <Plus style={{ width: '1rem', height: '1rem' }} /> Add Endpoint
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Protocol Loan Book */}
      <div className="panel card-glass" style={{ marginTop: '1.5rem' }}>
        <h3 className="panel-title"><TrendingUp className="panel-icon" /> Active Protocol Loan Book (Backed by Your Capital)</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {state.activeLoans.map((loan) => (
            <div key={loan.id} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Card Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                marginBottom: '0.85rem',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: 0
                }}>
                  {loan.agentName}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                  background: loan.status === 'ACTIVE'
                    ? 'rgba(56, 189, 248, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)',
                  color: loan.status === 'ACTIVE'
                    ? 'var(--primary-cyan)'
                    : 'var(--primary-emerald)'
                }}>
                  {loan.status}
                </span>
              </div>

              {/* Card Body */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                color: 'var(--text-muted)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Loan Capital:</span>
                  <strong style={{ color: 'var(--text-main)' }}>${loan.loanAmount} USDC</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Interest APY:</span>
                  <strong style={{ color: 'var(--primary-emerald)' }}>{loan.interestRate}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Whitelisted Vendor:</span>
                  <span style={{
                    color: 'var(--primary-cyan)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                    textAlign: 'right'
                  }}>
                    {loan.vendor}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.3rem',
                  paddingTop: '0.45rem',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <span>Expected Payoff:</span>
                  <strong style={{ color: 'var(--primary-purple)' }}>${loan.expectedPayoff} USDC</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
