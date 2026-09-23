import { describe, it, expect, beforeEach } from 'vitest';
import { SentinelContract } from '../contract/src/sentinelContract';
import { SentinelZKCircuit } from '../contract/src/zkCircuit';
import { SentinelWitness } from '../contract/src/types';

describe('Sentinel Compact Contract & ZK Circuit Suite', () => {
  let contract: SentinelContract;
  const adminAddress = '0x111111111111111111111111111111111111sentinel';
  const aliceAddress = '0xaaaa222233334444555566667777888899990000';
  const bobAddress = '0xbbbb222233334444555566667777888899990000';

  beforeEach(() => {
    // Initialized with default threshold of 18
    contract = new SentinelContract(18, adminAddress);
  });

  describe('ZK Circuit Correctness (age >= threshold)', () => {
    it('should generate valid proof and return isEligible = true when age > threshold (age: 26, threshold: 18)', async () => {
      const witness: SentinelWitness = {
        privateAge: 26,
        userAddress: aliceAddress,
        entropy: '0x99ffeedd11223344',
      };

      const proof = await SentinelZKCircuit.generateProof(witness, contract.getThreshold());

      expect(proof.isEligible).toBe(true);
      expect(proof.publicInputs.threshold).toBe(18);
      expect(proof.publicInputs.userAddress).toBe(aliceAddress);
      expect(proof.proofData.commitment).toBeDefined();

      // Submit to Sentinel contract
      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(true);
      expect(record.thresholdTested).toBe(18);

      // Verify public ledger
      const status = contract.queryStatus(aliceAddress);
      expect(status).not.toBeNull();
      expect(status?.isEligible).toBe(true);
      expect(contract.getLedgerState().totalEligibleCount).toBe(1);
    });

    it('should correctly mark isEligible = false when age < threshold (age: 15, threshold: 18)', async () => {
      const witness: SentinelWitness = {
        privateAge: 15,
        userAddress: bobAddress,
        entropy: '0x1234567890abcdef',
      };

      const proof = await SentinelZKCircuit.generateProof(witness, contract.getThreshold());

      expect(proof.isEligible).toBe(false);

      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(false);

      const status = contract.queryStatus(bobAddress);
      expect(status?.isEligible).toBe(false);
      // Ineligible verifications do NOT increment totalEligibleCount
      expect(contract.getLedgerState().totalEligibleCount).toBe(0);
    });

    it('should correctly evaluate exact boundary condition (age: 18, threshold: 18)', async () => {
      const witness: SentinelWitness = {
        privateAge: 18,
        userAddress: aliceAddress,
        entropy: '0xboundary_exact_18',
      };

      const proof = await SentinelZKCircuit.generateProof(witness, 18);
      expect(proof.isEligible).toBe(true);

      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(true);
    });

    it('should correctly evaluate boundary condition right below threshold (age: 17, threshold: 18)', async () => {
      const witness: SentinelWitness = {
        privateAge: 17,
        userAddress: bobAddress,
        entropy: '0xboundary_under_17',
      };

      const proof = await SentinelZKCircuit.generateProof(witness, 18);
      expect(proof.isEligible).toBe(false);

      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(false);
    });
  });

  describe('Circuit Constraints & Input Sanitization', () => {
    it('should reject invalid human age values (<= 0 or > 150)', async () => {
      const invalidWitnessZero: SentinelWitness = {
        privateAge: 0,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      await expect(
        SentinelZKCircuit.generateProof(invalidWitnessZero, 18)
      ).rejects.toThrow(/ZK Constraint Failure/);

      const invalidWitnessNegative: SentinelWitness = {
        privateAge: -10,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      await expect(
        SentinelZKCircuit.generateProof(invalidWitnessNegative, 18)
      ).rejects.toThrow(/ZK Constraint Failure/);

      const invalidWitnessTooOld: SentinelWitness = {
        privateAge: 180,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      await expect(
        SentinelZKCircuit.generateProof(invalidWitnessTooOld, 18)
      ).rejects.toThrow(/ZK Constraint Failure/);
    });

    it('should reject proof verification if proof threshold does not match contract threshold', async () => {
      const witness: SentinelWitness = {
        privateAge: 25,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      // Generate proof against threshold 21
      const proof = await SentinelZKCircuit.generateProof(witness, 21);

      // Contract is configured for threshold 18 -> should throw mismatch error
      expect(() => contract.verifyAgeEligibility(proof)).toThrow(/Threshold Mismatch/);
    });
  });

  describe('Privacy Guarantee & Selective Disclosure', () => {
    it('MUST NOT leak private age in the public ledger state or verification record', async () => {
      const rawAge = 34;
      const witness: SentinelWitness = {
        privateAge: rawAge,
        userAddress: aliceAddress,
        entropy: '0xsecret_entropy_vault',
      };

      const proof = await SentinelZKCircuit.generateProof(witness, 18);
      const record = contract.verifyAgeEligibility(proof);

      // Check VerificationRecord keys: ONLY isEligible, thresholdTested, timestamp, proofCommitment
      const recordKeys = Object.keys(record);
      expect(recordKeys).not.toContain('privateAge');
      expect(recordKeys).not.toContain('age');

      // Check full serialized ledger
      const serializedLedger = JSON.stringify(contract.getLedgerState());
      expect(serializedLedger).not.toContain(`"privateAge":${rawAge}`);
      expect(serializedLedger).not.toContain(`"age":${rawAge}`);
    });
  });

  describe('Contract Admin & Governance', () => {
    it('should allow admin to update threshold and reject unauthorized updates', () => {
      // Update by authorized admin
      contract.updateThreshold(21, adminAddress);
      expect(contract.getThreshold()).toBe(21);

      // Unauthorized update by Alice
      expect(() => contract.updateThreshold(25, aliceAddress)).toThrow(/Unauthorized/);
    });
  });
});
