import React from 'react';
import { ArrowDownRight, Lock, EyeOff, ShieldCheck } from 'lucide-react';

interface HeroProps {
  threshold: number;
  onScrollToGate: () => void;
  onOpenPrivacyModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  threshold,
  onScrollToGate,
  onOpenPrivacyModal,
}) => {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 pt-16 pb-12 hairline-b">
      {/* Editorial Meta Header */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono tracking-widest text-editorial-muted dark:text-editorial-mutedDark uppercase mb-8">
        <div>PROTOCOL / AGE & ELIGIBILITY GATE</div>
        <div className="flex items-center space-x-2">
          <span>MIDNIGHT COMPACT 0.18</span>
          <span>•</span>
          <span>THRESHOLD: ≥{threshold} YEARS</span>
        </div>
      </div>

      {/* Main Confident Headline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
        <div className="lg:col-span-8">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-editorial-ink dark:text-editorial-inkDark">
            Standing guard over what{' '}
            <span className="italic font-light text-editorial-accent">
              shouldn&apos;t be seen.
            </span>
          </h1>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-end space-y-4">
          <p className="text-sm font-sans leading-relaxed text-editorial-muted dark:text-editorial-mutedDark">
            Sentinel proves numeric eligibility criteria on Midnight using zero-knowledge
            circuits. Prove you meet requirements without ever exposing your exact age,
            date of birth, or identity documents to any observer.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onScrollToGate}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-editorial-ink text-editorial-bg dark:bg-editorial-inkDark dark:text-editorial-bgDark text-xs font-mono tracking-wider hover:bg-editorial-accent hover:text-white dark:hover:bg-editorial-accent dark:hover:text-white transition-colors"
            >
              <span>PROVE ELIGIBILITY</span>
              <ArrowDownRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenPrivacyModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 border border-editorial-border dark:border-editorial-borderDark text-xs font-mono tracking-wider text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-ink dark:hover:text-editorial-inkDark hover:border-editorial-ink dark:hover:border-editorial-inkDark transition-colors"
            >
              <span>READ MODEL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Structural Three-Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-editorial-border dark:border-editorial-borderDark text-xs">
        <div className="p-6 md:border-r border-b md:border-b-0 border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] font-mono text-editorial-accent tracking-widest uppercase mb-2">
            01 / CLIENT WITNESS
          </div>
          <h3 className="font-serif text-base font-medium text-editorial-ink dark:text-editorial-inkDark mb-2 flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-editorial-accent" />
            <span>Ephemeral Local Witness</span>
          </h3>
          <p className="text-editorial-muted dark:text-editorial-mutedDark leading-relaxed">
            Your exact age lives strictly within your local browser memory. It is ingested
            into private witness wires and never transmitted across the network.
          </p>
        </div>

        <div className="p-6 md:border-r border-b md:border-b-0 border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] font-mono text-editorial-accent tracking-widest uppercase mb-2">
            02 / ZERO-KNOWLEDGE PROOF
          </div>
          <h3 className="font-serif text-base font-medium text-editorial-ink dark:text-editorial-inkDark mb-2 flex items-center space-x-2">
            <EyeOff className="w-3.5 h-3.5 text-editorial-accent" />
            <span>Cryptographic Proof</span>
          </h3>
          <p className="text-editorial-muted dark:text-editorial-mutedDark leading-relaxed">
            A zero-knowledge circuit evaluates <code className="font-mono text-editorial-ink dark:text-editorial-inkDark">age ≥ {threshold}</code>.
            Only the mathematical proof of satisfaction leaves your browser.
          </p>
        </div>

        <div className="p-6 p-6 border-editorial-border dark:border-editorial-borderDark">
          <div className="text-[10px] font-mono text-editorial-accent tracking-widest uppercase mb-2">
            03 / MIDNIGHT SETTLEMENT
          </div>
          <h3 className="font-serif text-base font-medium text-editorial-ink dark:text-editorial-inkDark mb-2 flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-editorial-accent" />
            <span>Public Attestation</span>
          </h3>
          <p className="text-editorial-muted dark:text-editorial-mutedDark leading-relaxed">
            Midnight ledger records an immutable boolean outcome for your wallet.
            Observers can verify you qualify without knowing whether you are 19 or 65.
          </p>
        </div>
      </div>
    </section>
  );
};
