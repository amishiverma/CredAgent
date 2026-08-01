import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle, TrendingUp } from 'lucide-react';

export const OverviewStats = () => {
  return (
    <div className="stats-grid">
      <div className="stat-card border-cyan">
        <div className="stat-header">
          <span className="stat-title">Total Capital Extended</span>
          <div className="stat-icon-wrapper cyan-glow">
            <DollarSign className="stat-icon" />
          </div>
        </div>
        <div className="stat-value">$1,482,500 <span className="currency">USDC</span></div>
        <div className="stat-footer">
          <span className="trend positive">↑ 24.8%</span>
          <span className="stat-sub">Across 840+ agent transactions</span>
        </div>
      </div>

      <div className="stat-card border-emerald">
        <div className="stat-header">
          <span className="stat-title">Protocol Recovery Rate</span>
          <div className="stat-icon-wrapper emerald-glow">
            <CheckCircle className="stat-icon" />
          </div>
        </div>
        <div className="stat-value">99.42%</div>
        <div className="stat-footer">
          <span className="trend positive">Zero Collateral</span>
          <span className="stat-sub">Programmatic Escrow Interception</span>
        </div>
      </div>

      <div className="stat-card border-purple">
        <div className="stat-header">
          <span className="stat-title">Active Smart Escrows</span>
          <div className="stat-icon-wrapper purple-glow">
            <TrendingUp className="stat-icon" />
          </div>
        </div>
        <div className="stat-value">128 <span className="currency">Wallets</span></div>
        <div className="stat-footer">
          <span className="trend positive">Restricted Scope</span>
          <span className="stat-sub">Account Abstraction Rules</span>
        </div>
      </div>

      <div className="stat-card border-amber">
        <div className="stat-header">
          <span className="stat-title">Circuit Breaker Triggers</span>
          <div className="stat-icon-wrapper amber-glow">
            <ShieldAlert className="stat-icon" />
          </div>
        </div>
        <div className="stat-value">14 <span className="currency">Prevented Attacks</span></div>
        <div className="stat-footer">
          <span className="trend neutral">100% Capital Saved</span>
          <span className="stat-sub">Real-time spend monitoring</span>
        </div>
      </div>
    </div>
  );
};
