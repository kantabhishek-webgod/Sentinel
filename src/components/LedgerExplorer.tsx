import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { SentinelLedgerState, VerificationRecord } from '../../contract/src/types';
import { contractService } from '../services/contractService';

interface LedgerExplorerProps {
  lastUpdated: number;
}

export const LedgerExplorer: React.FC<LedgerExplorerProps> = ({ lastUpdated }) => {
  const [ledgerState, setLedgerState] = useState<SentinelLedgerState>(() =>
    contractService.getLedgerState()
  );
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [queriedRecord, setQueriedRecord] = useState<{
    found: boolean;
    record: VerificationRecord | null;
  } | null>(null);

  useEffect(() => {
    setLedgerState(contractService.getLedgerState());
  }, [lastUpdated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAddress.trim()) {
      setQueriedRecord(null);
      return;
    }
    const cleanAddress = searchAddress.trim();
    const record = contractService.queryStatus(cleanAddress);
    setQueriedRecord({
      found: !!record,
      record,
    });
  };

  const verificationsList = Object.entries(ledgerState.verifications);

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-12 hairline-t">
      {/* Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 hairline-b">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase block mb-1 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ON-CHAIN • MIDNIGHT PREPROD
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-editorial-ink dark:text-editorial-inkDark">
            Midnight Ledger Explorer
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-editorial-muted dark:text-editorial-mutedDark mt-2 sm:mt-0">
          <span>ATTESTATIONS: <strong className="text-editorial-ink dark:text-editorial-inkDark">{ledgerState.totalEligibleCount}</strong></span>
          <span>•</span>
          <span>THRESHOLD: <strong className="text-editorial-ink dark:text-editorial-inkDark">{ledgerState.minimumAgeThreshold}Y</strong></span>
        </div>
      </div>

      {/* On-Chain Contract Address Banner */}
      <div className="mb-6 p-3 bg-neutral-50 dark:bg-neutral-900/60 border border-editorial-border dark:border-editorial-borderDark flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider text-editorial-muted dark:text-editorial-mutedDark font-semibold shrink-0">CONTRACT:</span>
          <span className="font-mono text-editorial-ink dark:text-editorial-inkDark truncate text-[11px]" title="0x171167e62bac7ce43414b8fa8dc46aa28225087e0f1b590c31153d530a3cdd42">
            0x171167e62bac7ce43414b8fa8dc46aa28225087e0f1b590c31153d530a3cdd42
          </span>
        </div>
        <a
          href="https://preprod.midnightexplorer.com/contracts/0x171167e62bac7ce43414b8fa8dc46aa28225087e0f1b590c31153d530a3cdd42"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-editorial-ink dark:bg-editorial-inkDark text-editorial-bg dark:text-editorial-bgDark text-[11px] uppercase tracking-wider hover:bg-editorial-accent hover:text-white transition-colors shrink-0"
        >
          View On Explorer ↗
        </a>
      </div>

      {/* Query Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Query any wallet address on Sentinel ledger (e.g. 0x94f1c...)"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-transparent border border-editorial-border dark:border-editorial-borderDark text-xs font-mono text-editorial-ink dark:text-editorial-inkDark focus:outline-none focus:border-editorial-ink dark:focus:border-editorial-inkDark placeholder:text-neutral-400"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-editorial-ink text-editorial-bg dark:bg-editorial-inkDark dark:text-editorial-bgDark text-xs font-mono tracking-wider uppercase hover:bg-editorial-accent hover:text-white transition-colors"
          >
            Query Ledger
          </button>
        </div>
      </form>

      {/* Query Search Result */}
      {queriedRecord && (
        <div className="mb-8 p-4 border border-editorial-border dark:border-editorial-borderDark bg-editorial-surface dark:bg-editorial-surfaceDark text-xs font-mono">
          <div className="text-[10px] text-editorial-accent uppercase tracking-wider mb-2 font-semibold">
            Query Search Result
          </div>
          {queriedRecord.found && queriedRecord.record ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-editorial-muted dark:text-editorial-mutedDark">STATUS:</span>
                <span
                  className={
                    queriedRecord.record.isEligible
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-editorial-accent font-semibold'
                  }
                >
                  {queriedRecord.record.isEligible ? 'ELIGIBLE (Age ≥ 18)' : 'INELIGIBLE (Age < 18)'}
                </span>
              </div>
              <div>
                <span className="text-editorial-muted dark:text-editorial-mutedDark">COMMITMENT:</span>{' '}
                <span className="break-all">{queriedRecord.record.proofCommitment}</span>
              </div>
              <div>
                <span className="text-editorial-muted dark:text-editorial-mutedDark">ATTESTED AT:</span>{' '}
                <span>{new Date(queriedRecord.record.timestamp * 1000).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-editorial-muted dark:text-editorial-mutedDark">
              No verification record found on Midnight ledger for this address.
            </div>
          )}
        </div>
      )}

      {/* Recent Ledger Verifications Feed */}
      <div className="border border-editorial-border dark:border-editorial-borderDark overflow-hidden">
        <div className="p-3 bg-neutral-100 dark:bg-neutral-900 hairline-b text-[11px] font-mono uppercase tracking-wider text-editorial-ink dark:text-editorial-inkDark flex justify-between items-center">
          <span>Active Attestations on Devnet</span>
          <span className="text-editorial-muted dark:text-editorial-mutedDark">
            {verificationsList.length} RECORD(S)
          </span>
        </div>

        {verificationsList.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-editorial-muted dark:text-editorial-mutedDark">
            No attestations committed yet. Generate your first zero-knowledge proof above.
          </div>
        ) : (
          <div className="divide-y divide-editorial-border dark:divide-editorial-borderDark">
            {verificationsList.map(([addr, rec]) => (
              <div key={addr} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="space-y-1">
                  <div className="font-semibold text-editorial-ink dark:text-editorial-inkDark break-all">
                    {addr}
                  </div>
                  <div className="text-[11px] text-editorial-muted dark:text-editorial-mutedDark">
                    Commitment: {rec.proofCommitment.slice(0, 18)}...
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 border text-[10px] uppercase tracking-wider ${
                      rec.isEligible
                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20'
                        : 'border-editorial-accent text-editorial-accent bg-editorial-accent/5'
                    }`}
                  >
                    {rec.isEligible ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{rec.isEligible ? 'Eligible' : 'Ineligible'}</span>
                  </span>
                  <span className="text-[10px] text-editorial-muted dark:text-editorial-mutedDark mt-1">
                    {new Date(rec.timestamp * 1000).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
