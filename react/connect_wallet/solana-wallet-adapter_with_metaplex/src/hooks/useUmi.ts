// Solana
import { useWallet } from '@solana/wallet-adapter-react';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

export const useUmi = () => {
  // Import useWallet hook
  const wallet = useWallet();

  // Solana public RPC(Mainnet) unavailbale DAS(cNFT). Check available List:
  // https://developers.metaplex.com/rpc-providers#rp-cs-available
  // 
  // *** Please replace dummy URL to your Custom RPC in useUmi.ts ***
  const endpoint = 'https://api.devnet.solana.com';

  // Create Umi instance
  const umi = createUmi(endpoint)
    // Register Metaplex Products to Umi
    .use(dasApi())
    .use(mplBubblegum())
    // Register Wallet Adapter to Umi
    .use(walletAdapterIdentity(wallet));

  return umi;
};
