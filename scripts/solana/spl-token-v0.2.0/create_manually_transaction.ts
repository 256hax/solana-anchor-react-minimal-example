// Source: https://docs.solana.com/developing/clients/javascript-reference#transaction
import * as web3 from '@solana/web3.js';
import nacl from 'tweetnacl';

export const main = async() => {
  /*
    --- Payer -------------------------------------------------------------
  */
  // Airdrop SOL for paying transactions
  let payer = web3.Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  let airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      web3.LAMPORTS_PER_SOL
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
  let toAccount = web3.Keypair.generate();

  let airdropSignatureToAccount = await connection.requestAirdrop(
      toAccount.publicKey,
      web3.LAMPORTS_PER_SOL
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
  let transaction = new web3.Transaction();

  // Add an instruction to execute
  transaction.add(web3.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: 1000,
  }));

  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  await web3.sendAndConfirmTransaction(connection, transaction, [payer])

  // Alternatively, manually construct the transaction
  let recentBlockhash = await connection.getRecentBlockhash();
  let manualTransaction = new web3.Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: payer.publicKey
  });
  manualTransaction.add(web3.SystemProgram.transfer({
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

  const tx_signature = await web3.sendAndConfirmRawTransaction(connection, rawTransaction);
  console.log('tx_signature =>', tx_signature);
};

main();

/*
% ts-node <THIS JS FILE>
The signatures were verifed: true
tx_signature =>  3kKWgWqbcR43KtE7pKiM8Ktjm5zoGw4pohAsWgj8GkV11SeMLb8uHVfSBS4AhhoPF5SgK2dNsAPUZ9MAdWrtBoz3
*/
