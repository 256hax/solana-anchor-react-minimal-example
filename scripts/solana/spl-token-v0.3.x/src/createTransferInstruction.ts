import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

export const main = async () => {
  let connection = new Connection('https://api.devnet.solana.com');
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // ------------------------------------------
  //  Wallet
  // ------------------------------------------
  const payer = Keypair.generate();
  const reference = Keypair.generate();
  const taker = Keypair.generate();

  // ------------------------------------------
  //  Airdrop
  // ------------------------------------------
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // ------------------------------------------
  //  Create Transaction Instruction
  // ------------------------------------------
  let transferInstruction: TransactionInstruction;

  transferInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.001,
  });

  // Ref: https://solana-labs.github.io/solana-web3.js/classes/TransactionInstruction.html
  // Add read-only publickey for search.
  transferInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  let transaction = new Transaction();
  transaction.add(transferInstruction);

  // ------------------------------------------
  //  Execute Transaction
  // ------------------------------------------
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  // ------------------------------------------
  //  Search Signature
  // ------------------------------------------
  const signaturesByAddress = await connection.getConfirmedSignaturesForAddress2(reference.publicKey);
  const parsedSignature = await connection.getParsedTransaction(signaturesByAddress[0].signature);
  

  console.log('\n--- Excute Transaction ---');
  console.log('payer => ', payer.publicKey.toString());
  console.log('reference => ', reference.publicKey.toString());
  console.log('taker => ', taker.publicKey.toString());
  console.log('transferInstruction =>',  transferInstruction);
  console.log('transaction length =>',  transaction.serialize().length, 'bytes');
  console.log('Signature => ', signature);

  console.log('\n--- Search Transaction ---');
  console.log('signaturesByAddress => ', signaturesByAddress);
  console.log('parsedSignature => ', parsedSignature);
};

main();

/*
ts-node createTransferInstruction.ts
(node:92517) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

--- Excute Transaction ---
payer =>  rqS5MHuZEUaesaUBRJMLzVcr5K9upnA7LacDd7Hf7CQ
reference =>  5E2x1V4bzu79onCbbLYmt2PZNNwRvvHaBmHEnS3JfGmL
taker =>  BuZ5WUtBcBUVmD9kKJj7v2Tf5f62knY3ns7fPBw679W5
transferInstruction => TransactionInstruction {
  keys: [
    {
      pubkey: [PublicKey [PublicKey(rqS5MHuZEUaesaUBRJMLzVcr5K9upnA7LacDd7Hf7CQ)]],
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: [PublicKey [PublicKey(BuZ5WUtBcBUVmD9kKJj7v2Tf5f62knY3ns7fPBw679W5)]],
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: [PublicKey [PublicKey(5E2x1V4bzu79onCbbLYmt2PZNNwRvvHaBmHEnS3JfGmL)]],
      isWritable: false,
      isSigner: false
    }
  ],
  programId: PublicKey [PublicKey(11111111111111111111111111111111)] {
    _bn: <BN: 0>
  },
  data: <Buffer 02 00 00 00 40 42 0f 00 00 00 00 00>
}
transaction length => 248 bytes
Signature =>  5kwZD4rdKxsRMJ8zmv2G1jLoaCDKLWqDcZLEdyRSbbKZhdBXzNTKmNwRQx8zwdR2KB67uDeA9a2h1AdGYztMPfLR

--- Search Transaction ---
signaturesByAddress =>  [
  {
    blockTime: 1714211452,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5kwZD4rdKxsRMJ8zmv2G1jLoaCDKLWqDcZLEdyRSbbKZhdBXzNTKmNwRQx8zwdR2KB67uDeA9a2h1AdGYztMPfLR',
    slot: 294994114
  }
]
parsedSignature =>  {
  blockTime: 1714211452,
  meta: {
    computeUnitsConsumed: 150,
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    postBalances: [ 998995000, 1000000, 1, 0 ],
    postTokenBalances: [],
    preBalances: [ 1000000000, 0, 1, 0 ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null },
    loadedAddresses: undefined
  },
  slot: 294994114,
  transaction: {
    message: {
      accountKeys: [Array],
      instructions: [Array],
      recentBlockhash: 'HH5LK7Y436gWFVNr3F4yXf8ZfjYJaLE87g3RQtipL1Dh',
      addressTableLookups: undefined
    },
    signatures: [
      '5kwZD4rdKxsRMJ8zmv2G1jLoaCDKLWqDcZLEdyRSbbKZhdBXzNTKmNwRQx8zwdR2KB67uDeA9a2h1AdGYztMPfLR'
    ]
  },
  version: undefined
}
*/