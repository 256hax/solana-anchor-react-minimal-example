// Source: https://docs.solana.com/developing/clients/javascript-reference#transaction
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  sendAndConfirmRawTransaction
} from '@solana/web3.js';
import nacl from 'tweetnacl';

export const main = async () => {
  /*
    --- Payer -------------------------------------------------------------
  */
  // Airdrop SOL for paying transactions
  const payer = Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

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

  /*
    --- To ----------------------------------------------------------------
  */
  const toAccount = Keypair.generate();

  const airdropSignatureToAccount = await connection.requestAirdrop(
    toAccount.publicKey,
    LAMPORTS_PER_SOL
  );

  latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignatureToAccount,
  });


  /*
    --- Transfer ----------------------------------------------------------
  */
  // Create Simple Transaction
  let transaction = new Transaction();

  // Add an instruction to execute
  transaction.add(SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }));

  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  const tx = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );
  console.log('tx =>', tx);

  /*
    --- Alternatively, manually construct the transaction ----------------------------------------------------------
  */
  latestBlockhash = await connection.getLatestBlockhash();
  let manualTransaction = new Transaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    feePayer: payer.publicKey,
  });

  manualTransaction.add(SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: 1000,
  }));

  const transactionBuffer = manualTransaction.serializeMessage();
  const manualSignature: any = nacl.sign.detached(transactionBuffer, payer.secretKey);

  manualTransaction.addSignature(payer.publicKey, manualSignature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  console.log(`The signatures were verifed => ${isVerifiedSignature}`)

  // The signatures were verified: true

  // let rawTransaction = manualTransaction.serialize();
  let manualTx = await connection.sendRawTransaction(manualTransaction.serialize());
  console.log('manualTx =>', manualTx);
};

main();

/*
% ts-node <THIS FILE>
tx => 2cDFBXXhqp6EwMpdD4sBD643ZX12pqJg63NRyWMG8GYibLoh9wCG2PLChXByeCsozWMjoxYyy1oWCGdDfkQGVMyH
The signatures were verifed => true
manualTx => 5sJQe4WPmzBeDmW9suLQmDBVoVvdXnkghbgUCWpXQ5BZj271FZxoFPKqpR5aasiyRDWfCqttvdgTy4vYT8TUEcA
*/
