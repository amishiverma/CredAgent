import React from 'react';
import { X, Activity, Users, Database, Shield, Server } from 'lucide-react';

export const AdminDashboard = ({ onClose }) => {
  const recentActivity = [
    { id: 'tx_9812', agent: 'Agent-Alpha', type: 'Loan Issued', amount: '₹25,000', status: 'Success', time: '2 mins ago' },
    { id: 'tx_9811', agent: 'YieldBot-X', type: 'Repayment', amount: '₹12,500', status: 'Success', time: '15 mins ago' },
    { id: 'tx_9810', agent: 'ArbTrader', type: 'Margin Call', amount: '₹5,000', status: 'Triggered', time: '1 hour ago' },
    { id: 'tx_9809', agent: 'LiqProvider', type: 'Loan Issued', amount: '₹100,000', status: 'Pending', time: '3 hours ago' },
  ];

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="admin-modal glass-panel" style={{
        width: '90%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto',
        borderRadius: '24px', padding: '2rem', border: '1px solid rgba(164, 80, 255, 0.3)',
        boxShadow: '0 0 40px rgba(164, 80, 255, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield style={{ color: 'var(--primary-purple)' }} /> Admin Control Center
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>CredAgent Protocol System Overview</p>
          </div>
          <button onClick={onClose} className="btn-close" style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
            width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <X />
          </button>
        </div>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><Server size={18} /> System Uptime</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--primary-emerald)' }}>99.99%</div>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><Users size={18} /> Registered Agents</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>8,432</div>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><Database size={18} /> Total Value Locked</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>₹145.2M</div>
          </div>
          <div className="stat-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><Activity size={18} /> Active Escrows</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 600 }}>1,204</div>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Recent Protocol Activity</h3>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Transaction ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Agent</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((tx, i) => (
                <tr key={tx.id} style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--primary-cyan)' }}>{tx.id}</td>
                  <td style={{ padding: '1rem' }}>{tx.agent}</td>
                  <td style={{ padding: '1rem' }}>{tx.type}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{tx.amount}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                      background: tx.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : tx.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: tx.status === 'Success' ? 'var(--primary-emerald)' : tx.status === 'Pending' ? 'var(--primary-amber)' : '#ef4444'
                    }}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
