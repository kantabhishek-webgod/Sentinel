/**
 * Sentinel Contract Service
 * Bridges client-side witness runtime, ZK arithmetic circuits, and Midnight ledger
 */

import { SentinelContract } from '../../contract/src/sentinelContract';
import { SentinelZKCircuit } from '../../contract/src/zkCircuit';
import {
  VerificationRecord,
  SentinelLedgerState,
  ZKProofResult,
  SentinelWitness
} from '../../contract/src/types';

class ContractService {
  private contract: SentinelContract;
  private readonly defaultThreshold = 18;

  constructor() {
    this.contract = new SentinelContract(this.defaultThreshold);
  }

  /**
   * Retrieves active ledger threshold (e.g. 18)
   */
  public getThreshold(): number {
    return this.contract.getThreshold();
  }

  /**
   * Retrieves full public ledger state snapshot
   */
  public getLedgerState(): Readonly<SentinelLedgerState> {
    return this.contract.getLedgerState();
  }

  /**
   * Queries existing verification status for a wallet address
   */
  public queryStatus(userAddress: string): VerificationRecord | null {
    return this.contract.queryStatus(userAddress);
  }

  /**
   * Executes the full End-to-End Privacy Flow:
   * 1. Forms private witness in client memory (NEVER exposed to network)
   * 2. Synthesizes ZK-SNARK arithmetic proof
   * 3. Submits proof and public inputs to Midnight ledger
   * 4. Updates public ledger state
   */
  public async executeVerification(
    privateAge: number,
    userAddress: string,
    onProgress?: (phase: string, progress: number) => void
  ): Promise<{ proof: ZKProofResult; record: VerificationRecord }> {
    onProgress?.('Synthesizing private witness into arithmetic gates...', 25);
    await new Promise((r) => setTimeout(r, 200));

    // Generate random entropy for commitment salt
    const entropy = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const witness: SentinelWitness = {
      privateAge,
      userAddress,
      entropy,
    };

    onProgress?.('Evaluating polynomial constraints & generating ZK proof...', 55);
    const threshold = this.getThreshold();
    const proof = await SentinelZKCircuit.generateProof(witness, threshold);

    onProgress?.('Verifying proof commitment & broadcasting to Midnight ledger...', 85);
    await new Promise((r) => setTimeout(r, 250));

    // Submit proof to Midnight contract
    const record = this.contract.verifyAgeEligibility(proof);

    onProgress?.('Attestation committed to Midnight ledger', 100);
    return { proof, record };
  }

  /**
   * Admin circuit: updates the threshold
   */
  public updateThreshold(newThreshold: number, adminAddress: string): void {
    this.contract.updateThreshold(newThreshold, adminAddress);
  }
}

export const contractService = new ContractService();
