import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionBlockhashCtor,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export const main = async () => {
  // let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

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
  let transferInstruction: any;

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
  console.log('Signature => ', signature);
  console.log('\n--- Search Transaction ---');
  console.log('signaturesByAddress => ', signaturesByAddress);
  console.log('parsedSignature => ', parsedSignature);
};

main();

/*
% ts-node <THIS JS FILE>

--- Excute Transaction ---
payer =>  Ak6NdaUWqr4niNPYKsUe9LCiiaytTmWYHbu3CvKEgp8Z
reference =>  ZSorocWCiSBUckZVt5hqd3Ff744RmsKzzNxLLwZcg3d
taker =>  3Yg4CyJT1EkNx96sgaKf5iiXF5715qMm4HAHJxFVkX1A
transferInstruction => TransactionInstruction {
  keys: [
    {
      pubkey: [PublicKey [PublicKey(Ak6NdaUWqr4niNPYKsUe9LCiiaytTmWYHbu3CvKEgp8Z)]],
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: [PublicKey [PublicKey(3Yg4CyJT1EkNx96sgaKf5iiXF5715qMm4HAHJxFVkX1A)]],
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: [PublicKey [PublicKey(ZSorocWCiSBUckZVt5hqd3Ff744RmsKzzNxLLwZcg3d)]],
      isWritable: false,
      isSigner: false
    }
  ],
  programId: PublicKey [PublicKey(11111111111111111111111111111111)] {
    _bn: <BN: 0>
  },
  data: <Buffer 02 00 00 00 40 42 0f 00 00 00 00 00>
}
Signature =>  3vqKs1JWnpSw2FAjU1qQQWiSoeDSFFdyJGgxJB7ocE1oPgq9o5WgLk4XWyGMduanNhcAdUNJz9B3moa3CPzQSsv2

--- Search Transaction ---
signaturesByAddress =>  [
  {
    blockTime: 1674096985,
    confirmationStatus: 'confirmed',
    err: null,
    memo: null,
    signature: '3vqKs1JWnpSw2FAjU1qQQWiSoeDSFFdyJGgxJB7ocE1oPgq9o5WgLk4XWyGMduanNhcAdUNJz9B3moa3CPzQSsv2',
    slot: 10501
  }
]
parsedSignature =>  {
  blockTime: 1674096985,
  meta: {
    computeUnitsConsumed: 0,
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
  slot: 10501,
  transaction: {
    message: {
      accountKeys: [Array],
      addressTableLookups: null,
      instructions: [Array],
      recentBlockhash: '4CtBaweswY6i4zYXNrMTMus3wst4CW29tXTzCxzvEH9Y'
    },
    signatures: [
      '3vqKs1JWnpSw2FAjU1qQQWiSoeDSFFdyJGgxJB7ocE1oPgq9o5WgLk4XWyGMduanNhcAdUNJz9B3moa3CPzQSsv2'
    ]
  },
  version: undefined
}
*/