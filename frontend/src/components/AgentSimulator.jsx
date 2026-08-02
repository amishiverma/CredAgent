import React, { useState, useEffect } from 'react';
import { AgentRunner } from '../engine/AgentRunner';
import { CreditScoringEngine } from '../engine/CreditScoring';
import { SmartEscrowLedger } from '../engine/SmartEscrowLedger';
import { ProtocolState } from '../engine/ProtocolState';
import confetti from 'canvas-confetti';
import { Play, ShieldAlert, Cpu, CheckCircle2, Zap, Terminal, RefreshCw, Lock, Award, PlusCircle, ArrowRight } from 'lucide-react';

export const AgentSimulator = () => {
  const [protocolState, setProtocolState] = useState(ProtocolState.getState());
  const [isRunning, setIsRunning] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  // Custom Loan Form State
  const [customAgentName, setCustomAgentName] = useState('Aura-9 (Dataset Processor)');
  const [customLoanAmount, setCustomLoanAmount] = useState('750');
  const [customPayoff, setCustomPayoff] = useState('1000');
  const [customVendor, setCustomVendor] = useState('modal.com');
  const [customReputation, setCustomReputation] = useState(800);
  const [customEscrowProof, setCustomEscrowProof] = useState(true);

  useEffect(() => {
    const unsubscribe = ProtocolState.subscribe(setProtocolState);
    return unsubscribe;
  }, []);

  const runPresetScenario = async (scenarioType) => {
    setIsRunning(true);
    setActiveScenario(scenarioType);
    setLogs([]);
    setResult(null);

    const onStepUpdate = (data) => setLogs(data.logs);

    let res = null;
    if (scenarioType === 'A') {
      res = await AgentRunner.runScenarioA(onStepUpdate);
      ProtocolState.repayLoan("loan_9921", 500, 25);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else if (scenarioType === 'B') {
      res = await AgentRunner.runScenarioB(onStepUpdate);
      ProtocolState.repayLoan("loan_4412", 1000, 65);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } else if (scenarioType === 'C') {
      res = await AgentRunner.runScenarioC(onStepUpdate);
    }

    setResult(res);
    setIsRunning(false);
  };

  const handleRunCustomLoan = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    setActiveScenario('CUSTOM');
    setLogs([]);
    setResult(null);

    const logsArr = [];
    const step = (msg, delay = 800) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const timestamp = new Date().toLocaleTimeString();
          const entry = `[${timestamp}] ${msg}`;
          logsArr.push(entry);
          setLogs([...logsArr]);
          resolve();
        }, delay);
      });
    };

    const amount = parseFloat(customLoanAmount);
    const payoff = parseFloat(customPayoff);

    await step(`🚀 Initiating Live Dynamic Loan Execution for ${customAgentName}...`);

    // 1. Underwriting
    const evaluation = CreditScoringEngine.evaluateLoanRequest({
      agentReputation: customReputation,
      successRate: 97.0,
      requestedAmount: amount,
      expectedPayoff: payoff,
      targetVendorDomain: customVendor,
      hasBuyerEscrowProof: customEscrowProof
    });

    await step(`📊 Underwriting Result: Credit Score ${evaluation.creditScore} (${evaluation.tier}) | APY: ${evaluation.interestRatePercent}%`);

    if (!evaluation.approved) {
      await step(`❌ LOAN REJECTED: ${evaluation.reasons.join(' ')}`);
      setResult({
        status: "REJECTED",
        logs: logsArr,
        evaluation,
        summary: { loan: amount, repaid: 0, interestPaid: 0, netProfit: 0 }
      });
      setIsRunning(false);
      return;
    }

    // 2. Add to Protocol & Lock Capital
    const loanObj = {
      id: `loan_dyn_${Math.floor(Math.random() * 90000)}`,
      agentName: customAgentName,
      agentDID: `did:agent:0x${Math.random().toString(16).substring(2, 12)}`,
      loanAmount: amount,
      interestRate: evaluation.interestRatePercent,
      expectedPayoff: payoff,
      vendor: customVendor,
      status: "ACTIVE",
      createdAt: new Date().toLocaleTimeString()
    };

    ProtocolState.addCustomLoan(loanObj);
    await step(`💰 Capital Granted: $${amount} USDC disbursed from Lender Pool into Account Abstraction Escrow ${loanObj.id}`);

    // 3. Smart Escrow Execution
    const escrow = new SmartEscrowLedger(loanObj.id, loanObj.agentDID, amount, evaluation.interestRatePercent, customVendor);
    
    // Check spend authorization
    const spendSuccess = escrow.executeDisbursement(customVendor, amount * 0.9, `Task Execution on ${customVendor}`);

    if (!spendSuccess) {
      await step(`🚨 CIRCUIT BREAKER TRIGGERED: Unauthorized target vendor domain '${customVendor}' detected!`);
      await step(`🔒 Escrow Frozen instantly! 100% of unspent capital returned to Lender Pool.`);
      setResult({
        status: "CIRCUIT_BREAKER_PREVENTED",
        logs: logsArr,
        evaluation,
        summary: { loan: amount, recovered: amount, loss: 0 }
      });
      setIsRunning(false);
      return;
    }

    await step(`✅ Disbursed $${amount * 0.9} USDC to Whitelisted Vendor ${customVendor}. Task in progress...`);
    await step(`🎉 Task Execution Completed! Output delivered to buyer.`);

    // 4. Buyer Payout & Auto Repayment
    await step(`💰 Buyer deposited $${payoff} USDC into Smart Escrow Contract...`);
    const repayment = escrow.receiveBuyerPayment(payoff);

    ProtocolState.repayLoan(loanObj.id, repayment.repaidPrincipal, repayment.repaidInterest);

    await step(`✨ AUTOMATED REPAYMENT EXECUTED: $${repayment.repaidPrincipal} Principal + $${repayment.repaidInterest} Interest auto-routed back to Lender Pool.`);
    await step(`🏆 Net Profit $${repayment.netProfitToAgentOwner} USDC auto-transferred to Agent Owner!`);

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    setResult({
      status: "SUCCESS",
      logs: logsArr,
      evaluation,
      summary: {
        loan: amount,
        repaid: repayment.repaidPrincipal + repayment.repaidInterest,
        interestPaid: repayment.repaidInterest,
        netProfit: repayment.netProfitToAgentOwner
      }
    });

    setIsRunning(false);
  };

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><Cpu className="inline-icon" /> Live Dynamic Agent Simulator & Custom Loan Studio</h2>
          <p className="subtitle">Run pre-configured scenarios OR create custom dynamic loan requests to test live AI underwriting and smart repayment execution.</p>
        </div>
      </div>

      {/* Dynamic Custom Loan Creator Form */}
      <div className="panel card-glass margin-bottom-lg" style={{ border: '2px solid var(--ca-purple)', boxShadow: '0 0 40px rgba(112, 0, 255, 0.3) inset, 0 0 50px rgba(112, 0, 255, 0.4)' }}>
        <h3 className="panel-title"><PlusCircle className="panel-icon" /> Create & Launch Custom Live Agent Loan Request</h3>
        <p className="panel-desc">Test any agent name, custom loan amount, vendor endpoint, and buyer payoff live against your Lender Pool!</p>

        <form onSubmit={handleRunCustomLoan} className="custom-loan-form">
          <div className="grid-3col">
            <div className="form-group">
              <label>Agent Name / Task Title</label>
              <input 
                type="text" 
                value={customAgentName} 
                onChange={(e) => setCustomAgentName(e.target.value)}
                className="input-dark"
                required
              />
            </div>

            <div className="form-group">
              <label>Requested Loan Amount (₹)</label>
              <input 
                type="number" 
                value={customLoanAmount} 
                onChange={(e) => setCustomLoanAmount(e.target.value)}
                className="input-dark font-mono"
                required
              />
            </div>

            <div className="form-group">
              <label>Expected Buyer Payoff (₹)</label>
              <input 
                type="number" 
                value={customPayoff} 
                onChange={(e) => setCustomPayoff(e.target.value)}
                className="input-dark font-mono"
                required
              />
            </div>
          </div>

          <div className="grid-3col margin-top-sm">
            <div className="form-group">
              <label>Target Vendor Endpoint</label>
              <select 
                value={customVendor} 
                onChange={(e) => setCustomVendor(e.target.value)}
                className="input-dark"
              >
                <option value="modal.com">modal.com (Whitelisted GPU)</option>
                <option value="runpod.io">runpod.io (Whitelisted GPU)</option>
                <option value="together.ai">together.ai (Whitelisted API)</option>
                <option value="uniswap.v3">uniswap.v3 (DeFi Router)</option>
                <option value="suspicious-untrusted-api.xyz">suspicious-untrusted-api.xyz (Trigger Circuit Breaker!)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Agent Reputation Score (300-850)</label>
              <input 
                type="number" 
                value={customReputation} 
                onChange={(e) => setCustomReputation(parseInt(e.target.value, 10))}
                className="input-dark font-mono"
                min="300"
                max="850"
              />
            </div>

            <div className="form-group flex-align-end">
              <button type="submit" className="btn-primary full-width" disabled={isRunning}>
                {isRunning && activeScenario === 'CUSTOM' ? <RefreshCw className="spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                Execute Custom Live Loan
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="scenario-cards-grid">
        {/* Scenario A Card */}
        <div 
          className={`scenario-card ${activeScenario === 'A' ? 'selected' : ''}`}
          style={{ 
            backgroundImage: 'linear-gradient(to bottom, rgba(14, 16, 28, 0.2), rgba(14, 16, 28, 0.95)), url(/preset_cpu_1785667549694.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid var(--ca-purple)',
            boxShadow: '0 0 20px rgba(112, 0, 255, 0.3)'
          }}
        >
          <div className="sc-header">
            <span className="sc-tag" style={{ background: 'var(--primary-cyan)', color: '#000' }}>PRESET A</span>
            <Cpu className="sc-icon text-cyan" />
          </div>
          <h3 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Enterprise Compute Micro-Loan</h3>
          <p style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Nexus-7 requests ₹41,000 loan to purchase H100 GPUs for fine-tuning. Client deposits ₹53,000 payoff into escrow. Auto-repayment deducts ₹43,000, releasing ₹10,000 profit.</p>
          <div className="sc-footer">
            <button 
              className="btn-primary full-width" 
              onClick={() => runPresetScenario('A')}
              disabled={isRunning}
            >
              {isRunning && activeScenario === 'A' ? <RefreshCw className="spin w-4 h-4" /> : <Play className="w-4 h-4" />}
              Run Scenario A Demo
            </button>
          </div>
        </div>

        {/* Scenario B Card */}
        <div 
          className={`scenario-card ${activeScenario === 'B' ? 'selected' : ''}`}
          style={{ 
            backgroundImage: 'linear-gradient(to bottom, rgba(14, 16, 28, 0.2), rgba(14, 16, 28, 0.95)), url(/preset_dex_1785667560596.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid var(--ca-purple)',
            boxShadow: '0 0 20px rgba(112, 0, 255, 0.3)'
          }}
        >
          <div className="sc-header">
            <span className="sc-tag" style={{ background: 'var(--ca-purple)', color: '#fff' }}>PRESET B</span>
            <Zap className="sc-icon text-purple" />
          </div>
          <h3 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Cross-DEX Arbitrage Credit</h3>
          <p style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Aether-X requests ₹82,000 flash working capital for Uniswap V3 arbitrage. Principal + APY auto-deducted with instant settlement.</p>
          <div className="sc-footer">
            <button 
              className="btn-purple full-width" 
              onClick={() => runPresetScenario('B')}
              disabled={isRunning}
            >
              {isRunning && activeScenario === 'B' ? <RefreshCw className="spin w-4 h-4" /> : <Play className="w-4 h-4" />}
              Run Scenario B Demo
            </button>
          </div>
        </div>

        {/* Scenario C Card */}
        <div 
          className={`scenario-card ${activeScenario === 'C' ? 'selected' : ''}`}
          style={{ 
            backgroundImage: 'linear-gradient(to bottom, rgba(14, 16, 28, 0.2), rgba(14, 16, 28, 0.95)), url(/preset_lock_1785667570738.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid var(--ca-purple)',
            boxShadow: '0 0 20px rgba(112, 0, 255, 0.3)'
          }}
        >
          <div className="sc-header">
            <span className="sc-tag tag-danger">PRESET C (ATTACK)</span>
            <ShieldAlert className="sc-icon text-amber" />
          </div>
          <h3 style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Rogue Agent Attack & Recovery</h3>
          <p style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>Shadow-V attempts unauthorized spend to non-whitelisted address. Real-time Circuit Breaker fires in +24ms, freezing escrow and reclaiming 100% capital.</p>
          <div className="sc-footer">
            <button 
              className="btn-danger full-width" 
              onClick={() => runPresetScenario('C')}
              disabled={isRunning}
            >
              {isRunning && activeScenario === 'C' ? <RefreshCw className="spin w-4 h-4" /> : <Play className="w-4 h-4" />}
              Run Circuit Breaker Attack Test
            </button>
          </div>
        </div>
      </div>

      {/* Live Execution Output Terminal & Results */}
      <div className="grid-2col margin-top-lg">
        <div className="panel card-glass">
          <h3 className="panel-title"><Terminal className="panel-icon" /> Live Execution Terminal Log</h3>

          <div className="terminal-box font-mono">
            {logs.length === 0 ? (
              <div className="terminal-placeholder">
                <span>&gt; Submit a custom loan or select a scenario above to start live execution...</span>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`terminal-line ${log.includes('🚨') || log.includes('BLOCKED') || log.includes('REJECTED') ? 'text-amber' : log.includes('AUTOMATED REPAYMENT') || log.includes('RECOVERY EXECUTED') || log.includes('REPAYMENT COMPLETE') ? 'text-emerald' : ''}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel card-glass">
          <h3 className="panel-title"><Award className="panel-icon" /> Telemetry & Settlement Output</h3>

          {result ? (
            <div className="result-summary-box">
              <div className={`res-header-badge ${result.status === 'SUCCESS' ? 'res-success' : 'res-danger'}`}>
                {result.status === 'SUCCESS' ? (
                  <><CheckCircle2 className="w-6 h-6" /> TASK COMPLETED & DEBT REPAID</>
                ) : (
                  <><ShieldAlert className="w-6 h-6" /> ATTACK CONTAINED BY CIRCUIT BREAKER</>
                )}
              </div>

              {result.status === 'SUCCESS' ? (
                <div className="summary-metrics-grid">
                  <div className="sum-card">
                    <span className="sum-label">Loan Capital Principal</span>
                    <span className="sum-val">${result.summary.loan} USDC</span>
                  </div>

                  <div className="sum-card">
                    <span className="sum-label">Repaid to Lender Pool</span>
                    <span className="sum-val text-emerald">${result.summary.repaid} USDC</span>
                  </div>

                  <div className="sum-card">
                    <span className="sum-label">Protocol Yield (Interest)</span>
                    <span className="sum-val text-cyan">${result.summary.interestPaid} USDC</span>
                  </div>

                  <div className="sum-card">
                    <span className="sum-label">Net Profit Disbursed to Owner</span>
                    <span className="sum-val text-purple">${result.summary.netProfit} USDC</span>
                  </div>
                </div>
              ) : (
                <div className="summary-metrics-grid">
                  <div className="sum-card">
                    <span className="sum-label">Attempted Loan Spend</span>
                    <span className="sum-val">${result.summary.loan} USDC</span>
                  </div>

                  <div className="sum-card">
                    <span className="sum-label">Capital Reclaimed to Pool</span>
                    <span className="sum-val text-emerald">${result.summary.recovered} USDC (100%)</span>
                  </div>

                  <div className="sum-card">
                    <span className="sum-label">Lender Capital Loss</span>
                    <span className="sum-val text-cyan">$0 USDC (Zero Loss)</span>
                  </div>

                  <div className="sum-card">
                    <span className="sum-label">Circuit Breaker Response</span>
                    <span className="sum-val text-amber">&lt; 24 ms</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="placeholder-summary">
              <Lock className="w-12 h-12 text-muted" />
              <p>Awaiting scenario completion to generate telemetry metrics...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
