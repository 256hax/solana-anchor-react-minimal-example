// Ref:
//  Single: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getSignatureStatus
//  Multiple: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getSignatureStatuses
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
  const availableTxStatus = await connection.getSignatureStatus(availableTx);
  console.log(availableTxStatus);

  console.log('\n--- Case 2: Unavailable TX Status ---');
  const unavailableTx = 'DummyfWTUVYSwTqiu9eidviC4nqTZZtJ7spT33wfuKtxG2813EwX3c7qo9qDfMHauqvPKpufGWsKRRxtqq5uH9j'; // Stub. TX doesn't exist.
  console.log('Signature(unavailble) =>', unavailableTx);
  
  const unavailableTxStatus = await connection.getSignatureStatus(unavailableTx);
  console.log(unavailableTxStatus);
};

main();

/*
Case 1: Create TX then get status

% ts-node <THIS FILE>
--- Case 1: Available TX Status ---
Signature ->  2uiGWNeeew8oAYCh2qHEY63tcK2U1qZFPwCtqXPKn2jhyM6X9SXHbKyg9wHHhfUVTf5qAecfJ3uPyspJ4oror6hY
{
  context: { slot: 15104 },
  value: {
    confirmationStatus: 'confirmed',
    confirmations: 0,
    err: null,
    slot: 15104,
    status: { Ok: null }
  }
}

--- Case 2: Unavailable TX Status ---
Signature(unavailble) => DummyfWTUVYSwTqiu9eidviC4nqTZZtJ7spT33wfuKtxG2813EwX3c7qo9qDfMHauqvPKpufGWsKRRxtqq5uH9j
{ context: { slot: 15104 }, value: null }
*/

/*
[Note]
If you get unexpected response, try to use "connection.getSignatureStatus" or "connection.getParsedTransaction".
I encoutered something wrong response(e.g. always null) by "connection.getSignatureStatus".
*/