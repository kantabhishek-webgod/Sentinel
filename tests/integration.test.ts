import { describe, it, expect } from 'vitest';
import { contractService } from '../src/services/contractService';

describe('Sentinel Contract Service Integration Suite', () => {
  const aliceAddress = '0x94f1c3a8e2b7d4e5f6a7b8c9d0e1f2a3b4c5d6e7';
  const minorAddress = '0x3b8d2e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d';

  it('executes full verification pipeline for an eligible adult (age: 22, threshold: 18)', async () => {
    const progressUpdates: string[] = [];

    const { proof, record } = await contractService.executeVerification(
      22,
      aliceAddress,
      (phase) => {
        progressUpdates.push(phase);
      }
    );

    expect(progressUpdates.length).toBeGreaterThan(0);
    expect(proof.isEligible).toBe(true);
    expect(record.isEligible).toBe(true);
    expect(record.thresholdTested).toBe(18);
    expect(record.proofCommitment).toBeDefined();

    // Query on-chain status
    const queried = contractService.queryStatus(aliceAddress);
    expect(queried).not.toBeNull();
    expect(queried?.isEligible).toBe(true);
    expect(queried?.proofCommitment).toBe(record.proofCommitment);

    // Verify ledger count
    const ledger = contractService.getLedgerState();
    expect(ledger.totalEligibleCount).toBeGreaterThanOrEqual(1);
  });

  it('executes full verification pipeline for a minor (age: 16, threshold: 18) with proper false outcome', async () => {
    const { proof, record } = await contractService.executeVerification(
      16,
      minorAddress
    );

    expect(proof.isEligible).toBe(false);
    expect(record.isEligible).toBe(false);

    // Query status on ledger
    const queried = contractService.queryStatus(minorAddress);
    expect(queried).not.toBeNull();
    expect(queried?.isEligible).toBe(false);
  });
});
