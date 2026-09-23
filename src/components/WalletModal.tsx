import React from 'react';
import { X, Wallet } from 'lucide-react';
import { walletService } from '../services/walletService';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLaceDetected: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  isLaceDetected,
}) => {
  if (!isOpen) return null;

  const handleConnectLace = async () => {
    try {
      await walletService.connectLace();
      onClose();
    } catch (err: unknown) {
      alert((err as Error)?.message || 'Failed to connect Midnight Lace');
    }
  };

  const handleSelectDevnetAccount = (account: 'alice' | 'bob' | 'charlie') => {
    walletService.connectDevnetAccount(account);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-editorial-surface dark:bg-editorial-surfaceDark border border-editorial-border dark:border-editorial-borderDark shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 hairline-b mb-6">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-editorial-accent" />
            <h3 className="font-serif text-lg font-medium text-editorial-ink dark:text-editorial-inkDark">
              Connect Midnight Wallet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-ink dark:hover:text-editorial-inkDark transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Midnight Lace Option */}
        <div className="mb-6 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-editorial-muted dark:text-editorial-mutedDark">
            PRIMARY CONNECTOR
          </div>
          <button
            onClick={handleConnectLace}
            className="w-full p-4 border border-editorial-ink dark:border-editorial-inkDark bg-editorial-ink dark:bg-editorial-inkDark text-editorial-bg dark:text-editorial-bgDark text-left hover:bg-editorial-accent dark:hover:bg-editorial-accent hover:border-editorial-accent transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-mono text-xs font-semibold tracking-wider uppercase">
                Midnight Lace Wallet
              </div>
              <div className="text-[11px] opacity-80 font-sans mt-0.5">
                Official browser extension for Midnight Network
              </div>
            </div>
            {isLaceDetected ? (
              <span className="text-[10px] font-mono px-2 py-0.5 border border-white/40 uppercase">
                DETECTED
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 border border-white/20 opacity-70 uppercase">
                EXTENSION
              </span>
            )}
          </button>
        </div>

        {/* Local Devnet Simulated Accounts */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-widest text-editorial-muted dark:text-editorial-mutedDark">
            LOCAL DEVNET SIMULATED ACCOUNTS
          </div>
          <p className="text-[11px] font-sans text-editorial-muted dark:text-editorial-mutedDark leading-normal">
            For local review and automated evaluation without the Lace browser extension:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <button
              onClick={() => handleSelectDevnetAccount('alice')}
              className="w-full p-3 border border-editorial-border dark:border-editorial-borderDark text-left hover:border-editorial-ink dark:hover:border-editorial-inkDark transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-editorial-ink dark:text-editorial-inkDark">
                  Alice (Primary Test Wallet)
                </div>
                <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark">
                  0x94f1c3...d6e7 • 1,420.50 tDUST
                </div>
              </div>
              <span className="text-[10px] text-editorial-accent">SELECT</span>
            </button>

            <button
              onClick={() => handleSelectDevnetAccount('bob')}
              className="w-full p-3 border border-editorial-border dark:border-editorial-borderDark text-left hover:border-editorial-ink dark:hover:border-editorial-inkDark transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-editorial-ink dark:text-editorial-inkDark">
                  Bob (Secondary Test Wallet)
                </div>
                <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark">
                  0x3b8d2e...0c1d • 890.00 tDUST
                </div>
              </div>
              <span className="text-[10px] text-editorial-accent">SELECT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
