import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'

export const initializeWallets = async(connection: any) => {
  const taker1Wallet = Keypair.generate();
  const taker2Wallet = Keypair.generate();

  // Generate a new wallet keypair and airdrop SOL
  let airdropSignature = await connection.requestAirdrop(taker1Wallet.publicKey, LAMPORTS_PER_SOL);
  let latestBlockHash = await connection.getLatestBlockhash();

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  })


  // Generate a new wallet keypair and airdrop SOL
  airdropSignature = await connection.requestAirdrop(taker2Wallet.publicKey, LAMPORTS_PER_SOL);
  latestBlockHash = await connection.getLatestBlockhash();

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  })

  return [taker1Wallet, taker1Wallet];
}