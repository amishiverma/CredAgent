import React from 'react';
import { IndianRupee, ShieldAlert, CheckCircle, TrendingUp } from 'lucide-react';

export const OverviewStats = () => {
  return (
    <div className="stats-grid">
      <div className="stat-card border-cyan" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="stat-header">
          <span className="stat-title">Total Capital Extended</span>
          <div className="stat-icon-wrapper cyan-glow">
            <IndianRupee className="stat-icon" />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="stat-value" style={{ marginBottom: 0, whiteSpace: 'nowrap', fontSize: '2rem' }}>₹1,482,500</div>
          
          {/* SVG Graph for Line Chart */}
          <div style={{ width: '100px', height: '40px', flexShrink: 0 }}>
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                </linearGradient>
              </defs>
              <path d="M 0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15 L 100 30 L 0 30 Z" fill="url(#grad-cyan)" />
              <path d="M 0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15" fill="none" stroke="var(--primary-cyan)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="stat-footer" style={{ marginBottom: 0 }}>
          <span className="trend positive">↑ 24.8%</span>
          <span className="stat-sub">Across 840+ agent transactions</span>
        </div>
      </div>

      <div className="stat-card border-emerald" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="stat-header">
          <span className="stat-title">Protocol Recovery Rate</span>
          <div className="stat-icon-wrapper emerald-glow">
            <CheckCircle className="stat-icon" />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="stat-value" style={{ marginBottom: 0, fontSize: '2rem' }}>99.42%</div>
          
          {/* SVG Graph for Line Chart */}
          <div style={{ width: '100px', height: '40px', flexShrink: 0 }}>
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="grad-emerald-chart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
                  <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                </linearGradient>
              </defs>
              <path d="M 0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15 L 100 30 L 0 30 Z" fill="url(#grad-emerald-chart)" />
              <path d="M 0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15" fill="none" stroke="var(--primary-cyan)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="stat-footer" style={{ marginBottom: 0 }}>
          <span className="trend positive">Zero Collateral</span>
          <span className="stat-sub">Programmatic Escrow Interception</span>
        </div>
      </div>

      <div className="stat-card border-purple" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="stat-header">
          <span className="stat-title">Active Smart Escrows</span>
          <div className="stat-icon-wrapper purple-glow">
            <TrendingUp className="stat-icon" />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="stat-value" style={{ marginBottom: 0, whiteSpace: 'nowrap', fontSize: '2rem' }}>128 <span className="currency" style={{ fontSize: '0.9rem' }}>Wallets</span></div>
          
          {/* SVG Graph for Node Network */}
          <div style={{ width: '90px', height: '40px', flexShrink: 0 }}>
            <svg viewBox="0 0 100 40" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
              <line x1="20" y1="20" x2="40" y2="10" stroke="rgba(164, 80, 255, 0.5)" strokeWidth="1" />
              <line x1="40" y1="10" x2="60" y2="30" stroke="rgba(164, 80, 255, 0.5)" strokeWidth="1" />
              <line x1="40" y1="10" x2="70" y2="15" stroke="rgba(164, 80, 255, 0.5)" strokeWidth="1" />
              <line x1="60" y1="30" x2="70" y2="15" stroke="rgba(164, 80, 255, 0.5)" strokeWidth="1" />
              <line x1="70" y1="15" x2="90" y2="25" stroke="rgba(164, 80, 255, 0.5)" strokeWidth="1" />
              
              <circle cx="20" cy="20" r="3" fill="var(--primary-cyan)" />
              <circle cx="40" cy="10" r="4" fill="var(--primary-purple)" />
              <circle cx="60" cy="30" r="3" fill="var(--primary-cyan)" />
              <circle cx="70" cy="15" r="5" fill="var(--primary-purple)" />
              <circle cx="90" cy="25" r="3" fill="var(--primary-emerald)" />
            </svg>
          </div>
        </div>

        <div className="stat-footer" style={{ marginBottom: 0 }}>
          <span className="trend positive" style={{ color: 'var(--primary-cyan)', background: 'rgba(56, 189, 248, 0.15)' }}>Restricted Scope</span>
          <span className="stat-sub">Account Abstraction Rules</span>
        </div>
      </div>

      <div className="stat-card border-amber" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="stat-header">
          <span className="stat-title">Circuit Breaker Triggers</span>
          <div className="stat-icon-wrapper amber-glow">
            <ShieldAlert className="stat-icon" />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="stat-value" style={{ marginBottom: 0, whiteSpace: 'nowrap', fontSize: '2rem' }}>14 <span className="currency" style={{ fontSize: '0.9rem' }}>Prevented</span></div>
          
          {/* SVG Graph for Bar Chart */}
          <div style={{ width: '90px', height: '30px', flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '3px' }}>
             {[5, 12, 8, 24, 15, 30, 20, 10, 18, 25, 12, 16, 8, 22, 14, 10, 20, 15].map((h, i) => (
               <div key={i} style={{
                 width: '4px',
                 height: `${Math.max(10, h)}%`,
                 background: 'var(--primary-amber)',
                 opacity: 0.2 + (i / 20) * 0.8,
                 borderRadius: '2px 2px 0 0'
               }} />
             ))}
          </div>
        </div>

        <div className="stat-footer" style={{ marginBottom: 0 }}>
          <span className="trend neutral">100% Capital Saved</span>
          <span className="stat-sub">Real-time spend monitoring</span>
        </div>
      </div>
    </div>
  );
};
