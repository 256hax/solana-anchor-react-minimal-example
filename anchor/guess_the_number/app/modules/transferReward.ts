import { Connection, clusterApiUrl, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const transferReward = async (
  connection: any,
  payer: Keypair,
  toPublicKey: PublicKey,
  amount: number,
): Promise<string> => {
  let transaction = new Transaction();

  transaction.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toPublicKey,
      lamports: LAMPORTS_PER_SOL * amount,
  }));

  const signature = await sendAndConfirmTransaction(connection, transaction, [payer]) 

  return signature;
};