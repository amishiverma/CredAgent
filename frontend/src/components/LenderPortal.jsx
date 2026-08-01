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
              <h4 className="subpanel-title"><ArrowDownRight className="w-4 h-4 text-emerald" /> Deposit Capital to Pool</h4>
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
              <h4 className="subpanel-title"><ArrowUpRight className="w-4 h-4 text-amber" /> Withdraw Liquidity</h4>
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

          <div className="whitelist-table-container">
            <table className="whitelist-table">
              <thead>
                <tr>
                  <th>Vendor Domain</th>
                  <th>Category</th>
                  <th>Trust Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.whitelistedVendors.map((vendor, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-cyan">{vendor.domain}</td>
                    <td>{vendor.category}</td>
                    <td>
                      <span className={`trust-pill ${vendor.trustScore > 90 ? 'trust-high' : 'trust-med'}`}>
                        {vendor.trustScore}/100
                      </span>
                    </td>
                    <td><span className="badge badge-prime">Whitelisted</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleAddVendor} className="add-vendor-form">
            <h4 className="subpanel-title">Add New Whitelisted API Endpoint</h4>
            <div className="grid-3col">
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
              <button type="submit" className="btn-primary">
                <Plus className="w-4 h-4" /> Add Endpoint
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Protocol Loan Book */}
      <div className="panel card-glass margin-top-lg">
        <h3 className="panel-title"><TrendingUp className="panel-icon" /> Active Protocol Loan Book (Backed by Your Capital)</h3>
        
        <div className="loan-book-grid">
          {state.activeLoans.map((loan) => (
            <div key={loan.id} className="loan-book-card">
              <div className="lb-header">
                <span className="lb-agent-name">{loan.agentName}</span>
                <span className={`badge ${loan.status === 'ACTIVE' ? 'badge-info' : 'badge-prime'}`}>
                  {loan.status}
                </span>
              </div>
              <div className="lb-body font-mono">
                <div>Loan Capital: <strong>${loan.loanAmount} USDC</strong></div>
                <div>Interest APY: <strong className="text-emerald">{loan.interestRate}%</strong></div>
                <div>Whitelisted Vendor: <span className="text-cyan">{loan.vendor}</span></div>
                <div>Expected Payoff: ${loan.expectedPayoff} USDC</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
