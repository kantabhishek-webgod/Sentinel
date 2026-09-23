/**
 * Midnight Lace Wallet Connector Service
 * Interfaces with window.midnight?.mnLace DApp API
 */

import { WalletState } from '../../contract/src/types';

export class WalletService {
  private static instance: WalletService;
  private state: WalletState = {
    connected: false,
    address: null,
    balance: null,
    network: 'devnet-local',
    isLaceDetected: false,
  };

  private listeners: Array<(state: WalletState) => void> = [];

  private constructor() {
    this.checkLaceAvailability();
  }

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Detects presence of Midnight Lace wallet extension in the window object
   */
  public checkLaceAvailability(): boolean {
    const isDetected = typeof window !== 'undefined' && !!window.midnight?.mnLace;
    this.state.isLaceDetected = isDetected;
    this.notify();
    return isDetected;
  }

  public getState(): WalletState {
    return { ...this.state };
  }

  public subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Connects to Midnight Lace wallet extension
   */
  public async connectLace(): Promise<WalletState> {
    if (typeof window !== 'undefined' && window.midnight?.mnLace) {
      try {
        const lace = await window.midnight.mnLace.enable();
        const address = await lace.getPublicAddress();

        this.state = {
          connected: true,
          address,
          balance: '2,500.00 tDUST',
          network: 'devnet-local',
          isLaceDetected: true,
        };
        this.notify();
        return this.state;
      } catch (err: unknown) {
        console.error('Failed to enable Midnight Lace Wallet:', err);
        throw new Error((err as Error)?.message || 'Failed to connect Midnight Lace Wallet');
      }
    } else {
      throw new Error(
        'Midnight Lace Wallet extension was not detected. Please install Lace or select a Devnet Test Account below.'
      );
    }
  }

  /**
   * Connects to a standard deterministic Devnet Test Account for local testing
   */
  public connectDevnetAccount(alias: 'alice' | 'bob' | 'charlie' = 'alice'): WalletState {
    const testAccounts: Record<string, { address: string; balance: string }> = {
      alice: {
        address: '0x94f1c3a8e2b7d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
        balance: '1,420.50 tDUST',
      },
      bob: {
        address: '0x3b8d2e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
        balance: '890.00 tDUST',
      },
      charlie: {
        address: '0x5c7e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
        balance: '3,100.25 tDUST',
      },
    };

    const target = testAccounts[alias] || testAccounts.alice;

    this.state = {
      connected: true,
      address: target.address,
      balance: target.balance,
      network: 'devnet-local',
      isLaceDetected: this.state.isLaceDetected,
    };
    this.notify();
    return this.state;
  }

  /**
   * Disconnects current session
   */
  public disconnect(): void {
    this.state = {
      connected: false,
      address: null,
      balance: null,
      network: 'devnet-local',
      isLaceDetected: this.state.isLaceDetected,
    };
    this.notify();
  }
}

export const walletService = WalletService.getInstance();
