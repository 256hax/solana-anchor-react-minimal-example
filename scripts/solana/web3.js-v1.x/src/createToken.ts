// Source: https://github.com/solana-labs/solana-program-library/blob/895747f29fd38fc61961ffc1bc5c73dab57bba1a/token/js/examples/create_mint_and_transfer_tokens.ts
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';

export const main = async () => {
  // Connect to cluster
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

  // ---------------------------------------------------
  //  Create Token Account
  // ---------------------------------------------------
  // Get the token account of the fromWallet address, and if it does not exist, create it
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    fromWallet, // payer
    mint, // mint
    fromWallet.publicKey // owner
  );

  // ---------------------------------------------------
  //  Mint Token
  // ---------------------------------------------------
  // Mint 1 new token to the "fromTokenAccount" account we just created
  const signature = await mintTo(
    connection, // connection
    fromWallet, // payer
    mint, // mint
    fromTokenAccount.address, // destination
    fromWallet.publicKey, // authority
    LAMPORTS_PER_SOL * 100, // amount
    [] // signer(s)
  );

  console.log('fromWallet =>', fromWallet.publicKey.toBase58());
  console.log('fromTokenAccount =>', fromTokenAccount.address.toBase58());
  console.log('mint =>', mint.toBase58());
  console.log('signature =>', signature);
};

main();

/*
% ts-node <THIS FILE>
fromWallet => 6D6qkMuxC8yxnrSFdPUhpKoGuUBq4uBYW8Z9EQ4hweJs
fromTokenAccount => GCrgJtCKWnWqU8yppCRmTrzpLq3qkqRVsKkkbqJpdBzp
mint => 9ZWftk1pSG748sawiaJCnjD6BVkvyxPRFUXGm4qr7o4A
signature => 49B3XGqRXFgt6AwXxZpS3fFig5XWJy96y1mzKHabQwvCJGJdiWvbXDpqyQvwYWLjEANxKPxYryVda24sWcdsAKra
*/
