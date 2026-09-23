import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-editorial-bg dark:bg-editorial-bgDark hairline-t mt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 hairline-b">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center border border-editorial-ink dark:border-editorial-inkDark">
                <div className="w-2 h-2 bg-editorial-accent" />
              </div>
              <span className="font-serif text-base font-semibold tracking-tight text-editorial-ink dark:text-editorial-inkDark">
                SENTINEL
              </span>
            </div>
            <p className="font-serif italic text-sm text-editorial-muted dark:text-editorial-mutedDark">
              &ldquo;Standing guard over what shouldn&apos;t be seen.&rdquo;
            </p>
            <p className="text-xs font-sans text-editorial-muted dark:text-editorial-mutedDark leading-relaxed">
              Engineered for RiseIn &ldquo;New Moon to Full: Monthly Moonshots on Midnight&rdquo;
              Level 3 — First Quarter Submission.
            </p>
          </div>

          {/* Col 2: Architecture */}
          <div className="md:col-span-4 space-y-2 text-xs font-mono">
            <div className="text-[10px] text-editorial-accent uppercase tracking-widest font-semibold mb-3">
              CONSENSUS SPECIFICATIONS
            </div>
            <div className="flex justify-between py-1 border-b border-editorial-border dark:border-editorial-borderDark">
              <span className="text-editorial-muted dark:text-editorial-mutedDark">NETWORK</span>
              <span className="text-editorial-ink dark:text-editorial-inkDark">Midnight Devnet / Testnet</span>
            </div>
            <div className="flex justify-between py-1 border-b border-editorial-border dark:border-editorial-borderDark">
              <span className="text-editorial-muted dark:text-editorial-mutedDark">LANGUAGE</span>
              <span className="text-editorial-ink dark:text-editorial-inkDark">Compact v0.18</span>
            </div>
            <div className="flex justify-between py-1 border-b border-editorial-border dark:border-editorial-borderDark">
              <span className="text-editorial-muted dark:text-editorial-mutedDark">PROVING SYSTEM</span>
              <span className="text-editorial-ink dark:text-editorial-inkDark">ZK-SNARK / PLONK</span>
            </div>
          </div>

          {/* Col 3: Links */}
          <div className="md:col-span-3 space-y-2 text-xs font-mono">
            <div className="text-[10px] text-editorial-accent uppercase tracking-widest font-semibold mb-3">
              RESOURCES
            </div>
            <div>
              <a
                href="https://midnight.network"
                target="_blank"
                rel="noreferrer"
                className="hover:text-editorial-accent transition-colors flex items-center space-x-1"
              >
                <span>Midnight Network</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <a
                href="https://docs.midnight.network"
                target="_blank"
                rel="noreferrer"
                className="hover:text-editorial-accent transition-colors flex items-center space-x-1"
              >
                <span>Compact Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <a
                href="https://github.com/kantabhishek-webgod/Sentinel"
                target="_blank"
                rel="noreferrer"
                className="hover:text-editorial-accent transition-colors flex items-center space-x-1"
              >
                <span>Source Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-editorial-muted dark:text-editorial-mutedDark">
          <div>
            &copy; {new Date().getFullYear()} Sentinel. Apache-2.0 License.
          </div>
          <div className="mt-2 sm:mt-0">
            Selective Disclosure Verified &bull; Zero Private Data Disclosed
          </div>
        </div>
      </div>
    </footer>
  );
};
