// Source: https://www.quicknode.com/guides/solana-development/how-to-use-the-solana-memo-program
import {
  Keypair,
  Transaction,
  TransactionInstruction,
  PublicKey,
  Connection,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

async function main (message: string) {
  // ---------------------------------------------------
  // 1. Declare Keypair to sign transaction 
  // ---------------------------------------------------
  const payer = Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // --- Airdrop ---
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );
  let latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });
  // --- End Airdrop ---
  
  // ---------------------------------------------------
  // 2. Create Solana Transaction
  // ---------------------------------------------------
  let tx = new Transaction();

  // ---------------------------------------------------
  // 3. Add Memo Instruction
  // ---------------------------------------------------
  await tx.add(
      new TransactionInstruction({
        keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(message, "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
    )
  // 4. Send Transaction
  let signature = await sendAndConfirmTransaction(connection, tx, [payer]);
  // 5. Log Tx URL
  console.log('signature =>', signature);
  console.log('Check signature at Memo Program section in Solana Explorer.');
  
  return signature;
}

main('This is Memo Message'); // Replace you Memo

/*
% ts-node <THIS FILE>
signature => 4ysV5Hxn7S1Q2aZiRT2DvgtRMqgZJa9ARFodbJFiznyjJKpeSBCTYdZfBkzEJC7ZzMwbhA9bbt1DfuNi86ZzYkuK
Check signature at Memo Program section in Solana Explorer.
*/