import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { WalletState, VerificationRecord, ZKProofResult } from '../../contract/src/types';
import { contractService } from '../services/contractService';
import { EligibilityCard } from './EligibilityCard';

interface VerificationFlowProps {
  walletState: WalletState;
  onConnectWallet: () => void;
  threshold: number;
  onVerificationComplete: (record: VerificationRecord, proof: ZKProofResult) => void;
}

type FlowStep = 'INPUT' | 'PROVING' | 'RESULT';

export const VerificationFlow: React.FC<VerificationFlowProps> = ({
  walletState,
  onConnectWallet,
  threshold,
  onVerificationComplete,
}) => {
  const [ageInput, setAgeInput] = useState<string>('');
  const [step, setStep] = useState<FlowStep>('INPUT');
  const [provingPhase, setProvingPhase] = useState<string>('');
  const [provingProgress, setProvingProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeProof, setActiveProof] = useState<ZKProofResult | null>(null);
  const [activeRecord, setActiveRecord] = useState<VerificationRecord | null>(null);

  const handleProve = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!walletState.connected || !walletState.address) {
      setErrorMsg('Please connect your Midnight Lace wallet before generating a proof.');
      return;
    }

    const ageNum = parseInt(ageInput, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
      setErrorMsg('Please specify a plausible human age between 1 and 150.');
      return;
    }

    try {
      setStep('PROVING');
      setProvingProgress(10);
      setProvingPhase('Synthesizing client-side witness...');

      const result = await contractService.executeVerification(
        ageNum,
        walletState.address,
        (phase, progress) => {
          setProvingPhase(phase);
          setProvingProgress(progress);
        }
      );

      setActiveProof(result.proof);
      setActiveRecord(result.record);
      setStep('RESULT');
      onVerificationComplete(result.record, result.proof);
    } catch (err: unknown) {
      console.error('ZK Proving / Submission failed:', err);
      setErrorMsg((err as Error)?.message || 'Proof synthesis or on-chain settlement failed.');
      setStep('INPUT');
    }
  };

  const handleReset = () => {
    setAgeInput('');
    setStep('INPUT');
    setErrorMsg(null);
    setActiveProof(null);
    setActiveRecord(null);
    setProvingProgress(0);
  };

  return (
    <section id="verification-gate" className="w-full max-w-4xl mx-auto px-6 py-12">
      {/* Flow Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 hairline-b">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-editorial-accent uppercase block mb-1">
            CIRCUIT WORKFLOW
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-editorial-ink dark:text-editorial-inkDark">
            Age Verification Gate
          </h2>
        </div>
        <div className="text-xs font-mono text-editorial-muted dark:text-editorial-mutedDark mt-2 sm:mt-0">
          REQUIRED THRESHOLD: <span className="text-editorial-ink dark:text-editorial-inkDark font-semibold">≥{threshold} YEARS</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'INPUT' && (
          <motion.div
            key="input-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border border-editorial-border dark:border-editorial-borderDark bg-editorial-surface dark:bg-editorial-surfaceDark p-8"
          >
            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 pb-6 mb-6 hairline-b text-xs font-mono">
              <div className="text-editorial-ink dark:text-editorial-inkDark font-semibold">
                01 / INPUT WITNESS
              </div>
              <div className="text-editorial-muted dark:text-editorial-mutedDark">
                02 / SYNTHESIS
              </div>
              <div className="text-editorial-muted dark:text-editorial-mutedDark">
                03 / SETTLEMENT
              </div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-6 p-4 border border-editorial-accent/30 bg-editorial-accent/5 flex items-start space-x-3 text-xs font-mono text-editorial-accent">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold uppercase tracking-wider mb-0.5">Execution Alert</div>
                  <div>{errorMsg}</div>
                </div>
              </div>
            )}

            {/* Wallet Not Connected Warning */}
            {!walletState.connected && (
              <div className="mb-6 p-4 border border-editorial-border dark:border-editorial-borderDark bg-neutral-50 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center space-x-2 text-editorial-muted dark:text-editorial-mutedDark">
                  <AlertCircle className="w-4 h-4 text-editorial-accent" />
                  <span>Wallet not connected. Connect Midnight Lace to sign ZK commitments.</span>
                </div>
                <button
                  type="button"
                  onClick={onConnectWallet}
                  className="px-3 py-1.5 bg-editorial-ink text-editorial-bg dark:bg-editorial-inkDark dark:text-editorial-bgDark tracking-wider uppercase text-[11px] hover:bg-editorial-accent transition-colors self-start sm:self-auto"
                >
                  Connect Wallet
                </button>
              </div>
            )}

            <form onSubmit={handleProve} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="age-input" className="text-xs font-mono tracking-wider uppercase text-editorial-ink dark:text-editorial-inkDark">
                    Private Numeric Attribute (Age in Years)
                  </label>
                  <span className="text-[11px] font-mono text-editorial-muted dark:text-editorial-mutedDark flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Isolated in Client RAM</span>
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="age-input"
                    type="number"
                    min="1"
                    max="150"
                    placeholder="e.g. 21"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    disabled={!walletState.connected}
                    className="w-full px-4 py-3 bg-transparent border border-editorial-border dark:border-editorial-borderDark text-editorial-ink dark:text-editorial-inkDark font-mono text-lg focus:outline-none focus:border-editorial-ink dark:focus:border-editorial-inkDark transition-colors placeholder:text-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-3.5 text-xs font-mono text-editorial-muted dark:text-editorial-mutedDark">
                    YEARS
                  </div>
                </div>

                <p className="mt-2 text-[11px] font-sans text-editorial-muted dark:text-editorial-mutedDark leading-normal">
                  Notice: Sentinel takes this numeric input strictly as a client-side witness.
                  The arithmetic circuit produces a proof demonstrating that your age satisfies
                  <span className="font-mono text-editorial-ink dark:text-editorial-inkDark"> age ≥ {threshold} </span>
                  without the raw number ever crossing your local device boundary.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 hairline-t">
                <div className="text-[11px] font-mono text-editorial-muted dark:text-editorial-mutedDark">
                  Connected Identity:{' '}
                  <span className="text-editorial-ink dark:text-editorial-inkDark">
                    {walletState.connected && walletState.address
                      ? `${walletState.address.slice(0, 8)}...${walletState.address.slice(-6)}`
                      : 'None (Connect Lace)'}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!walletState.connected || !ageInput}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-editorial-ink text-editorial-bg dark:bg-editorial-inkDark dark:text-editorial-bgDark text-xs font-mono tracking-widest uppercase hover:bg-editorial-accent hover:text-white dark:hover:bg-editorial-accent dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Generate Zero-Knowledge Proof</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'PROVING' && (
          <motion.div
            key="proving-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border border-editorial-border dark:border-editorial-borderDark bg-editorial-surface dark:bg-editorial-surfaceDark p-8"
          >
            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-2 pb-6 mb-6 hairline-b text-xs font-mono">
              <div className="text-editorial-muted dark:text-editorial-mutedDark">
                01 / INPUT WITNESS
              </div>
              <div className="text-editorial-ink dark:text-editorial-inkDark font-semibold">
                02 / SYNTHESIS
              </div>
              <div className="text-editorial-muted dark:text-editorial-mutedDark">
                03 / SETTLEMENT
              </div>
            </div>

            <div className="py-8 space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-editorial-accent uppercase tracking-widest flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-editorial-accent animate-ping" />
                  <span>ZK-SNARK SYNTHESIS IN PROGRESS</span>
                </span>
                <span className="text-editorial-muted dark:text-editorial-mutedDark tabular-data">
                  {provingProgress}%
                </span>
              </div>

              {/* Minimal Line-Based Progress Bar - Quiet & Precise */}
              <div className="w-full h-1 bg-editorial-border dark:bg-editorial-borderDark overflow-hidden relative">
                <motion.div
                  className="h-full bg-editorial-accent"
                  initial={{ width: '5%' }}
                  animate={{ width: `${provingProgress}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.3 }}
                />
              </div>

              {/* Proving Stage Narrative */}
              <div className="border border-editorial-border dark:border-editorial-borderDark p-4 font-mono text-xs space-y-2 bg-neutral-50 dark:bg-neutral-900/30">
                <div className="flex items-center justify-between text-editorial-muted dark:text-editorial-mutedDark">
                  <span>PHASE:</span>
                  <span className="text-editorial-ink dark:text-editorial-inkDark">{provingPhase}</span>
                </div>
                <div className="flex items-center justify-between text-editorial-muted dark:text-editorial-mutedDark">
                  <span>CIRCUIT CONSTRAINT:</span>
                  <span className="text-editorial-ink dark:text-editorial-inkDark">inequality(witness.age ≥ {threshold})</span>
                </div>
                <div className="flex items-center justify-between text-editorial-muted dark:text-editorial-mutedDark">
                  <span>WITNESS STORAGE:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">Isolated Client Memory (Non-Disclosed)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'RESULT' && activeRecord && activeProof && (
          <motion.div
            key="result-step"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <EligibilityCard
              record={activeRecord}
              proof={activeProof}
              threshold={threshold}
              userAddress={walletState.address || ''}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
