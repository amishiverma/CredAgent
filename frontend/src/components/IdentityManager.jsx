import React, { useState } from 'react';
import { AgentIdentityEngine } from '../engine/AgentIdentity';
import { MOCK_AGENTS } from '../data/mockAgents';
import { ShieldCheck, Key, UserCheck, Copy, Check, Lock, ChevronRight } from 'lucide-react';

export const IdentityManager = () => {
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0]);
  const [copied, setCopied] = useState(false);
  const [customParent, setCustomParent] = useState("0x71C88219A91823BCA8102910AA891283");
  const [newAgentName, setNewAgentName] = useState("");
  const [generatedDID, setGeneratedDID] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!newAgentName) return;
    const did = AgentIdentityEngine.generateDID(customParent, newAgentName);
    setGeneratedDID({
      name: newAgentName,
      did,
      parent: customParent,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const delegationResult = AgentIdentityEngine.verifyDelegation(
    selectedAgent.did,
    "0x981723812938192318923819283912831293",
    ["GPU_COMPUTE", "INFERENCE_API", "DEFI_SWAP"]
  );

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><Key className="inline-icon" /> Cryptographic Agent Identity & Delegation</h2>
          <p className="subtitle">Establishes verifiable links between autonomous agents and their authorizing human or corporate entities without requiring standard legal signatures.</p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Agent Selector & Identity Inspector */}
        <div className="panel card-glass">
          <h3 className="panel-title"><UserCheck className="panel-icon" /> Active Agent Registry</h3>

          <div className="agent-selector-list">
            {MOCK_AGENTS.map((agent) => (
              <div 
                key={agent.id} 
                className={`agent-card-item ${selectedAgent.id === agent.id ? 'active' : ''}`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="agent-card-header">
                  <span className="agent-name">{agent.name}</span>
                  <span className={`badge ${agent.tier.includes('Prime') ? 'badge-prime' : agent.tier.includes('High Risk') ? 'badge-danger' : 'badge-info'}`}>
                    {agent.tier}
                  </span>
                </div>
                <div className="agent-did-preview">{agent.did}</div>
              </div>
            ))}
          </div>

          <div className="identity-details">
            <h4 className="subpanel-title">Delegation Credential Verification</h4>
            
            <div className="detail-row">
              <span className="detail-label">Agent DID:</span>
              <div className="code-pill">
                <span>{selectedAgent.did}</span>
                <button className="copy-btn" onClick={() => handleCopy(selectedAgent.did)}>
                  {copied ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="detail-row">
              <span className="detail-label">Parent Entity:</span>
              <span className="detail-value">{selectedAgent.parentOrg}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">ECDSA Signature:</span>
              <span className="detail-value text-muted font-mono">0x98172381293...831293 (VERIFIED)</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Permitted Whitelisted Scope:</span>
              <div className="tags-list">
                {selectedAgent.whitelistedVendors.map((v, i) => (
                  <span key={i} className="tag-pill">{v}</span>
                ))}
              </div>
            </div>

            <div className="verification-box success">
              <ShieldCheck className="verif-icon" />
              <div>
                <strong>Identity Integrity Validated</strong>
                <p>Verifiable W3C DID document linked to ECDSA key delegation from authorized parent wallet address.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Issue New Delegated Identity Form */}
        <div className="panel card-glass">
          <h3 className="panel-title"><Lock className="panel-icon" /> Issue Agent Delegated Passkey</h3>
          <p className="panel-desc">Authorize a new autonomous sub-agent with strict borrowing and execution caps.</p>

          <form onSubmit={handleGenerate} className="identity-form">
            <div className="form-group">
              <label>Agent Name / Label</label>
              <input 
                type="text" 
                placeholder="e.g. Hyperion-9 (Dataset Labeler)" 
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="input-dark"
                required
              />
            </div>

            <div className="form-group">
              <label>Parent Org Wallet Address</label>
              <input 
                type="text" 
                value={customParent}
                onChange={(e) => setCustomParent(e.target.value)}
                className="input-dark font-mono"
                required
              />
            </div>

            <div className="form-group">
              <label>Delegated Whitelist Restrictions</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> GPU Compute (Modal / RunPod)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> LLM Inference APIs (Together / OpenRouter)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" /> DeFi Swaps (Uniswap V3)
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary full-width">
              Generate Cryptographic Agent DID <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {generatedDID && (
            <div className="generated-result card-inner">
              <div className="result-header">
                <Check className="text-emerald" />
                <span>Agent Identity Successfully Delegated</span>
              </div>
              <div className="code-block font-mono">
                <div><strong>Agent Name:</strong> {generatedDID.name}</div>
                <div><strong>DID:</strong> {generatedDID.did}</div>
                <div><strong>Issuer Parent:</strong> {generatedDID.parent}</div>
                <div><strong>Timestamp:</strong> {generatedDID.timestamp}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
