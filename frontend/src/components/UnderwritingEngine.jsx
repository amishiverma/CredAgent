import React, { useState } from 'react';
import { CreditScoringEngine } from '../engine/CreditScoring';
import { Zap, ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

export const UnderwritingEngine = () => {
  const [reputation, setReputation] = useState(815);
  const [successRate, setSuccessRate] = useState(98.5);
  const [requestedAmount, setRequestedAmount] = useState(500);
  const [expectedPayoff, setExpectedPayoff] = useState(650);
  const [vendorDomain, setVendorDomain] = useState("modal.com");
  const [hasEscrow, setHasEscrow] = useState(true);

  const evaluation = CreditScoringEngine.evaluateLoanRequest({
    agentReputation: reputation,
    successRate: parseFloat(successRate),
    requestedAmount: parseInt(requestedAmount, 10),
    expectedPayoff: parseInt(expectedPayoff, 10),
    targetVendorDomain: vendorDomain,
    hasBuyerEscrowProof: hasEscrow
  });

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><Zap className="inline-icon" /> Autonomous AI Underwriting Engine</h2>
          <p className="subtitle">Calculates dynamic creditworthiness for non-human borrowers based on telemetry track record, buyer escrow deposits, and vendor trust scores.</p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Interactive Underwriting Controls */}
        <div className="panel card-glass">
          <h3 className="panel-title">Underwriting Telemetry Controls</h3>

          <div className="form-group">
            <div className="label-with-val">
              <label>Agent Historical Reputation Score (ARS)</label>
              <span className="slider-val cyan-text">{reputation} / 850</span>
            </div>
            <input 
              type="range" 
              min="300" 
              max="850" 
              value={reputation}
              onChange={(e) => setReputation(parseInt(e.target.value, 10))}
              className="slider-input"
            />
          </div>

          <div className="form-group">
            <div className="label-with-val">
              <label>Historical Task Success Rate (%)</label>
              <span className="slider-val emerald-text">{successRate}%</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="100" 
              step="0.5"
              value={successRate}
              onChange={(e) => setSuccessRate(e.target.value)}
              className="slider-input"
            />
          </div>

          <div className="grid-2col-compact">
            <div className="form-group">
              <label>Requested Loan Amount ($)</label>
              <input 
                type="number" 
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="input-dark"
                min="50"
                max="10000"
              />
            </div>

            <div className="form-group">
              <label>Expected Task Payoff ($)</label>
              <input 
                type="number" 
                value={expectedPayoff}
                onChange={(e) => setExpectedPayoff(e.target.value)}
                className="input-dark"
                min="50"
                max="15000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Target Vendor Endpoint / API Domain</label>
            <select 
              value={vendorDomain}
              onChange={(e) => setVendorDomain(e.target.value)}
              className="input-dark"
            >
              <option value="modal.com">modal.com (Trust Score: 99 - Whitelisted GPU)</option>
              <option value="runpod.io">runpod.io (Trust Score: 98 - Whitelisted GPU)</option>
              <option value="together.ai">together.ai (Trust Score: 97 - Inference API)</option>
              <option value="uniswap.v3">uniswap.v3 (Trust Score: 95 - DeFi Router)</option>
              <option value="unknown-suspicious-api.xyz">unknown-suspicious-api.xyz (Trust Score: 15 - Suspicious)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="toggle-container">
              <input 
                type="checkbox" 
                checked={hasEscrow}
                onChange={(e) => setHasEscrow(e.target.checked)}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-label">Buyer Payoff Escrow Deposit Verified (Zero Collateral Guarantee)</span>
            </label>
          </div>
        </div>

        {/* Right Column: Calculated Underwriting Scorecard */}
        <div className="panel card-glass">
          <h3 className="panel-title">Real-Time Risk & Credit Scorecard</h3>

          <div className="scorecard-header">
            <div className="score-circle-container">
              <svg className="score-ring" viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="42" />
                <circle 
                  className="ring-progress" 
                  cx="50" 
                  cy="50" 
                  r="42"
                  style={{
                    strokeDasharray: 264,
                    strokeDashoffset: 264 - (264 * (evaluation.creditScore - 300)) / 550
                  }}
                />
              </svg>
              <div className="score-number font-mono">
                <span>{evaluation.creditScore}</span>
                <span className="score-label">CREDIT SCORE</span>
              </div>
            </div>

            <div className="decision-banner">
              <div className={`decision-badge ${evaluation.approved ? 'approved' : 'rejected'}`}>
                {evaluation.approved ? (
                  <><CheckCircle2 className="w-5 h-5" /> LOAN APPROVED</>
                ) : (
                  <><XCircle className="w-5 h-5" /> REJECTED / HIGH RISK</>
                )}
              </div>
              <div className="tier-label">{evaluation.tier}</div>
            </div>
          </div>

          <div className="scorecard-metrics">
            <div className="metric-box">
              <span className="m-label">Approved Credit Limit</span>
              <span className="m-val cyan-text">${evaluation.maxLimit} USDC</span>
            </div>

            <div className="metric-box">
              <span className="m-label">Dynamic Interest Rate</span>
              <span className="m-val emerald-text">{evaluation.interestRatePercent}% APY</span>
            </div>

            <div className="metric-box">
              <span className="m-label">Total Debt at Maturity</span>
              <span className="m-val font-mono">${evaluation.totalRepaymentNeeded} USDC</span>
            </div>

            <div className="metric-box">
              <span className="m-label">Loan-To-Value (LTV) Ratio</span>
              <span className="m-val font-mono">{evaluation.LTVRatio}%</span>
            </div>
          </div>

          <div className="reasons-list">
            <h4 className="subpanel-title">Underwriting Logic Rationale</h4>
            {evaluation.reasons.map((r, i) => (
              <div key={i} className="reason-item">
                <ShieldCheck className="w-4 h-4 text-cyan" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
