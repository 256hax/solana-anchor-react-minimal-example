// Ref:
//  Single: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getParsedTransaction
//  Multiple: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getParsedTransactions
import * as web3 from "@solana/web3.js";

// const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
const connection = new web3.Connection('http://127.0.0.1:8899', 'confirmed');
  
export const createTransaction = async() => {
  let payer = web3.Keypair.generate();

  let airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  let toAccount = web3.Keypair.generate();

  let transaction = new web3.Transaction();
  transaction.add(web3.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.01,
  }));

  // Send and confirm transaction
  // Ref: https://solana-labs.github.io/solana-web3.js/modules.html#sendAndConfirmTransaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  let signature = await web3.sendAndConfirmTransaction(
    connection, // Connection
    transaction, // Transaction
    [payer] // Signer[]
  );

  console.log('Signature -> ', signature);
  return signature;
};

export const main = async() => {
  console.log('--- Case 1: Available TX Status ---');
  
  const availableTx = await createTransaction();
  const availableTxStatus = await connection.getParsedTransaction(availableTx);
  console.log(availableTxStatus);

  console.log('\n--- Case 2: Unavailable TX Status ---');
  const unavailableTx = 'DummyfWTUVYSwTqiu9eidviC4nqTZZtJ7spT33wfuKtxG2813EwX3c7qo9qDfMHauqvPKpufGWsKRRxtqq5uH9j'; // Stub. TX doesn't exist.
  console.log('Signature(unavailble) =>', unavailableTx);
  
  const unavailableTxStatus = await connection.getParsedTransaction(unavailableTx);
  console.log(unavailableTxStatus);
};

main();

/*
--- Case 1: Available TX Status ---
Signature ->  3xH1NUdQJXLNEqpZiDxbBf7KgJoc6XmZZKUTTwZCgG9Jcip5kCQbHHMALfi26jvdUcm8fXa2R7C7mcoQo3VByrHj
{
  blockTime: 1664463161,
  meta: {
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
    status: { Ok: null },
    computeUnitsConsumed: undefined
  },
  slot: 7447,
  transaction: {
    message: {
      accountKeys: [Array],
      addressTableLookups: null,
      instructions: [Array],
      recentBlockhash: 'BUr4vFMJr9F1zWM9ovBPArWGyfDiyFwaZg4hWrTqPuoD'
    },
    signatures: [
      '3xH1NUdQJXLNEqpZiDxbBf7KgJoc6XmZZKUTTwZCgG9Jcip5kCQbHHMALfi26jvdUcm8fXa2R7C7mcoQo3VByrHj'
    ]
  },
  version: undefined
}

--- Case 2: Unavailable TX Status ---
Signature(unavailble) => DummyfWTUVYSwTqiu9eidviC4nqTZZtJ7spT33wfuKtxG2813EwX3c7qo9qDfMHauqvPKpufGWsKRRxtqq5uH9j
null
*/


/*
[Note]
If you get unexpected response, try to use "connection.getSignatureStatus" or "connection.getParsedTransaction".
I encoutered something wrong response(ex: always null) by "connection.getSignatureStatus".
*/