import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewStats } from './components/OverviewStats';
import { AgentSimulator } from './components/AgentSimulator';
import { LenderPortal } from './components/LenderPortal';
import { UnderwritingEngine } from './components/UnderwritingEngine';
import { EscrowTracker } from './components/EscrowTracker';
import { IdentityManager } from './components/IdentityManager';
import { PitchDeckModal } from './components/PitchDeckModal';
import { Landing } from './components/Landing';

export function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  if (!hasEntered) {
    return <Landing onEnter={() => { window.scrollTo(0, 0); setHasEntered(true); }} />;
  }

  return (
    <div className="app-root">
      <Navbar 
        onOpenPitch={() => setIsPitchOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="app-container">
        <OverviewStats />

        {activeTab === 'simulator' && <AgentSimulator />}
        {activeTab === 'lender' && <LenderPortal />}
        {activeTab === 'underwriting' && <UnderwritingEngine />}
        {activeTab === 'escrow' && <EscrowTracker />}
        {activeTab === 'identity' && <IdentityManager />}
      </main>

      <PitchDeckModal 
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />
    </div>
  );
}

export default App;
