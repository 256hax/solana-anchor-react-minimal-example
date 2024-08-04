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
  //  Set Max Supported Version 
  // ------------------------------------------------------------------------
  const slot = await connection.getSlot();

  // get the latest block (allowing for v0 transactions)
  const block = await connection.getBlock(slot, {
    maxSupportedTransactionVersion: 0,
  });

  // get a specific transaction (allowing for v0 transactions)
  const getSignature = await connection.getTransaction(
    // Replace to valid tx.
    "3jpoANiFeVGisWRY5UP648xRXs3iQasCHABPWRWnoEjeA93nc79WrnGgpgazjq4K9m8g2NJoyKoWBV1Kx5VmtwHQ",
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

  const transaction = new VersionedTransaction(messageV0);

  // sign your transaction with the required `Signers`
  transaction.sign([payer]);

  // send our v0 transaction to the cluster
  const signature = await connection.sendTransaction(transaction);
  console.log('signature =>', signature);
};

main();

/*
% ts-node <THIS FILE>

block => {
  blockHeight: 41,
  blockTime: 1685888668,
  blockhash: 'CJJP8X7YbPNQ6bErNXCmCwWzooZoNxPmDnRrVoZHcQjU',
  parentSlot: 41,
  previousBlockhash: '6b9TSsrSwX4FgqnMSQP6jvN4KpKvSDxJT94htxE1XsXd',
  rewards: [
    {
      commission: null,
      lamports: 7500,
      postBalance: 499999905000,
      pubkey: 'J1SXLjPwvSEqM41cga3njLUnDPX1TszYwU81kh4cnHe7',
      rewardType: 'Fee'
    }
  ],
  transactions: [
    { meta: [Object], transaction: [Object], version: 'legacy' },
    { meta: [Object], transaction: [Object], version: 'legacy' }
  ]
}
getSignature => null
signature => 3PJ9ip9Vp2CCFiyiTqhVcKjiDGFog4rf11bJ54wLdh99yZS6qBxPw6FNi2wdLdkdLGp3S7RQT5rhybeoQubAz7TP
*/