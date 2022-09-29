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

export const main = async() => {
  /*
    --- Payer -------------------------------------------------------------
  */
  // Airdrop SOL for paying transactions
  let payer = Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  let airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL
  );

  let latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  /*
    --- To ----------------------------------------------------------------
  */
  let toAccount = Keypair.generate();

  let airdropSignatureToAccount = await connection.requestAirdrop(
      toAccount.publicKey,
      LAMPORTS_PER_SOL
  );

  latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
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
  const tx = await sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log('tx =>', tx);

  /*
    --- Alternatively, manually construct the transaction ----------------------------------------------------------
  */
  let recentBlockhash = await connection.getRecentBlockhash();
  let manualTransaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: payer.publicKey
  });
  manualTransaction.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: 1000,
  }));

  let transactionBuffer = manualTransaction.serializeMessage();
  let signature: any = nacl.sign.detached(transactionBuffer, payer.secretKey);

  manualTransaction.addSignature(payer.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  console.log(`The signatures were verifed: ${isVerifiedSignature}`)

  // The signatures were verified: true

  let rawTransaction = manualTransaction.serialize();

  const tx_signature = await sendAndConfirmRawTransaction(connection, rawTransaction);
  console.log('tx_signature =>', tx_signature);
};

main();

/*
% ts-node <THIS FILE>
tx => 5pkg1GEpJ4fXvotc7PHc4cRZ2psRyCsodFDpKFXXSCjz7DkkUXgRV57hsfdBnqakKUSYuGSveheKmuj2BEmgNMyH
The signatures were verifed: true
tx_signature => 2qwSbtLtd4V3NNr3zFKZ62n18eo6wRi5CtqeEijkePnfe9dSiN2qjg3X3LpBghyi3gXKCcqWB3PgH7WVhjANgzoK
*/
