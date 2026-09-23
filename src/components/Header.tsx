import React from 'react';
import { Sun, Moon, Shield, Circle } from 'lucide-react';
import { WalletState } from '../../contract/src/types';

interface HeaderProps {
  walletState: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPrivacyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  walletState,
  onConnectWallet,
  onDisconnectWallet,
  isDark,
  onToggleTheme,
  onOpenPrivacyModal,
}) => {
  return (
    <header className="w-full bg-editorial-bg dark:bg-editorial-bgDark hairline-b sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand & Watchtower Motif */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 flex items-center justify-center border border-editorial-ink dark:border-editorial-inkDark">
            {/* Minimal Geometric Watchtower / Eye Vector Mark */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-editorial-accent fill-none stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="22" strokeWidth="1" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold tracking-tight text-editorial-ink dark:text-editorial-inkDark">
              SENTINEL
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest uppercase px-2 py-0.5 border border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark ml-2">
            ZK-GATE 0.18
          </span>
        </div>

        {/* Center / Privacy Nav */}
        <div className="hidden md:flex items-center space-x-6 text-xs font-mono tracking-wider">
          <button
            onClick={onOpenPrivacyModal}
            className="flex items-center space-x-1.5 text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-accent transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>SELECTIVE DISCLOSURE MODEL</span>
          </button>
          <a
            href="https://explorer.midnight.network/contract/0x7f4a21c99fbd8e32c842b10a9901ef45b23d91ae"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-accent transition-colors"
          >
            <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
            <span>PREPROD / DEVNET EXPLORER</span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center border border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-ink dark:hover:text-editorial-inkDark hover:border-editorial-ink dark:hover:border-editorial-inkDark transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wallet Connection */}
          {walletState.connected && walletState.address ? (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11px] font-mono text-editorial-ink dark:text-editorial-inkDark">
                  {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                </span>
                <span className="text-[10px] font-mono text-editorial-muted dark:text-editorial-mutedDark">
                  {walletState.balance}
                </span>
              </div>
              <button
                onClick={onDisconnectWallet}
                className="px-3 py-1.5 text-xs font-mono border border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-accent hover:border-editorial-accent transition-colors"
              >
                DISCONNECT
              </button>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="px-4 py-1.5 text-xs font-mono font-medium tracking-wider bg-editorial-ink text-editorial-bg dark:bg-editorial-inkDark dark:text-editorial-bgDark hover:bg-editorial-accent hover:text-white dark:hover:bg-editorial-accent dark:hover:text-white transition-colors"
            >
              CONNECT LACE
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
