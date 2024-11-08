// Source: https://solanacookbook.com/references/offline-transactions.html#sign-transaction
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

/* The transaction:
 * - sends 0.01 SOL from Alice to Bob
 * - sends 0.01 SOL from Bob to Alice
 * - is partially signed by Bob, so Alice can approve + send it
 */

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // ------------------------------------------------------------------------
  //  Wallet
  // ------------------------------------------------------------------------
  const aliceKeypair = Keypair.generate();
  const bobKeypair = Keypair.generate();

  console.log('aliceKeypair =>', aliceKeypair.publicKey.toString());
  console.log('bobKeypair =>', bobKeypair.publicKey.toString());
  
  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  let latestBlockhash: any;

  latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropAlice = await connection.requestAirdrop(aliceKeypair.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropAlice,
  });

  latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropBob = await connection.requestAirdrop(bobKeypair.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropBob,
  });

  // ------------------------------------------------------------------------
  //  Create Transaction
  // ------------------------------------------------------------------------
  // Get a recent blockhash to include in the transaction
  const { blockhash } = await connection.getLatestBlockhash("finalized");

  latestBlockhash = await connection.getLatestBlockhash();
  const transaction = new Transaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    // Alice pays the transaction fee
    feePayer: aliceKeypair.publicKey,
  });

  // Transfer 0.01 SOL from Alice -> Bob
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: aliceKeypair.publicKey,
      toPubkey: bobKeypair.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    })
  );

  // Transfer 0.01 SOL from Bob -> Alice
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: bobKeypair.publicKey,
      toPubkey: aliceKeypair.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    })
  );

  // Partial sign as Bob
  // You need to sign at the end fo transaction.
  transaction.partialSign(bobKeypair);

  // ------------------------------------------------------------------------
  //  Serialize Transaction
  // ------------------------------------------------------------------------
  // Serialize the transaction and convert to base64 to return it
  const serializedTransaction = transaction.serialize({
    // We will need Alice to deserialize and sign the transaction
    requireAllSignatures: false,
  });
  const transactionBase64 = serializedTransaction.toString("base64");

  // You can send data to anywhere.
  // return transactionBase64;

  // ------------------------------------------------------------------------
  //  Recover Transaction
  // ------------------------------------------------------------------------
  // The caller of this can convert it back to a transaction object:
  const recoveredTransaction = Transaction.from(
    Buffer.from(transactionBase64, "base64")
  );

  // You'll get "Signature verification failed" error if use sign. Because it cancel all partialSign.
  // recoveredTransaction.sign(bobKeypair);

  // Partial sign as Alice
  recoveredTransaction.partialSign(aliceKeypair);
  
  const sig = await connection.sendRawTransaction(recoveredTransaction.serialize())
  console.log('signature =>', sig);
};

main();

/*
% ts-node <THIS FILE>
aliceKeypair => EkEb2uF7C792LrRqNj81BsmMcdXAyDqz3FXQeYpRjC6E
bobKeypair => 7aF8mCyxsdqWTaFvMhv1RXPEfT52yWsFYvC1NRYtE4cz
signature => 5c3DPMeBAZkchc7Ztu4G334XRnLsYuwvrsx9DnGoUwotRhLcmavSECBRq9ED692VfzCt57sKV5jgdVjMSkHQ6y8M
*/