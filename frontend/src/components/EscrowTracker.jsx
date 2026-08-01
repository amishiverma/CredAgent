import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, DollarSign, Lock, AlertOctagon, RefreshCw } from 'lucide-react';
import { fetchEscrows } from '../services/api.js'; // Import your real API!

export const EscrowTracker = () => {
  const [escrow, setEscrow] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(650);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the real Escrow data from your MongoDB!
  const loadRealEscrow = async () => {
    setIsLoading(true);
    try {
      const response = await fetchEscrows();
      if (response && response.data && response.data.length > 0) {
        // Grab the most recent escrow from the database
        setEscrow(response.data[0]); 
      } else {
        setEscrow(null);
      }
    } catch (error) {
      console.error("Error fetching escrow from DB:", error);
    }
    setIsLoading(false);
  };

  // Load data when the page opens
  useEffect(() => {
    loadRealEscrow();
  }, []);

  // 2. Local Simulation for the Demo (So you can sleep!)
  const handleDeposit = () => {
    if (!escrow) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const paymentAmt = parseFloat(paymentAmount);
    
    const principalDeduction = Math.min(paymentAmt, escrow.loanAmount);
    const interestDeduction = Math.min(paymentAmt - principalDeduction, escrow.interestAmount);
    const netProfit = Math.max(0, paymentAmt - (principalDeduction + interestDeduction));

    // Update the UI to show the waterfall animation without needing a new DB route
    const updatedEscrow = {
      ...escrow,
      status: "REPAID",
      buyerDeposit: (escrow.buyerDeposit || 0) + paymentAmt,
      logs: [
        ...escrow.logs,
        `[${timestamp}] Buyer deposited earnings: $${paymentAmt} USDC into Escrow Contract.`,
        `[${timestamp}] ⚡ REPAYMENT ENFORCED: $${principalDeduction} Principal + $${interestDeduction} Interest auto-routed to Lender Pool.`,
        `[${timestamp}] 🎉 NET PROFIT DISBURSED: $${netProfit} USDC auto-transferred to Agent Owner.`
      ],
      transactions: [
        ...escrow.transactions,
        {
          type: "REVENUE_INTERCEPTED",
          buyerPayment: paymentAmt,
          repaidPrincipal: principalDeduction,
          repaidInterest: interestDeduction,
          netProfitDisbursed: netProfit,
          txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
          timestamp: timestamp
        }
      ]
    };

    setEscrow(updatedEscrow);
  };

  if (isLoading) {
    return (
      <div className="tab-content flex justify-center items-center h-64">
        <div className="text-cyan animate-pulse font-mono text-lg flex items-center gap-3">
          <RefreshCw className="w-6 h-6 spin" /> Syncing Immutable Ledger from MongoDB...
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="tab-content flex justify-center items-center h-64">
        <div className="text-amber flex flex-col items-center gap-4">
          <AlertOctagon className="w-10 h-10" />
          <p>No active escrows found in the database. Run the Simulator first!</p>
          <button className="btn-primary mt-2" onClick={loadRealEscrow}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Database
          </button>
        </div>
      </div>
    );
  }

  const state = escrow; // Map DB object to UI state

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><ShieldCheck className="inline-icon" /> Account Abstraction Smart Escrow & Repayment Enforcer</h2>
          <p className="subtitle">Programmatic debt recovery without legal contracts. Intercepts incoming buyer earnings to automatically deduct principal and interest before releasing profits.</p>
        </div>
        <button className="btn-secondary" onClick={loadRealEscrow}>
          <RefreshCw className="w-4 h-4" /> Sync with DB
        </button>
      </div>

      <div className="grid-2col">
        {/* Left Panel: Escrow State Card */}
        <div className="panel card-glass">
          <h3 className="panel-title"><Lock className="panel-icon" /> Escrow Contract State ({state.id})</h3>

          <div className="status-banner-large">
            <span className={`status-pill-badge ${state.status.toLowerCase()}`}>{state.status}</span>
            <span className="did-tag font-mono">{state.agentDID}</span>
          </div>

          <div className="escrow-stats-grid">
            <div className="escrow-stat-card">
              <span className="es-label">Locked Loan Capital</span>
              <span className="es-value cyan-text">${state.lockedCapital} USDC</span>
            </div>

            <div className="escrow-stat-card">
              <span className="es-label">Target Vendor Domain</span>
              <span className="es-value emerald-text">{state.targetVendor}</span>
            </div>

            <div className="escrow-stat-card">
              <span className="es-label">Protocol Debt (Principal + Interest)</span>
              <span className="es-value font-mono">${state.totalDebt} USDC ({state.interestRatePercent}%)</span>
            </div>

            <div className="escrow-stat-card">
              <span className="es-label">Disbursed Spend</span>
              <span className="es-value font-mono">${state.spentCapital} USDC</span>
            </div>
          </div>

          <div className="repayment-interceptor-box">
            <h4 className="subpanel-title">Simulate Client Buyer Payment Inflow</h4>
            <p className="small-desc">When the client pays the agent for completed task output, funds enter the Account Abstraction wrapper.</p>

            <div className="payment-input-row">
              <input 
                type="number" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="input-dark font-mono"
                placeholder="Buyer Payment ($)"
              />
              <button 
                className="btn-primary" 
                onClick={handleDeposit}
                disabled={state.status === "REPAID"}
              >
                Deposit & Execute Auto-Repayment Split <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Split Waterfall Visualizer */}
        <div className="panel card-glass">
          <h3 className="panel-title"><DollarSign className="panel-icon" /> Programmatic Revenue Split Waterfall</h3>

          {state.transactions && state.transactions.find(t => t.type === 'REVENUE_INTERCEPTED') ? (
            <div className="waterfall-container">
              {(() => {
                const tx = state.transactions.find(t => t.type === 'REVENUE_INTERCEPTED');
                return (
                  <>
                    <div className="waterfall-step source">
                      <div className="wf-title">Client Buyer Payout Inflow</div>
                      <div className="wf-amount">${tx.buyerPayment} USDC</div>
                    </div>

                    <div className="waterfall-split-arrows">
                      <div className="arrow-line">↓ Programmatic Escrow Interception Split ↓</div>
                    </div>

                    <div className="waterfall-branches">
                      <div className="wf-branch lender">
                        <div className="wf-badge">LENDER POOL REPAYMENT</div>
                        <div className="wf-detail">Principal: <strong>${tx.repaidPrincipal} USDC</strong></div>
                        <div className="wf-detail">Interest (Yield): <strong>${tx.repaidInterest} USDC</strong></div>
                        <div className="wf-total text-emerald">${tx.repaidPrincipal + tx.repaidInterest} USDC</div>
                      </div>

                      <div className="wf-branch agent">
                        <div className="wf-badge">AGENT OWNER PROFIT</div>
                        <div className="wf-detail">Net Earned Revenue:</div>
                        <div className="wf-total text-cyan">${tx.netProfitDisbursed} USDC</div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="placeholder-waterfall">
              <Lock className="placeholder-icon" />
              <p>Awaiting Client Payment Deposit to trigger automatic repayment waterfall.</p>
            </div>
          )}

          <div className="audit-logs-section">
            <h4 className="subpanel-title">Smart Escrow Audit Log Execution</h4>
            <div className="log-window font-mono">
              {state.logs && state.logs.map((log, index) => (
                <div key={index} className="log-line">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};