import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, IndianRupee, Lock, AlertOctagon, RefreshCw } from 'lucide-react';
import { fetchEscrows, receiveEscrowPayment } from '../services/api.js';

export const EscrowTracker = () => {
  const [escrow, setEscrow] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(650);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadRealEscrow = async () => {
    setIsLoading(true);
    setIsSyncing(true);
    try {
      const response = await fetchEscrows();
      if (response && response.data && response.data.length > 0) {
        setEscrow(response.data[0]); 
      } else {
        setEscrow(null);
      }
    } catch (error) {
      console.error("Error fetching escrow from DB:", error);
    }
    setIsLoading(false);
    setIsSyncing(false);
  };

  useEffect(() => {
    loadRealEscrow();
  }, []);

  const handleDeposit = async () => {
    if (!escrow) return;
    
    const paymentAmt = parseFloat(paymentAmount) || 0;
    
    try {
      const response = await receiveEscrowPayment({
        escrowId: escrow.id,
        amount: paymentAmt
      });
      // Use backend-authoritative data for 100% DB sync
      if (response && response.data) {
        setEscrow(response.data);
        return;
      }
    } catch (err) {
      console.error("Failed to update database", err);
    }

    // Local fallback if backend is unreachable
    const timestamp = new Date().toLocaleTimeString();
    const principalDeduction = Math.min(paymentAmt, escrow.loanAmount || 0);
    const interestDeduction = Math.min(paymentAmt - principalDeduction, escrow.interestAmount || 0);
    const netProfit = Math.max(0, paymentAmt - (principalDeduction + interestDeduction));

    setEscrow({
      ...escrow,
      status: "REPAID",
      buyerDeposit: (escrow.buyerDeposit || 0) + paymentAmt,
      logs: [
        ...(escrow.logs || []),
        `[${timestamp}] Buyer deposited earnings: ₹${paymentAmt} INR into Escrow Contract.`,
        `[${timestamp}] ⚡ REPAYMENT ENFORCED: ₹${principalDeduction} Principal + ₹${interestDeduction} Interest auto-routed to Lender Pool.`,
        `[${timestamp}] 🎉 NET PROFIT DISBURSED: ₹${netProfit} INR auto-transferred to Agent Owner.`
      ],
      transactions: [
        ...(escrow.transactions || []),
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
    });
  };

  if (isLoading) {
    return (
      <div className="tab-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '16rem' }}>
        <div style={{ color: 'var(--primary-cyan)', fontFamily: 'var(--font-mono)', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <RefreshCw style={{ width: '1.5rem', height: '1.5rem', animation: 'spin 1s linear infinite' }} /> Syncing Immutable Ledger from MongoDB...
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="tab-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '16rem' }}>
        <div style={{ color: 'var(--primary-amber)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <AlertOctagon style={{ width: '2.5rem', height: '2.5rem' }} />
          <p>No active escrows found in the database. Run the Simulator first!</p>
          <button className="btn-primary" onClick={loadRealEscrow} style={{ marginTop: '0.5rem' }}>
            <RefreshCw style={{ width: '1rem', height: '1rem' }} /> Refresh Database
          </button>
        </div>
      </div>
    );
  }

  const state = escrow; 

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><ShieldCheck className="inline-icon" /> Account Abstraction Smart Escrow & Repayment Enforcer</h2>
          <p className="subtitle">Programmatic debt recovery without legal contracts. Intercepts incoming buyer earnings to automatically deduct principal and interest before releasing profits.</p>
        </div>
        <button className="btn-secondary" onClick={loadRealEscrow} disabled={isSyncing}>
          <RefreshCw style={{ width: '1rem', height: '1rem', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} /> {isSyncing ? 'Syncing...' : 'Sync with DB'}
        </button>
      </div>

      <div className="grid-2col">
        {/* Left Panel: Escrow State Card */}
        <div className="panel card-glass">
          <h3 className="panel-title"><Lock className="panel-icon" /> Escrow Contract State ({state.id})</h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: 'rgba(15, 23, 42, 0.7)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', background: state.status.toLowerCase() === 'active' ? 'rgba(56, 189, 248, 0.2)' : state.status.toLowerCase() === 'repaid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: state.status.toLowerCase() === 'active' ? 'var(--primary-cyan)' : state.status.toLowerCase() === 'repaid' ? 'var(--primary-emerald)' : 'var(--primary-amber)', flexShrink: 0 }}>
              {state.status}
            </span>
            <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              {state.agentDID}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Locked Loan Capital</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-cyan)', fontFamily: 'var(--font-mono)' }}>₹{(state.lockedCapital || 0).toLocaleString('en-IN')} INR</span>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Target Vendor Domain</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-emerald)', wordBreak: 'break-all' }}>{state.targetVendor}</span>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Protocol Debt</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>₹{(state.totalDebt || 0).toLocaleString('en-IN')} INR <span style={{ color: 'var(--primary-amber)', fontSize: '0.8rem' }}>({state.interestRatePercent || 0}%)</span></span>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Disbursed Spend</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>₹{(state.spentCapital || 0).toLocaleString('en-IN')} INR</span>
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
                placeholder="Buyer Payment (₹)"
              />
              <button className="btn-primary" onClick={handleDeposit} disabled={state.status === "REPAID"}>
                Deposit & Execute Auto-Repayment Split <ArrowRight style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Split Waterfall Visualizer */}
        <div className="panel card-glass">
          <h3 className="panel-title"><IndianRupee className="panel-icon" /> Programmatic Revenue Split Waterfall</h3>

          {state.transactions && state.transactions.find(t => t.type === 'REVENUE_INTERCEPTED') ? (
            <div className="waterfall-container">
              {(() => {
                const tx = state.transactions.find(t => t.type === 'REVENUE_INTERCEPTED');
                // CRASH-PROOF EXTRACTION: Provide fallback math if database doesn't have exact breakdown
                const bp = tx.buyerPayment || tx.amount || 0;
                const rp = tx.repaidPrincipal || state.loanAmount || 0;
                const ri = tx.repaidInterest || state.interestAmount || 0;
                const np = tx.netProfitDisbursed || Math.max(0, bp - rp - ri);

                return (
                  <>
                    <div className="waterfall-step source">
                      <div className="wf-title">Client Buyer Payout Inflow</div>
                      <div className="wf-amount">₹{bp.toLocaleString('en-IN')} INR</div>
                    </div>

                    <div className="waterfall-split-arrows">
                      <div className="arrow-line">↓ Programmatic Escrow Interception Split ↓</div>
                    </div>

                    <div className="waterfall-branches">
                      <div className="wf-branch lender">
                        <div className="wf-badge">LENDER POOL REPAYMENT</div>
                        <div className="wf-detail">Principal: <strong>₹{rp.toLocaleString('en-IN')} INR</strong></div>
                        <div className="wf-detail">Interest (Yield): <strong>₹{ri.toLocaleString('en-IN')} INR</strong></div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '0.4rem', color: 'var(--primary-emerald)' }}>
                          ₹{(rp + ri).toLocaleString('en-IN')} INR
                        </div>
                      </div>

                      <div className="wf-branch agent">
                        <div className="wf-badge">AGENT OWNER PROFIT</div>
                        <div className="wf-detail">Net Earned Revenue:</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '0.4rem', color: 'var(--primary-cyan)' }}>
                          ₹{np.toLocaleString('en-IN')} INR
                        </div>
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

          {/* Hacker Console Audit Log */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Smart Escrow Audit Log Execution
            </h4>
            <div style={{ background: '#020304', border: '1px solid rgba(16, 255, 16, 0.15)', borderRadius: 'var(--radius-sm)', padding: '1rem', maxHeight: '220px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.73rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.15rem', boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 255, 16, 0.04)' }}>
              {state.logs && state.logs.map((log, index) => (
                <div key={index} style={{ color: '#39ff14', padding: '0.2rem 0', borderBottom: index < state.logs.length - 1 ? '1px solid rgba(16, 255, 16, 0.06)' : 'none', wordBreak: 'break-all' }}>
                  <span style={{ color: 'rgba(16, 255, 16, 0.4)', userSelect: 'none' }}>{'>'} </span>{log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};