import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import IndividualPortal from './components/IndividualPortal';
import EnterprisePortal from './components/EnterprisePortal';
import { PortalType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PortalType>(PortalType.INDIVIDUAL);
  const [individualKey, setIndividualKey] = useState(0);

  const handleTabChange = (tab: PortalType) => {
    if (tab === PortalType.INDIVIDUAL && activeTab === PortalType.INDIVIDUAL) {
      // Force reset of Individual Portal if already active (acting as Home/Reset)
      setIndividualKey(prev => prev + 1);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="relative z-10">
        {activeTab === PortalType.INDIVIDUAL ? (
          <IndividualPortal key={`individual-${individualKey}`} />
        ) : (
          <EnterprisePortal />
        )}
      </main>

      <Footer />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${activeTab === PortalType.INDIVIDUAL ? 'bg-cyan-500' : 'bg-green-600'}`}></div>
        <div className={`absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10 transition-colors duration-1000 ${activeTab === PortalType.INDIVIDUAL ? 'bg-blue-600' : 'bg-emerald-600'}`}></div>
      </div>
    </div>
  );
};

export default App;