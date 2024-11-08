// Source: https://docs.solana.com/developing/clients/javascript-reference#transaction
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import nacl from 'tweetnacl';

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ------------------------------------------
  //  Payer
  // ------------------------------------------
  // Airdrop SOL for paying transactions
  const payer = Keypair.generate();

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
  //  Transfer
  // ------------------------------------------
  // Create Simple Transaction
  let transaction = new Transaction();

  // Add an instruction to execute
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.01,
    })
  );

  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer],
    // Options https://solana-labs.github.io/solana-web3.js/types/ConfirmOptions.html
    // {
    //   commitment: 'confirmed',
    //   maxRetries: 3,
    //   preflightCommitment: 'confirmed',
    //   skipPreflight: true,
    // }
  );
  console.log('signature =>', signature);

  // ------------------------------------------
  //  Alternatively Way: manually construct the transaction
  // ------------------------------------------
  latestBlockhash = await connection.getLatestBlockhash();
  let manualTransaction = new Transaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    feePayer: payer.publicKey,
  });

  manualTransaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: 1000,
    })
  );

  const transactionBuffer = manualTransaction.serializeMessage();
  const manualSignature: any = nacl.sign.detached(
    transactionBuffer,
    payer.secretKey
  );

  manualTransaction.addSignature(payer.publicKey, manualSignature);

  const isVerifiedSignature = manualTransaction.verifySignatures();
  console.log(`The signatures were verified => ${isVerifiedSignature}`);

  // The signatures were verified: true

  // let rawTransaction = manualTransaction.serialize();
  const manualTransferSignature = await connection.sendRawTransaction(
    manualTransaction.serialize()
  );
  console.log('manualTransferSignature =>', manualTransferSignature);
};

main();

/*
% ts-node <THIS FILE>
signature => outRBmTmHTCSPbLot5QQHvkL4hfGgkUFQA9RookKgqmtqRTzP21RnS2F3RVsKvi9TxMWXCKTQHUajH2mLvyqaM1
The signatures were verified => true
manualTransferSignature => KyDJPwgf3iyjyPTeKhSkmcYFueHH1HtzkbW2a3wDyh5VDMBoCnv6b1Jbzs3j3fUzKZ7Czy4LNJJU2HAyemcGr96
*/
