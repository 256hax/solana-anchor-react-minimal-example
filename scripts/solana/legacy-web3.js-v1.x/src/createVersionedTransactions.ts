// Ref: https://docs.solana.com/developing/versioned-transactions
import {
  Connection,
  clusterApiUrl,
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899');
  // const connection = new Connection(clusterApiUrl("devnet"));

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
  //  Create Transaction
  // ------------------------------------------------------------------------
  let legacyTransaction = new Transaction();

  const taker = Keypair.generate();

  legacyTransaction.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.01,
    })
  );

  const legacySignature = await sendAndConfirmTransaction(
    connection,
    legacyTransaction,
    [payer],
  );

  // ------------------------------------------------------------------------
  //  Set Max Supported Version 
  // ------------------------------------------------------------------------
  const slot = await connection.getSlot();

  // get the latest block (allowing for v0 transactions)
  const block = await connection.getBlock(slot, {
    maxSupportedTransactionVersion: 0,
  });

  // get a specific transaction (allowing for v0 transactions)
  const getSignature = await connection.getTransaction(
    // "BTHHy7p7opFqvLgsWFgFnwXsc7ipBPsXgdcPAD9y1RTrEKhG6pSo22WAvf7hQ6DdjSBNckQbGKsARbSRQTxL3wM",
    legacySignature,
    {
      maxSupportedTransactionVersion: 0,
    },
  );

  console.log('block =>', block);
  console.log('getSignature =>', getSignature);

  // ------------------------------------------------------------------------
  //  Create Versioned Transaction
  // ------------------------------------------------------------------------
  let minRent = await connection.getMinimumBalanceForRentExemption(0);

  const blockHash = await connection.getLatestBlockhash();

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
    recentBlockhash: blockHash.blockhash,
    instructions,
  }).compileToV0Message();

  const versionedTransaction = new VersionedTransaction(messageV0);

  // sign your transaction with the required `Signers`
  versionedTransaction.sign([payer]);

  // send our v0 transaction to the cluster
  const versionedSignature = await connection.sendTransaction(versionedTransaction);
  console.log('signature =>', versionedSignature);
};

main();

/*
% ts-node <THIS FILE>

block => {
  blockHeight: 9773,
  blockTime: 1729348400,
  blockhash: 'DY7Dy7x67Qkdy3j6hHQAMsBYmgRxNEMjUFM8sqqF6Jjy',
  parentSlot: 9772,
  previousBlockhash: '429dE36ZBiT9At4HvqNZ1UG7zqGYSwqMAh6ka6rA6z1i',
  rewards: [
    {
      commission: null,
      lamports: 7500,
      postBalance: 499951290000,
      pubkey: 'DMSTaxT5RiQQAgbNftGgJyoVeukJNmHXgSQnNXb18iTo',
      rewardType: 'Fee'
    }
  ],
  transactions: [
    { meta: [Object], transaction: [Object], version: 'legacy' },
    { meta: [Object], transaction: [Object], version: 'legacy' }
  ]
}
getSignature => {
  blockTime: 1729348400,
  meta: {
    computeUnitsConsumed: 150,
    err: null,
    fee: 5000,
    innerInstructions: [],
    loadedAddresses: { readonly: [], writable: [] },
    logMessages: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    postBalances: [ 989995000, 10000000, 1 ],
    postTokenBalances: [],
    preBalances: [ 1000000000, 0, 1 ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null }
  },
  slot: 9773,
  transaction: {
    message: Message {
      header: [Object],
      accountKeys: [Array],
      recentBlockhash: '9QLQ34Far7jduj7X2jrZZfqtQuASC7WqGUTkujQkp6Pv',
      instructions: [Array],
      indexToProgramIds: [Map]
    },
    signatures: [
      '5GPRVxkeimkUBs3gxigb8YCTHqt1JSBAKzmQU3iwFzes43dKKZeNfCbWXUhhLmJsy27F5cjcvzntGPthn8QJZHYC'
    ]
  },
  version: 'legacy'
}
signature => 2YmXzhi4LDkGX54npvUa1TCdWtrQFT5HgtqHWJ4K4tVcypzoSK1ujrqVq5ms3KL6zcAkEWQa36dUS5iKLxAoVDrc
*/
