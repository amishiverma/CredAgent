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
      <div className="tab-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '16rem' }}>
        <div style={{ color: 'var(--primary-cyan)', fontFamily: 'var(--font-mono)', fontSize: '1rem', animation: 'pulse 2s infinite' }}>Loading Agents from Database...</div>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: 'var(--primary-amber)', textAlign: 'center', gap: '0.75rem' }}>
              <AlertOctagon style={{ width: '2.5rem', height: '2.5rem' }} />
              <p>No agents found in the database. Generate one on the right!</p>
            </div>
          ) : (
            <>
              {/* Agent Selector List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxHeight: '280px',
                overflowY: 'auto',
                paddingRight: '4px',
                marginBottom: '1.25rem'
              }}>
                {agents.map((agent) => (
                  <div 
                    key={agent.id} 
                    onClick={() => setSelectedAgent(agent)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedAgent?.id === agent.id
                        ? '1px solid var(--primary-cyan)'
                        : '1px solid var(--border-color)',
                      background: selectedAgent?.id === agent.id
                        ? 'rgba(56, 189, 248, 0.08)'
                        : 'rgba(30, 41, 59, 0.3)',
                      boxShadow: selectedAgent?.id === agent.id
                        ? '0 0 10px rgba(56, 189, 248, 0.3), inset 0 0 20px rgba(56, 189, 248, 0.05)'
                        : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: selectedAgent?.id === agent.id ? 'var(--primary-cyan)' : 'var(--text-main)'
                      }}>
                        {agent.name}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.03em',
                        flexShrink: 0,
                        background: agent.reputation >= 750
                          ? 'rgba(16, 185, 129, 0.2)'
                          : agent.reputation < 550
                            ? 'rgba(244, 63, 94, 0.2)'
                            : 'rgba(56, 189, 248, 0.15)',
                        color: agent.reputation >= 750
                          ? 'var(--primary-emerald)'
                          : agent.reputation < 550
                            ? 'var(--primary-rose)'
                            : 'var(--primary-cyan)'
                      }}>
                        Score: {agent.reputation}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {agent.did}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delegation Credential Details */}
              {selectedAgent && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}>
                  <h4 className="subpanel-title" style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}>
                    Delegation Credential Verification
                  </h4>

                  {/* Agent DID Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.85rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0, minWidth: '80px' }}>
                      Agent DID:
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flex: 1,
                      minWidth: 0,
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--primary-cyan)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}>
                        {selectedAgent.did}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedAgent.did)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          flexShrink: 0
                        }}
                      >
                        {copied
                          ? <Check style={{ width: '1rem', height: '1rem', color: 'var(--primary-emerald)' }} />
                          : <Copy style={{ width: '1rem', height: '1rem', color: 'var(--text-muted)' }} />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Parent Entity Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0, minWidth: '80px' }}>
                      Parent Entity:
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      color: 'var(--primary-purple)',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      textAlign: 'right'
                    }}>
                      {selectedAgent.owner}
                    </span>
                  </div>

                  {/* Verification Banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}>
                    <ShieldCheck style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-emerald)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: 'var(--primary-emerald)', fontSize: '0.85rem', display: 'block', marginBottom: '0.2rem' }}>
                        Identity Integrity Validated
                      </strong>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>
                        Verifiable W3C DID document linked to ECDSA key delegation from authorized parent wallet address.
                      </p>
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
              Generate & Register Agent DID <ChevronRight style={{ width: '1rem', height: '1rem' }} />
            </button>
          </form>

          {generatedDID && (
            <div style={{
              marginTop: '1.25rem',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Check style={{ width: '1.25rem', height: '1.25rem', color: 'var(--primary-emerald)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-emerald)' }}>
                  Agent Identity Successfully Registered in DB
                </span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>Agent Name:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{generatedDID.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>DID:</span>
                  <span style={{ color: 'var(--primary-cyan)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{generatedDID.did}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>Issuer Parent:</span>
                  <span style={{ color: 'var(--primary-purple)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{generatedDID.parent}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};