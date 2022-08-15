import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const initializeWallets = async(connection: any, taker1: Keypair, taker2: Keypair) => {
  // --- Airdrop ---
  const wallets = [taker1, taker2];
  let latestBlockHash: any;
  let airdropSignature: any;

  for(const w of wallets) {
    // Generate a new wallet keypair and airdrop SOL
    airdropSignature = await connection.requestAirdrop(w.publicKey, LAMPORTS_PER_SOL);
    latestBlockHash = await connection.getLatestBlockhash();

    // Wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    })
  }
};