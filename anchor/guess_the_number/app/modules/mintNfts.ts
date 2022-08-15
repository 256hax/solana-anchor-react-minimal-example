import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import { mintNftType } from '../types/mintNft';

export const mintNfts: mintNftType  = async(connection, payer, takerPublicKey, mint) => {
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