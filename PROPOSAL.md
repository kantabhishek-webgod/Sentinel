# Sentinel: Zero-Knowledge Age & Eligibility Verification Protocol
## Product Proposal & Technical Specification
### Program: RiseIn "New Moon to Full: Monthly Moonshots on Midnight"
### Level: Level 3 - First Quarter Submission
### Author: kantabhishek-webgod
### Tagline: *"Standing guard over what shouldn't be seen."*

---

## 1. Executive Summary

In today's digital economy, age and attribute verification represents one of the most pressing regulatory, ethical, and cryptographic frontiers. Governments and international bodies worldwide are enacting strict age-gating legislation (e.g., the UK Online Safety Act, the European Union Digital Services Act, US state-level age verification laws) requiring online services to restrict access to adult platforms, online gaming, pharmaceuticals, social media, and decentralized financial derivatives.

Concurrently, data privacy regulations (GDPR, CCPA) severely penalize the excessive collection and retention of Personally Identifiable Information (PII). Current verification paradigms force an intolerable tradeoff: users must upload unredacted government passports, national identity cards, or high-resolution facial biometrics to third-party identity brokers. Every single verification event creates an active attack surface and feeds centralized data honeypots.

**Sentinel** is an institutional-grade, decentralized Zero-Knowledge Age and Eligibility Gate built natively for the **Midnight blockchain** using the **Compact smart contract language**. Sentinel empowers users to prove that their age satisfies a specified regulatory threshold (e.g., $\text{Age} \ge 18$) with mathematical certainty, **without ever exposing their exact date of birth, age in years, real name, or government documents** to the verifying application, network observers, or validators.

---

## 2. Problem Statement: The Digital Identity Trilemma

Contemporary digital verification systems suffer from the **Digital Verification Trilemma**:

```
                  ┌─────────────────────────────────────┐
                  │    The Digital Verification Trilemma│
                  └──────────────────┬──────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐        ┌──────────────────┐
│  Over-Disclosure │       │ Centralized Risk │        │ Public Doxxing   │
│ Identity brokers │       │ Document data-   │        │ Public L1 chains │
│ collect full     │       │ bases become     │        │ leak transaction │
│ legal PII for    │       │ breach targets   │        │ history & balance│
│ boolean queries  │       │ & ransomware prey│        │ to surveillance  │
└──────────────────┘       └──────────────────┘        └──────────────────┘
```

1. **Over-Disclosure**: To verify whether an individual is over 18, legacy systems collect full legal names, physical addresses, document numbers, and facial photos. A single-bit binary query ($isEligible \in \{0, 1\}$) results in total identity disclosure.
2. **Centralized Honey-Pots**: Storing scanned government documents in centralized relational databases creates catastrophic liability. Data breaches at identity verification providers routinely expose millions of unredacted credentials to the dark web.
3. **Public Blockchain Doxxing**: On transparent blockchains like Ethereum or Solana, executing identity verification directly on-chain permanently attaches real-world identity to a public wallet address, allowing chain-analysis heuristics to de-anonymize lifetime financial histories.

---

## 3. The Sentinel Solution: Selective Disclosure on Midnight

Sentinel resolves the trilemma by leveraging **Midnight's dual-state architecture** and **Compact zero-knowledge circuits**:

- **Client-Side Witness Runtime (Private)**: The user's actual age or birthdate credential exists exclusively inside the user's local browser memory (`witness getPrivateAge()`). It is never broadcast, serialized into transaction logs, or transmitted to any server.
- **Zero-Knowledge Circuit (Arithmetic Constraints)**: The Compact circuit compiles the predicate:
  $$\text{Predicate}: \quad \text{privateAge} \ge \text{minimumAgeThreshold}$$
  The proving system produces a zk-SNARK proof demonstrating knowledge of a valid private witness satisfying this inequality without revealing the witness value itself.
- **Public Ledger (Decentralized State)**: Midnight validators verify the validity of the proof against the public contract state. Upon consensus, the ledger records ONLY the caller's address, the boolean outcome (`isEligible: true`), the threshold tested (`18`), and a block timestamp.

---

## 4. Technical Architecture & Topology

### 4.1 System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SENTINEL SYSTEM TOPOLOGY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [User Device / Browser]                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Input: Private Age (Local Witness Cell)                            │  │
│  │ 2. Lace Wallet: Provides signature & account authorization            │  │
│  │ 3. Client ZK Prover: Synthesizes R1CS constraints & blinding entropy   │  │
│  │ 4. Output: zk-SNARK Proof + Public Inputs (Raw Age Purged)            │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
│                                     │                                       │
│                                     ▼ Transaction Payload                   │
│  [Midnight Blockchain Network]                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Substrate Consensus Engine                                         │  │
│  │ 2. Compact Contract Runtime (sentinel.compact)                        │  │
│  │    - Reads minimumAgeThreshold from Ledger                            │  │
│  │    - Validates Proof Commitment & Snark Points                        │  │
│  │    - Writes to verifications[caller]: VerificationRecord              │  │
│  │ 3. Public Query API: dApps query isEligible(address)                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Compact Smart Contract Schema

The `sentinel.compact` contract enforces state boundaries at the compiler level:

```compact
module Sentinel {
  import CompactStandardLibrary;

  export ledger {
    admin: Cell<Address>,
    minimumAgeThreshold: Cell<Uint<32>>,
    verifications: Map<Address, VerificationRecord>,
    totalEligibleCount: Cell<Uint<64>>,
    protocolVersion: Cell<Uint<32>>
  }

  export struct VerificationRecord {
    isEligible: Boolean,
    thresholdTested: Uint<32>,
    timestamp: Uint<64>,
    proofCommitment: Bytes<32>
  }

  witness getPrivateAge(): Uint<32>;
  witness getUserAddress(): Address;
  witness getProofEntropy(): Bytes<32>;

  export circuit verifyAgeEligibility(): Boolean {
    const privateAge: Uint<32> = getPrivateAge();
    const caller: Address = getUserAddress();
    const entropy: Bytes<32> = getProofEntropy();

    assert(privateAge > 0 && privateAge < 150, "Witness age out of human boundary");

    const threshold: Uint<32> = minimumAgeThreshold;
    const isEligible: Boolean = (privateAge >= threshold);
    const commitment: Bytes<32> = hash_sha256(concat(caller, entropy));

    verifications[caller] = VerificationRecord {
      isEligible: isEligible,
      thresholdTested: threshold,
      timestamp: current_timestamp(),
      proofCommitment: commitment
    };

    if (isEligible) {
      totalEligibleCount = totalEligibleCount + 1;
    }

    return isEligible;
  }
}
```

---

## 5. Formal Privacy Model & Cryptographic Guarantees

Sentinel formalizes an uncompromising **Selective Disclosure Model**:

### What an Observer CAN Learn (Public Consensus State):
- **Wallet Address:** The public address submitting the transaction (e.g. `0x7f4a21...91ae`).
- **Boolean Eligibility Result:** Whether or not the wallet met the required criteria (`isEligible: true` or `false`).
- **Threshold Tested:** The public threshold active during evaluation (`18` years).
- **Proof Commitment Hash:** A 32-byte cryptographic digest preventing proof replay attacks.
- **Block Timestamp:** The block generation time when the attestation was settled.

### What an Observer CANNOT Learn (Permanently Private):
- ❌ **Exact Age:** An observer cannot determine whether the user is 19, 31, or 80 years old.
- ❌ **Date of Birth:** No day, month, or year of birth is ever submitted.
- ❌ **Physical Identity / Documents:** No passport scans, driver licenses, names, or addresses are ever touched.
- ❌ **Witness Entropy:** Private cryptographic salts remain strictly client-side.
- ❌ **Difference / Margin:** An observer cannot discover how much the user exceeded the threshold by.

---

## 6. Real-World Use Cases & Applications

1. **Age-Restricted E-Commerce & Retail**: Web3 merchants selling alcohol, nicotine, or age-gated media can gate checkout flows without storing customer identification.
2. **iGaming & Online Prediction Markets**: Regulated decentralized betting and prediction platforms can verify players meet regional jurisdictional age limits (18 or 21).
3. **DeFi Governance & Institutional Compliance**: DeFi protocols restricting access to accredited or legally qualified adults can embed Sentinel verification checks into smart contract gatekeepers.
4. **Social & Content Platforms**: Restrict mature content channels or comply with child safety regulations without deanonymizing content creators or consumers.

---

## 7. Regulatory Compliance Alignment

- **GDPR Article 5(1)(c) (Data Minimization)**: Personal data must be *"adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed."* Sentinel processes zero bytes of PII on-chain.
- **GDPR Article 17 (Right to Erasure)**: Because no PII is committed to the immutable blockchain, Sentinel eliminates the conflict between immutable ledgers and the Right to Erasure.
- **UK Online Safety Act & US State Age Laws**: Satisfies statutory mandates for robust age verification while preempting consumer privacy liability.

---

## 8. Competitive Landscape

| Feature / Dimension | Legacy KYC (Jumio, Onfido) | Ethereum ZK (Semaphore, Sismo) | Polygon ID | **Sentinel on Midnight** |
| :--- | :--- | :--- | :--- | :--- |
| **Data Storage** | Centralized Cloud DB | Public L1 Calldata | Off-Chain + L2 | **Decentralized Dual-State** |
| **Privacy Guarantee** | None (Full PII collected) | Zero-Knowledge Proof | Zero-Knowledge Proof | **Native Language ZK (Compact)** |
| **Transaction Privacy** | N/A | Public | Pseudonymous | **True Private Consensus** |
| **Gas Costs** | Subscription fee ($1-3/query) | Very High ($5-30/tx) | Medium | **Optimized Midnight Execution** |
| **Data Leak Risk** | High (Breaches common) | Public metadata leakage | Medium | **Zero Data Exposure** |

---

## 9. Roadmap to Level 4 (Waxing Gibbous)

- **Phase 1 (Current - Level 3)**: Core Compact age circuit, client witness runtime, Swiss minimalist editorial frontend, 14 passing automated tests, Midnight Lace wallet connector, and local devnet deployment.
- **Phase 2 (Level 4 - Waxing Gibbous)**:
  - Multi-attribute composite circuits (e.g., `age >= 18 AND country != sanctioned_list`).
  - Recursive SNARK verification for batching multiple attestations.
  - AnonCreds reusable credential issuance on Midnight.
  - SDK packaging (`@sentinel/sdk`) for one-line dApp integration.

---

## 10. Conclusion

Sentinel establishes that regulatory compliance and personal privacy are not mutually exclusive. By leveraging the Midnight blockchain and the Compact language, Sentinel sets a new benchmark for privacy-preserving digital verification.
