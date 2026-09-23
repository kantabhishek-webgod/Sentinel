import React from 'react';
import { X, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface PrivacyExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  threshold: number;
}

export const PrivacyExplainerModal: React.FC<PrivacyExplainerModalProps> = ({
  isOpen,
  onClose,
  threshold,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-editorial-surface dark:bg-editorial-surfaceDark border border-editorial-border dark:border-editorial-borderDark shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 hairline-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center border border-editorial-ink dark:border-editorial-inkDark">
              <ShieldCheck className="w-3.5 h-3.5 text-editorial-accent" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-editorial-accent uppercase block">
                MIDNIGHT PRIVACY ARCHITECTURE
              </span>
              <h2 className="font-serif text-xl font-medium text-editorial-ink dark:text-editorial-inkDark">
                How Sentinel Stays Private
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark hover:text-editorial-ink dark:hover:text-editorial-inkDark hover:border-editorial-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Executive Overview */}
          <div className="p-4 border border-editorial-border dark:border-editorial-borderDark bg-neutral-50 dark:bg-neutral-900/30">
            <p className="leading-relaxed text-editorial-muted dark:text-editorial-mutedDark">
              Traditional identity systems force users to disclose their entire date of birth,
              home address, and passport number just to prove simple adulthood. Sentinel
              replaces document exposure with <strong>Selective Disclosure</strong> on Midnight:
              proving the arithmetic relation <code className="font-mono text-editorial-ink dark:text-editorial-inkDark">age ≥ {threshold}</code> inside
              a client-side Zero-Knowledge SNARK circuit.
            </p>
          </div>

          {/* Comparative Selective Disclosure Table */}
          <div className="border border-editorial-border dark:border-editorial-borderDark overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead className="bg-neutral-100 dark:bg-neutral-900 text-[11px] text-editorial-ink dark:text-editorial-inkDark hairline-b uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-r border-editorial-border dark:border-editorial-borderDark">Data Attribute</th>
                  <th className="p-3 border-r border-editorial-border dark:border-editorial-borderDark">Storage Domain</th>
                  <th className="p-3 text-center">Observer Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-border dark:divide-editorial-borderDark text-[11px]">
                <tr className="bg-red-50/20 dark:bg-red-950/10">
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark font-semibold text-editorial-ink dark:text-editorial-inkDark">
                    Exact Age (e.g. 27)
                  </td>
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark">
                    Client Ephemeral RAM (Witness)
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-[10px] uppercase tracking-wider">
                      <EyeOff className="w-3 h-3" />
                      <span>PERMANENTLY PRIVATE</span>
                    </span>
                  </td>
                </tr>

                <tr className="bg-red-50/20 dark:bg-red-950/10">
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark font-semibold text-editorial-ink dark:text-editorial-inkDark">
                    Date of Birth / Gov ID
                  </td>
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark">
                    Never Collected or Ingested
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-[10px] uppercase tracking-wider">
                      <EyeOff className="w-3 h-3" />
                      <span>PERMANENTLY PRIVATE</span>
                    </span>
                  </td>
                </tr>

                <tr className="bg-red-50/20 dark:bg-red-950/10">
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark font-semibold text-editorial-ink dark:text-editorial-inkDark">
                    Witness Random Entropy
                  </td>
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark">
                    Client Crypto Salt
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-[10px] uppercase tracking-wider">
                      <EyeOff className="w-3 h-3" />
                      <span>PERMANENTLY PRIVATE</span>
                    </span>
                  </td>
                </tr>

                <tr className="bg-emerald-50/20 dark:bg-emerald-950/10">
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark font-semibold text-editorial-ink dark:text-editorial-inkDark">
                    Boolean Eligibility (<code className="text-emerald-700 dark:text-emerald-400">isEligible</code>)
                  </td>
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark">
                    Midnight Public Ledger (Cell)
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider">
                      <Eye className="w-3 h-3" />
                      <span>PUBLIC ATTESTATION</span>
                    </span>
                  </td>
                </tr>

                <tr className="bg-emerald-50/20 dark:bg-emerald-950/10">
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark font-semibold text-editorial-ink dark:text-editorial-inkDark">
                    Attested Wallet Address
                  </td>
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark">
                    Midnight Ledger Key
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider">
                      <Eye className="w-3 h-3" />
                      <span>PUBLIC ATTESTATION</span>
                    </span>
                  </td>
                </tr>

                <tr className="bg-emerald-50/20 dark:bg-emerald-950/10">
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark font-semibold text-editorial-ink dark:text-editorial-inkDark">
                    Tested Threshold (<code className="text-emerald-700 dark:text-emerald-400">18</code>)
                  </td>
                  <td className="p-3 border-r border-editorial-border dark:border-editorial-borderDark text-editorial-muted dark:text-editorial-mutedDark">
                    Midnight Ledger Cell
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider">
                      <Eye className="w-3 h-3" />
                      <span>PUBLIC ATTESTATION</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deep Explanation */}
          <div className="space-y-3 font-sans">
            <h4 className="font-serif text-sm font-semibold text-editorial-ink dark:text-editorial-inkDark">
              Mathematical Guarantee of the Compact Circuit
            </h4>
            <p className="text-editorial-muted dark:text-editorial-mutedDark leading-relaxed">
              In Compact, the user&apos;s age is declared as a <code className="font-mono text-editorial-ink dark:text-editorial-inkDark">witness getPrivateAge(): Uint&lt;32&gt;</code>.
              Witnesses execute exclusively in the client-side WebAssembly environment. The resulting
              proof <code className="font-mono text-editorial-ink dark:text-editorial-inkDark">&pi;</code> convinces the Midnight ledger verifier that there exists an input satisfying
              the inequality without exposing the input wire itself.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 hairline-t bg-neutral-50 dark:bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-editorial-ink text-editorial-bg dark:bg-editorial-inkDark dark:text-editorial-bgDark text-xs font-mono tracking-wider uppercase hover:bg-editorial-accent hover:text-white transition-colors"
          >
            I Understand the Privacy Model
          </button>
        </div>
      </div>
    </div>
  );
};
