// Source: https://docs.solana.com/developing/clients/javascript-reference#transaction
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  TransactionMessage,
  VersionedTransaction,
  SimulateTransactionConfig,
} from '@solana/web3.js';

export const main = async () => {
  // ------------------------------------------
  //  Payer
  // ------------------------------------------
  // Airdrop SOL for paying transactions
  const payer = Keypair.generate();
  // let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // ---------------------------------------------------
  //  Airdrop
  // ---------------------------------------------------
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );

  let latestBlockhash = await connection.getLatestBlockhash();

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // ------------------------------------------
  //  Taker
  // ------------------------------------------
  const taker = Keypair.generate();

  // ------------------------------------------
  //  Simulate Transaction
  // ------------------------------------------
  // Create Simple Transaction
  let transaction = new Transaction();

  // Add an instruction to execute
  transaction.add(SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  }));

  const versionedMessage = new TransactionMessage({
    instructions: transaction.instructions,
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
  });

  const versionedTransaction = new VersionedTransaction(versionedMessage.compileToLegacyMessage());
  const config: SimulateTransactionConfig = {
    commitment: 'confirmed',
  };
  const simulateTxBeforeSend = await connection.simulateTransaction(versionedTransaction, config);
  console.log('simulateTxBeforeSend =>', simulateTxBeforeSend);

  // ------------------------------------------
  //  Confirm Transaction
  // ------------------------------------------
  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  console.log('signature =>', signature);

  const simulateTxAfterSend = await connection.simulateTransaction(transaction);
  console.log('simulateTxAfterSend =>', simulateTxAfterSend);
};

main();

/*
% ts-node <THIS FILE>

simulateTxBeforeSend => {
  context: { apiVersion: '1.14.18', slot: 3774 },
  value: {
    accounts: null,
    err: null,
    logs: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    returnData: null,
    unitsConsumed: 0
  }
}
signature => 3p5e1KAtBJgg41MYJDistXyCdWzSoLDEsw6TviebaTtBb7QxvYYub7GdunehQVPnfycLHistrFmpoB7org3nNmZ2
simulateTxAfterSend => {
  context: { apiVersion: '1.14.18', slot: 3775 },
  value: {
    accounts: null,
    err: 'AlreadyProcessed',
    logs: [],
    returnData: null,
    unitsConsumed: 0
  }
}
*/
