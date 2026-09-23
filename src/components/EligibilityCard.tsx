import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VerificationRecord, ZKProofResult } from '../../contract/src/types';

interface EligibilityCardProps {
  record: VerificationRecord;
  proof: ZKProofResult;
  threshold: number;
  userAddress: string;
  onReset: () => void;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  record,
  proof,
  userAddress,
  onReset,
}) => {
  useEffect(() => {
    if (record.isEligible) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#D83A20', '#121316', '#71717A'],
          disableForReducedMotion: true,
        });
      } catch (err) {
        // Safe fallback in test or restricted environments
      }
    }
  }, [record.isEligible]);

  const dateString = new Date(record.timestamp * 1000).toUTCString();

  return (
    <div className="border border-editorial-border dark:border-editorial-borderDark bg-editorial-surface dark:bg-editorial-surfaceDark p-8 relative overflow-hidden">
      {/* Editorial Status Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 hairline-b gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-editorial-accent uppercase block mb-1">
            ON-CHAIN ATTESTATION / STEP 03
          </span>
          <h3 className="font-serif text-3xl font-normal text-editorial-ink dark:text-editorial-inkDark">
            {record.isEligible ? 'Eligibility Attested' : 'Requirement Not Satisfied'}
          </h3>
        </div>

        {/* High-Contrast Typographic Status Badge */}
        <div
          className={`inline-flex items-center space-x-2 px-3.5 py-1.5 font-mono text-xs tracking-wider uppercase border ${
            record.isEligible
              ? 'border-emerald-700 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-editorial-accent text-editorial-accent bg-editorial-accent/5'
          }`}
        >
          {record.isEligible ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED: AGE ≥ {record.thresholdTested}</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" />
              <span>INELIGIBLE: AGE &lt; {record.thresholdTested}</span>
            </>
          )}
        </div>
      </div>

      {/* Narrative Privacy Guarantee */}
      <div className="mb-8 p-4 border border-editorial-border dark:border-editorial-borderDark bg-neutral-50 dark:bg-neutral-900/30 text-xs font-mono space-y-2">
        <div className="flex items-center space-x-2 text-editorial-ink dark:text-editorial-inkDark font-semibold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-editorial-accent" />
          <span>Zero-Knowledge Privacy Proof Guarantee</span>
        </div>
        <p className="text-editorial-muted dark:text-editorial-mutedDark font-sans leading-relaxed">
          The Midnight blockchain consensus layer has verified the mathematical proof and
          recorded a binary truth statement for your wallet. Your raw age was never sent,
          never logged on-chain, and remains completely unknown to miners, indexers, and observers.
        </p>
      </div>

      {/* Attestation Technical Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-8">
        <div className="p-3 border border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark uppercase tracking-wider mb-1">
            ATTESTED WALLET
          </div>
          <div className="text-editorial-ink dark:text-editorial-inkDark break-all font-mono">
            {userAddress}
          </div>
        </div>

        <div className="p-3 border border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark uppercase tracking-wider mb-1">
            TIMESTAMP (UTC)
          </div>
          <div className="text-editorial-ink dark:text-editorial-inkDark font-mono">
            {dateString}
          </div>
        </div>

        <div className="p-3 border border-editorial-border dark:border-editorial-borderDark md:col-span-2">
          <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark uppercase tracking-wider mb-1">
            PROOF COMMITMENT HASH (SHA-256)
          </div>
          <div className="text-editorial-ink dark:text-editorial-inkDark break-all font-mono text-[11px]">
            {record.proofCommitment}
          </div>
        </div>

        <div className="p-3 border border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark uppercase tracking-wider mb-1">
            CONTRACT ADDRESS (DEVNET)
          </div>
          <div className="text-editorial-ink dark:text-editorial-inkDark font-mono text-[11px] break-all">
            0x7f4a21c99fbd8e32c842b10a9901ef45b23d91ae
          </div>
        </div>

        <div className="p-3 border border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark uppercase tracking-wider mb-1">
            PROVING LATENCY
          </div>
          <div className="text-editorial-ink dark:text-editorial-inkDark font-mono">
            {proof.provingTimeMs} ms (Client-Side R1CS)
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 hairline-t">
        <div className="text-[11px] font-mono text-editorial-muted dark:text-editorial-mutedDark">
          Ledger Protocol: <span className="text-editorial-ink dark:text-editorial-inkDark">Compact v0.18</span>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-editorial-ink dark:border-editorial-inkDark text-editorial-ink dark:text-editorial-inkDark text-xs font-mono tracking-wider uppercase hover:bg-editorial-ink hover:text-editorial-bg dark:hover:bg-editorial-inkDark dark:hover:text-editorial-bgDark transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Verify Another Identity</span>
        </button>
      </div>
    </div>
  );
};
