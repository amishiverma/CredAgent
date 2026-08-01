import React, { useState } from 'react';
import { SmartEscrowLedger } from '../engine/SmartEscrowLedger';
import { ShieldCheck, ArrowRight, DollarSign, Lock, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

export const EscrowTracker = () => {
  const [escrow, setEscrow] = useState(() => {
    const instance = new SmartEscrowLedger("escrow_demo_8819", "did:agent:0x89F3b219a10E812cD0294711AA190A521098bcAA", 500, 5.0, "modal.com");
    instance.executeDisbursement("modal.com", 450, "Provision 8x H100 GPU cluster for LLM job");
    return instance;
  });

  const [paymentAmount, setPaymentAmount] = useState(650);

  const refreshLedger = () => {
    const newEscrow = new SmartEscrowLedger("escrow_demo_8819", "did:agent:0x89F3b219a10E812cD0294711AA190A521098bcAA", 500, 5.0, "modal.com");
    newEscrow.executeDisbursement("modal.com", 450, "Provision 8x H100 GPU cluster for LLM job");
    setEscrow(newEscrow);
  };

  const handleDeposit = () => {
    const updated = new SmartEscrowLedger(escrow.id, escrow.agentDID, escrow.loanAmount, escrow.interestRatePercent, escrow.targetVendor);
    updated.spentCapital = escrow.spentCapital;
    updated.logs = [...escrow.logs];
    updated.transactions = [...escrow.transactions];
    updated.receiveBuyerPayment(parseFloat(paymentAmount));
    setEscrow(updated);
  };

  const state = escrow.getState();

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><ShieldCheck className="inline-icon" /> Account Abstraction Smart Escrow & Repayment Enforcer</h2>
          <p className="subtitle">Programmatic debt recovery without legal contracts. Intercepts incoming buyer earnings to automatically deduct principal and interest before releasing profits.</p>
        </div>
        <button className="btn-secondary" onClick={refreshLedger}>
          <RefreshCw className="w-4 h-4" /> Reset Demo Escrow
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

          {state.transactions.find(t => t.type === 'REVENUE_INTERCEPTED') ? (
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
              {state.logs.map((log, index) => (
                <div key={index} className="log-line">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
