import { PublicKey, Keypair } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

export const mintNfts  = async(
  connection: any,
  payer: Keypair,
  toPublicKey: PublicKey,
  mint: PublicKey,
) => {
  const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint address
    payer.publicKey // owner
  );

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint address
    toPublicKey // owner
  );

  // Mint 1 new token to the "fromTokenAccount" account we just created
  const signature_mint = await mintTo(
    connection, // connection
    payer, // payer
    mint, // mint
    payerTokenAccount.address, // destination
    payer.publicKey, // authority
    1, // amount
    [] // signer(s)
  );

  const signature = await transfer(
    connection, // connection
    payer, // payer
    payerTokenAccount.address, // source
    toTokenAccount.address, // destination
    payer.publicKey, // owner
    1, // amount
    [] // signer
  );

  return signature;
};