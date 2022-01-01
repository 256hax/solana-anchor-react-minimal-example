// Ref: https://docs.solana.com/developing/clients/javascript-reference#transaction
const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');
const sleep = require('sleep');

async function main() {
  let payerA = web3.Keypair.generate();
  let payerB = web3.Keypair.generate();
  console.log('payerA Public Key -> ', payerA.publicKey.toString());
  console.log('payerB Public Key -> ', payerB.publicKey.toString());


  let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  // let connection = new web3.Connection('http://localhost:8899', 'confirmed'); // For debug


  // --- Airdrop ---
  // Airdrop for PayerA
  let airdropSignature = await connection.requestAirdrop(
      payerA.publicKey,
      web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  // For "Too Many Requests" error
  sleep.sleep(10);

  // Airdrop for PayerB
  let airdropSignaturePayerB = await connection.requestAirdrop(
      payerB.publicKey,
      web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignaturePayerB);

  // For "Too Many Requests" error
  sleep.sleep(10);


  // --- Transaction ---
  let transaction = new web3.Transaction();

  // Transaction PayerA
  transaction.add(web3.SystemProgram.transfer({
      fromPubkey: payerA.publicKey,
      toPubkey: payerB.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.0123,
  }));

  // Transaction PayerB
  transaction.add(web3.SystemProgram.transfer({
      fromPubkey: payerB.publicKey,
      toPubkey: payerA.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.0345,
  }));

  // Send and confirm transaction
  // Ref: https://solana-labs.github.io/solana-web3.js/modules.html#sendAndConfirmTransaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  let signature = await web3.sendAndConfirmTransaction(
    connection, // Connection
    transaction, // Transaction
    [payerA, payerB] // Signer[]
  );

  console.log('Signature -> ', signature);
}

main();
/*
% node multiple_signers_and_transfer.js
payerA Public Key ->  ZeKo8prhWKSSmvPrsv3js7TXyxQfiyiYMcWs1NBG4Vm
payerB Public Key ->  3fE3MAUwG45rYDH2RU8wsZDfterGjBxxffsLf24Ujiq8
Signature ->  FkF8LbjYGE4SprCZJSrrxboePnQ5GjTyQpURmo6SLXLtsbd5rS1ZsinUeMxuf8gM4L3Cby73wL5Lo6XEZ7Sqk8W
*/

/*
If you got following error, you should have more long sleep.

```
Error: 429 Too Many Requests:  {"jsonrpc":"2.0","error":{"code": 429, "message":"Too requests for a specific RPC call, contact your app developer or support@rpcpool.com."}, "id": "99ff2fa9-c7db-4a49-b218-829b859a7f3f" }
```
*/
