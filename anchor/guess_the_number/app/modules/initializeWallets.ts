import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const initializeWallets = async(connection: any) => {
  const payerWallet = Keypair.generate();
  const taker1Wallet = Keypair.generate();
  const taker2Wallet = Keypair.generate();

  const wallets = [payerWallet, taker1Wallet, taker2Wallet];

  let latestBlockHash;
  let airdropSignature;

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
  };

  return [payerWallet, taker1Wallet, taker2Wallet];
};