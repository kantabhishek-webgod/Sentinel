import { describe, it, expect } from 'vitest';
import { SentinelZKCircuit } from '../contract/src/zkCircuit';
import { SentinelWitness, ZKProofResult } from '../contract/src/types';

describe('Sentinel Cryptographic Credential & Tamper-Proofing Suite', () => {
  const aliceAddress = '0x94f1c3a8e2b7d4e5f6a7b8c9d0e1f2a3b4c5d6e7';
  const sampleEntropy = '0xa1b2c3d4e5f60718293a4b5c6d7e8f90';

  it('generates unique cryptographic commitments for different entropy seeds', async () => {
    const witness1: SentinelWitness = {
      privateAge: 25,
      userAddress: aliceAddress,
      entropy: sampleEntropy,
    };

    const witness2: SentinelWitness = {
      privateAge: 25,
      userAddress: aliceAddress,
      entropy: '0xffeeddccbbaa99887766554433221100',
    };

    const proof1 = await SentinelZKCircuit.generateProof(witness1, 18);
    // Add small delay to ensure distinct epoch second
    await new Promise((r) => setTimeout(r, 10));
    const proof2 = await SentinelZKCircuit.generateProof(witness2, 18);

    expect(proof1.proofData.commitment).not.toBe(proof2.proofData.commitment);
    expect(proof1.proofData.commitment).toMatch(/^0x[0-9a-fA-F]{32}$/);
    expect(proof2.proofData.commitment).toMatch(/^0x[0-9a-fA-F]{32}$/);
  });

  it('verifies that proof points (a, b, c) are structurally well-formed', async () => {
    const witness: SentinelWitness = {
      privateAge: 30,
      userAddress: aliceAddress,
      entropy: sampleEntropy,
    };

    const proof = await SentinelZKCircuit.generateProof(witness, 18);

    // Verify Groth16 / Plonk simulation structures
    expect(proof.proofData.a).toHaveLength(2);
    expect(proof.proofData.b).toHaveLength(2);
    expect(proof.proofData.b[0]).toHaveLength(2);
    expect(proof.proofData.b[1]).toHaveLength(2);
    expect(proof.proofData.c).toHaveLength(2);
    expect(SentinelZKCircuit.verifyProof(proof)).toBe(true);
  });

  it('rejects tampered or malformed proof objects', () => {
    const invalidProof: ZKProofResult = {
      isEligible: true,
      publicInputs: {
        threshold: 18,
        userAddress: aliceAddress,
        timestamp: Math.floor(Date.now() / 1000),
      },
      proofData: {
        a: ['0xinvalid', '0xinvalid'],
        b: [['0x0', '0x1'], ['0x2', '0x3']],
        c: ['0x0', '0x1'],
        commitment: 'invalid_commitment_format', // Must start with 0x and be 34 chars
      },
      provingTimeMs: 40,
    };

    expect(SentinelZKCircuit.verifyProof(invalidProof)).toBe(false);
  });

  it('detects tampering of public inputs after proof synthesis', async () => {
    const witness: SentinelWitness = {
      privateAge: 21,
      userAddress: aliceAddress,
      entropy: sampleEntropy,
    };

    const proof = await SentinelZKCircuit.generateProof(witness, 18);

    // Attacker attempts to change public input threshold to 0
    proof.publicInputs.threshold = 0;
    expect(SentinelZKCircuit.verifyProof(proof)).toBe(false);
  });
});
