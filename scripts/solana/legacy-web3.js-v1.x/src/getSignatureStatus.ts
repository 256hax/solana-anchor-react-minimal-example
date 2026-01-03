// Ref:
//  Single: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getSignatureStatus
//  Multiple: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getSignatureStatuses
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

// const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

export const createTransaction = async () => {
  const payer = Keypair.generate();

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

  const toAccount = Keypair.generate();

  let transaction = new Transaction();
  transaction.add(SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: toAccount.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  }));

  // Send and confirm transaction
  // Ref: https://solana-labs.github.io/solana-web3.js/modules.html#sendAndConfirmTransaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  const signature = await sendAndConfirmTransaction(
    connection, // Connection
    transaction, // Transaction
    [payer] // Signer[]
  );

  console.log('Signature -> ', signature);
  return signature;
};

export const main = async () => {
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
[Note]
If you get unexpected response, try to use "connection.getParsedTransaction".
I encoutered something wrong response(e.g. always value: null) when I use "connection.getSignatureStatus".

Or add reference publickey to instruction then, get signature information using that.

e.g.
```
  const reference = Keypair.generate();
  transferInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );
  const signaturesByAddress = await connection.getConfirmedSignaturesForAddress2(reference.publicKey);
```

Full code:
https://github.com/256hax/solana-anchor-react-minimal-example/blob/128504332ba462535ca6c0f02f77b0bce3f4e350/scripts/solana/spl-token-v0.3.x/createTransferInstruction.ts#L69

Thats's same as findReference in Solana Pay approach.
https://docs.solanapay.com/api/core/function/findReference
*/

/*
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