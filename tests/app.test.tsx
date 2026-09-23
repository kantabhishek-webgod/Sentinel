import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { walletService } from '../src/services/walletService';

describe('Sentinel Frontend Application Suite', () => {
  beforeEach(() => {
    walletService.disconnect();
    localStorage.clear();
  });

  it('renders Sentinel header, brand tagline, and protocol specification', () => {
    render(<App />);

    // Brand and tagline
    const sentinelBrands = screen.getAllByText('SENTINEL');
    expect(sentinelBrands.length).toBeGreaterThanOrEqual(1);

    const taglines = screen.getAllByText(/Standing guard over what/i);
    expect(taglines.length).toBeGreaterThanOrEqual(1);
    const subTaglines = screen.getAllByText(/shouldn't be seen/i);
    expect(subTaglines.length).toBeGreaterThanOrEqual(1);

    // Verify presence of gate section
    expect(screen.getByText('Age Verification Gate')).toBeInTheDocument();
  });

  it('opens and closes the Selective Disclosure Privacy Model modal', async () => {
    render(<App />);

    // Click "SELECTIVE DISCLOSURE MODEL" button in header
    const privacyBtn = screen.getByText('SELECTIVE DISCLOSURE MODEL');
    fireEvent.click(privacyBtn);

    // Modal title should appear
    expect(screen.getByText('How Sentinel Stays Private')).toBeInTheDocument();
    expect(screen.getByText(/Traditional identity systems force users/i)).toBeInTheDocument();
    
    // Multiple rows prove permanent privacy of raw data
    const privateBadges = screen.getAllByText('PERMANENTLY PRIVATE');
    expect(privateBadges.length).toBeGreaterThanOrEqual(1);

    // Close modal
    const closeBtn = screen.getByText('I Understand the Privacy Model');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('How Sentinel Stays Private')).not.toBeInTheDocument();
    });
  });

  it('toggles theme between light and dark mode', () => {
    render(<App />);

    const themeToggleBtn = screen.getByLabelText('Toggle theme');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark
    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('sentinel_theme')).toBe('dark');

    // Toggle back to light
    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('sentinel_theme')).toBe('light');
  });

  it('connects a devnet wallet account and reflects identity in the UI', async () => {
    render(<App />);

    // Open wallet modal
    const connectBtn = screen.getByRole('button', { name: /CONNECT LACE/i });
    fireEvent.click(connectBtn);

    expect(screen.getByText('Connect Midnight Wallet')).toBeInTheDocument();

    // Click Alice devnet account
    const aliceBtn = screen.getByText('Alice (Primary Test Wallet)');
    fireEvent.click(aliceBtn);

    // Modal should close and header should show connected address
    await waitFor(() => {
      expect(screen.getByText(/0x94f1\.\.\.d6e7/)).toBeInTheDocument();
      expect(screen.getByText('1,420.50 tDUST')).toBeInTheDocument();
    });
  });
});
