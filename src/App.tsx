import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VerificationFlow } from './components/VerificationFlow';
import { LedgerExplorer } from './components/LedgerExplorer';
import { PrivacyExplainerModal } from './components/PrivacyExplainerModal';
import { WalletModal } from './components/WalletModal';
import { Footer } from './components/Footer';
import { walletService } from './services/walletService';
import { contractService } from './services/contractService';
import { WalletState } from '../contract/src/types';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sentinel_theme');
      if (saved) return saved === 'dark';
      return false; // Default to pristine Swiss editorial light theme
    }
    return false;
  });

  const [walletState, setWalletState] = useState<WalletState>(() => walletService.getState());
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [threshold] = useState<number>(() => contractService.getThreshold());

  useEffect(() => {
    const unsubscribe = walletService.subscribe((state) => {
      setWalletState(state);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sentinel_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sentinel_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleScrollToGate = () => {
    const el = document.getElementById('verification-gate');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVerificationComplete = () => {
    setLastUpdated(Date.now());
  };

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg dark:bg-editorial-bgDark text-editorial-ink dark:text-editorial-inkDark transition-colors">
      <Header
        walletState={walletState}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={() => walletService.disconnect()}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      <main className="flex-grow">
        <Hero
          threshold={threshold}
          onScrollToGate={handleScrollToGate}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        />

        <VerificationFlow
          walletState={walletState}
          onConnectWallet={() => setIsWalletModalOpen(true)}
          threshold={threshold}
          onVerificationComplete={handleVerificationComplete}
        />

        <LedgerExplorer lastUpdated={lastUpdated} />
      </main>

      <Footer />

      {/* Modals */}
      <PrivacyExplainerModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        threshold={threshold}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        isLaceDetected={walletState.isLaceDetected}
      />
    </div>
  );
};

export default App;
