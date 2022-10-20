import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createAssociatedTokenAccount } from '@solana/spl-token';

export const main = async () => {
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


  // --- Payer -------------------------------------------------------------
  const payer = Keypair.generate();

  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );

  let latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });


  // --- Token -------------------------------------------------------------
  const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC Token in Devnet


  // --- Create ATA -------------------------------------------------------------
  // Ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createAssociatedTokenAccount
  const ata = await createAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint
    payer.publicKey, // owner
  );

  console.log('owner =>', payer.publicKey.toString());
  console.log('Associated Token Address =>', ata.toString());
};

main();

/*
% ts-node <THIS FILE>
owner => CoBiCaAd5cVqTWZNBecHpJHiHH3Yy5B4pY2YwyaMVhBr
Associated Token Address => AFY2QZHYgW8hkSjiGR5PCUJJdvuTmrwNv9Pi4PDgv5yC
*/