// Ref: https://docs.solana.com/developing/versioned-transactions
import {
  Connection,
  clusterApiUrl,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

const main = async () => {
  // const connection = new Connection(clusterApiUrl("devnet"));
  const connection = new Connection('http://127.0.0.1:8899');

  const payer = Keypair.generate();
  const toAccount = Keypair.generate();

  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdrop = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdrop,
  });

  // ------------------------------------------------------------------------
  //  set max supported version 
  // ------------------------------------------------------------------------
  const slot = await connection.getSlot();

  // get the latest block (allowing for v0 transactions)
  const block = await connection.getBlock(slot, {
    maxSupportedTransactionVersion: 0,
  });

  // get a specific transaction (allowing for v0 transactions)
  const getSignature = await connection.getTransaction(
    "3jpoANiFeVGisWRY5UP648xRXs3iQasCHABPWRWnoEjeA93nc79WrnGgpgazjq4K9m8g2NJoyKoWBV1Kx5VmtwHQ", // Devnet
    {
      maxSupportedTransactionVersion: 0,
    },
  );

  console.log('block =>', block);
  console.log('getSignature =>', getSignature);

  // ------------------------------------------------------------------------

  //  Instructions
  // ------------------------------------------------------------------------
  let minRent = await connection.getMinimumBalanceForRentExemption(0);

  let blockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  // create an array with your desires `instructions`
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: minRent,
    }),
  ];

  // create v0 compatible message
  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  // sign your transaction with the required `Signers`
  transaction.sign([payer]);

  // send our v0 transaction to the cluster
  const signature = await connection.sendTransaction(transaction);
  console.log('signature =>', signature);
};

main();