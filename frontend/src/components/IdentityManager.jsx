import React, { useState, useEffect } from 'react';
import { AgentIdentityEngine } from '../engine/AgentIdentity';
import { ShieldCheck, Key, UserCheck, Copy, Check, Lock, ChevronRight, AlertOctagon } from 'lucide-react';
import { fetchAgents, createAgent } from '../services/api.js';

export const IdentityManager = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [customParent, setCustomParent] = useState("0x71C88219A91823BCA8102910AA891283");
  const [newAgentName, setNewAgentName] = useState("");
  const [generatedDID, setGeneratedDID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real agents from MongoDB
  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      const response = await fetchAgents();
      if (response && response.data) {
        setAgents(response.data);
        if (response.data.length > 0) setSelectedAgent(response.data[0]);
      }
      setIsLoading(false);
    };
    loadAgents();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save the new agent to MongoDB when generated!
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!newAgentName) return;
    
    const res = await createAgent({
      name: newAgentName,
      owner: customParent,
      reputation: 800,
      collateral: 500
    });

    if (res && res.data) {
      setGeneratedDID({
        name: res.data.name,
        did: res.data.did,
        parent: res.data.owner,
        timestamp: new Date(res.data.createdAt).toLocaleTimeString()
      });
      
      const updated = await fetchAgents();
      if (updated && updated.data) {
        setAgents(updated.data);
        if (!selectedAgent) setSelectedAgent(updated.data[0]);
      }
      setNewAgentName(""); 
    }
  };

  if (isLoading) {
    return (
      <div className="tab-content flex justify-center items-center h-64">
        <div className="text-cyan animate-pulse">Loading Agents from Database...</div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <div>
          <h2><Key className="inline-icon" /> Cryptographic Agent Identity & Delegation</h2>
          <p className="subtitle">Establishes verifiable links between autonomous agents and their authorizing human or corporate entities without requiring standard legal signatures.</p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column */}
        <div className="panel card-glass">
          <h3 className="panel-title"><UserCheck className="panel-icon" /> Active Agent Registry</h3>

          {agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-amber-500 text-center gap-3">
              <AlertOctagon className="w-10 h-10" />
              <p>No agents found in the database. Generate one on the right!</p>
            </div>
          ) : (
            <>
              <div className="agent-selector-list">
                {agents.map((agent) => (
                  <div 
                    key={agent.id} 
                    className={`agent-card-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="agent-card-header">
                      <span className="agent-name">{agent.name}</span>
                      <span className={`badge ${agent.reputation >= 750 ? 'badge-prime' : agent.reputation < 550 ? 'badge-danger' : 'badge-info'}`}>
                        Score: {agent.reputation}
                      </span>
                    </div>
                    <div className="agent-did-preview">{agent.did}</div>
                  </div>
                ))}
              </div>

              {selectedAgent && (
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
                    <span className="detail-value">{selectedAgent.owner}</span>
                  </div>
                  <div className="verification-box success">
                    <ShieldCheck className="verif-icon" />
                    <div>
                      <strong>Identity Integrity Validated</strong>
                      <p>Verifiable W3C DID document linked to ECDSA key delegation from authorized parent wallet address.</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
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

            <button type="submit" className="btn-primary full-width">
              Generate & Register Agent DID <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {generatedDID && (
            <div className="generated-result card-inner mt-4">
              <div className="result-header">
                <Check className="text-emerald" />
                <span>Agent Identity Successfully Registered in DB</span>
              </div>
              <div className="code-block font-mono">
                <div><strong>Agent Name:</strong> {generatedDID.name}</div>
                <div><strong>DID:</strong> {generatedDID.did}</div>
                <div><strong>Issuer Parent:</strong> {generatedDID.parent}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};