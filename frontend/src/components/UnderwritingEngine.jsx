import React, { useState } from 'react';
import { CreditScoringEngine } from '../engine/CreditScoring';
import { analyzeLyzrRisk } from '../services/api';
import { Zap, ShieldCheck, CheckCircle2, XCircle, Send, RefreshCw, Bot } from 'lucide-react';

export const UnderwritingEngine = () => {
  const [reputation, setReputation] = useState(815);
  const [successRate, setSuccessRate] = useState(98.5);
  const [requestedAmount, setRequestedAmount] = useState(500);
  const [expectedPayoff, setExpectedPayoff] = useState(650);
  const [vendorDomain, setVendorDomain] = useState("modal.com");
  const [hasEscrow, setHasEscrow] = useState(true);

  // --- LYZR AI CHAT STATE ---
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Greetings. I am the Lyzr Risk Oracle. Paste the loan parameters below for an instant risk analysis.' }
  ]);

  const evaluation = CreditScoringEngine.evaluateLoanRequest({
    agentReputation: reputation,
    successRate: parseFloat(successRate),
    requestedAmount: parseInt(requestedAmount, 10),
    expectedPayoff: parseInt(expectedPayoff, 10),
    targetVendorDomain: vendorDomain,
    hasBuyerEscrowProof: hasEscrow
  });

  // --- LYZR API CALL (SECURED VIA BACKEND PROXY) ---
  const handleSendToLyzr = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const resData = await analyzeLyzrRisk(userMsg);
      const content = resData?.data?.response || resData?.message || "Analysis complete. Proceed with caution.";
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content
      }]);
    } catch (err) {
      console.error("Lyzr API Error:", err);
      setChatHistory(prev => [...prev, { role: 'ai', content: "⚠️ API Connection Error. Please verify Lyzr network status." }]);
    }
    setIsChatLoading(false);
  };

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
              <label>Requested Loan Amount (₹)</label>
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
              <label>Expected Task Payoff (₹)</label>
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
              <span className="m-val cyan-text">₹{evaluation.maxLimit.toLocaleString('en-IN')} INR</span>
            </div>

            <div className="metric-box">
              <span className="m-label">Dynamic Interest Rate</span>
              <span className="m-val emerald-text">{evaluation.interestRatePercent}% APY</span>
            </div>

            <div className="metric-box">
              <span className="m-label">Total Debt at Maturity</span>
              <span className="m-val font-mono">₹{evaluation.totalRepaymentNeeded.toLocaleString('en-IN')} INR</span>
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

      {/* LYZR AI NATIVE API INTEGRATION */}
      <div className="panel card-glass" style={{ marginTop: '2rem', borderTop: '3px solid #a855f7', gridColumn: '1 / -1' }}>
        <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot className="w-6 h-6" style={{ color: '#a855f7' }} /> 
          Lyzr Risk Oracle (Native API Integration)
        </h3>
        <p className="panel-desc" style={{ marginBottom: '1.5rem' }}>
          Direct API connection to Lyzr Studio's GPT-5.5 Engine. Get an instant, institutional-grade risk analysis before deploying capital.
        </p>
        
        <div style={{ 
          background: '#030508', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '12px', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '450px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}>
          
          {/* Chat History Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatHistory.map((chat, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: chat.role === 'user' ? 'flex-end' : 'flex-start' 
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  lineHeight: '1.6',
                  fontFamily: chat.role === 'user' ? 'var(--font-main)' : 'var(--font-mono)',
                  backgroundColor: chat.role === 'user' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.1)',
                  border: `1px solid ${chat.role === 'user' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(168, 85, 247, 0.2)'}`,
                  color: chat.role === 'user' ? '#e0ebf2' : '#d8b4fe',
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {chat.content}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#d8b4fe',
                  fontSize: '13px'
                }}>
                  <RefreshCw className="w-4 h-4 spin" /> Oracle is processing telemetry...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendToLyzr} style={{ 
            display: 'flex', 
            gap: '10px', 
            padding: '12px', 
            background: 'rgba(15, 23, 42, 0.8)', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)' 
          }}>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="e.g., Analyze request: ₹250 for Shadow-V at suspicious-api.xyz"
              className="input-dark"
              style={{ flex: 1, margin: 0, fontFamily: 'var(--font-main)' }}
              disabled={isChatLoading}
            />
            <button 
              type="submit" 
              className="btn-purple"
              disabled={isChatLoading || !chatInput.trim()}
              style={{ margin: 0, padding: '0 20px' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};