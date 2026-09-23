/// <reference types="vite/client" />

interface Window {
  midnight?: {
    mnLace?: {
      enable: () => Promise<{
        getPublicAddress: () => Promise<string>;
        signData: (data: string) => Promise<string>;
      }>;
      isEnabled: () => Promise<boolean>;
    };
  };
}
