import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';

export const mintNfts = async(
  connection: any,
  payer: Keypair,
  takerPublicKey: PublicKey,
  mint: PublicKey,
): Promise<string> => {
  const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint address
    payer.publicKey // owner
  );

  const takerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint address
    takerPublicKey // owner
  );

  const signature = await transfer(
    connection, // connection
    payer, // payer
    payerTokenAccount.address, // source
    takerTokenAccount.address, // destination
    payer.publicKey, // owner
    1, // amount
    [] // signer
  );

  return signature;
};