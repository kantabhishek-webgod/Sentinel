/**
 * Sentinel Data Types & Ledger Schema
 * Midnight Blockchain Smart Contract Bindings
 */

export type Address = string;

/**
 * Public Verification Record stored on the Midnight Ledger
 * Note: Contains NO raw private age or birthdate!
 */
export interface VerificationRecord {
  isEligible: boolean;
  thresholdTested: number;
  timestamp: number;
  proofCommitment: string;
}

/**
 * Midnight Public Ledger State for Sentinel
 */
export interface SentinelLedgerState {
  admin: Address;
  minimumAgeThreshold: number;
  verifications: Record<Address, VerificationRecord>;
  totalEligibleCount: number;
  protocolVersion: number;
}

/**
 * Private Witness: Client-side only. NEVER leaves browser memory unencrypted!
 */
export interface SentinelWitness {
  privateAge: number;
  userAddress: Address;
  entropy: string;
}

/**
 * Public inputs exposed alongside the ZK proof
 */
export interface ZKPublicInputs {
  threshold: number;
  userAddress: Address;
  timestamp: number;
}

/**
 * Cryptographic Proof Elements (Groth16 / Plonk simulation)
 */
export interface ZKProofData {
  a: [string, string];
  b: [[string, string], [string, string]];
  c: [string, string];
  commitment: string;
}

/**
 * Result returned by the client-side ZK Prover
 */
export interface ZKProofResult {
  isEligible: boolean;
  publicInputs: ZKPublicInputs;
  proofData: ZKProofData;
  provingTimeMs: number;
}

export type NetworkType = 'devnet-local' | 'testnet-remote' | 'mainnet';

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
  network: NetworkType;
  isLaceDetected: boolean;
}
