import React from 'react';
import { ShieldCheck, Cpu, Zap, Award, Sparkles, Terminal, Wallet } from 'lucide-react';

export const Navbar = ({ onOpenPitch, activeTab, setActiveTab }) => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand">
          <div className="logo-icon">
            <ShieldCheck className="icon-main" />
            <Zap className="icon-badge" />
          </div>
          <div className="brand-text">
            <span className="brand-title">CredAgent <span className="gradient-text">Protocol</span></span>
            <span className="brand-subtitle">Credit for Autonomous AI Agents</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Cpu className="tab-icon" /> Live Agent Simulator
          </button>

          <button 
            className={`tab-btn ${activeTab === 'lender' ? 'active' : ''}`}
            onClick={() => setActiveTab('lender')}
          >
            <Wallet className="tab-icon" /> Lender Capital Pool
          </button>

          <button 
            className={`tab-btn ${activeTab === 'underwriting' ? 'active' : ''}`}
            onClick={() => setActiveTab('underwriting')}
          >
            <Zap className="tab-icon" /> Underwriting Engine
          </button>

          <button 
            className={`tab-btn ${activeTab === 'escrow' ? 'active' : ''}`}
            onClick={() => setActiveTab('escrow')}
          >
            <ShieldCheck className="tab-icon" /> Escrow & Repayment
          </button>

          <button 
            className={`tab-btn ${activeTab === 'identity' ? 'active' : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            <Terminal className="tab-icon" /> Agent Identity
          </button>
        </nav>

        <div className="nav-actions">
          <div className="network-pill">
            <span className="dot pulse"></span>
            {/* <span className="network-name">Arbitrum Sepolia (Testnet)</span> */}
          </div>

          <button className="judge-pitch-btn" onClick={onOpenPitch}>
            <Award className="pitch-icon" />
            <span>Judge Pitch Guide</span>
            <Sparkles className="sparkle-icon" />
          </button>
        </div>
      </div>
    </header>
  );
};
