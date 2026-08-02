import React from 'react';
import { Home, Briefcase, Layers, Folder, Type, Image } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      </div>
      <nav className="sidebar-nav">
        <button className="sidebar-btn active"><Home size={20} /></button>
        <button className="sidebar-btn"><Briefcase size={20} /></button>
        <button className="sidebar-btn"><Layers size={20} /></button>
        <button className="sidebar-btn"><Folder size={20} /></button>
        <button className="sidebar-btn"><Type size={20} /></button>
        <button className="sidebar-btn"><Image size={20} /></button>
      </nav>
    </aside>
  );
};
