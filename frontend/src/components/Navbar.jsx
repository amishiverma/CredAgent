import React from 'react';
import { ShieldCheck, Cpu, Zap, Award, Sparkles, Terminal, Wallet } from 'lucide-react';

export const Navbar = ({ onOpenPitch, activeTab, setActiveTab, onReturnHome, onOpenAdmin }) => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={onReturnHome} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="CredAgent Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
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

        <button className="profile-badge" onClick={onOpenAdmin} style={{ cursor: 'pointer' }}>
          <img src="/profile_pic_1785667538497.png" alt="Profile" className="profile-img" />
          <div className="profile-info">
            <span className="profile-greeting">Welcome back,</span>
            <span className="profile-name">CredAgent Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
};
