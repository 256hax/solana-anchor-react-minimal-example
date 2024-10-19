import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  
} from '@solana/web3.js';
import {
  createMint,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ---------------------------------------------------
  //  Wallet
  // ---------------------------------------------------
  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();

  // ---------------------------------------------------
  //  Airdrop
  // ---------------------------------------------------
  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL
  );

  let latestBlockhash = await connection.getLatestBlockhash();

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: fromAirdropSignature,
  });

  // ---------------------------------------------------
  //  Create Token
  // ---------------------------------------------------
  // Create new token mint
  const mint = await createMint(
    connection, // connection
    fromWallet, // payer
    fromWallet.publicKey, // mintAuthority
    null, // freezeAuthority
    9 // decimals
  );
  // const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC Token in Devnet

  const owner = Keypair.generate().publicKey;

  // Ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#getAssociatedTokenAddress
  // Note: Only check ATA(Associated Token Address). It doesn't exist ATA yet.
  const ata = await getAssociatedTokenAddress(
    mint, // mint
    owner, // owner
  );

  console.log('owner =>', owner.toString());
  console.log('Associated Token Address =>', ata.toString());
};

main();

/*
% ts-node <THIS FILE>
owner => 5waJka9MrCgPFoLo3SQSjLDTGnkoDcwYYPnpk4YNJS6i
Associated Token Address => HmBpVD6N1vuGvQpS8KrwWH6Tr8rSwXQBEDKn5VXW6yyw
*/