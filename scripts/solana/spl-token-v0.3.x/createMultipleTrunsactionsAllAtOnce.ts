// Source: https://docs.solana.com/developing/clients/javascript-reference#transaction
import * as web3 from '@solana/web3.js';
// import sleep from 'sleep';

export const main = async() => {
  const payerA = web3.Keypair.generate();
  const payerB = web3.Keypair.generate();
  console.log('payerA Public Key -> ', payerA.publicKey.toString());
  console.log('payerB Public Key -> ', payerB.publicKey.toString());


  // const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const connection = new web3.Connection('http://127.0.0.1:8899', 'confirmed');

  // --------------------------------
  //  Airdrop
  // --------------------------------
  // Airdrop for PayerA
  console.log("Airdopping to PayerA");
  const airdropSignature = await connection.requestAirdrop(
      payerA.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // For "Too Many Requests" error for Devnet
  // console.log("sleep 10 sec...");
  // sleep.sleep(10);

  // Airdrop for PayerB
  console.log("Airdopping to PayerB");
  const airdropSignaturePayerB = await connection.requestAirdrop(
      payerB.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  const latestBlockhash2 = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash2.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignaturePayerB,
  });

  // For "Too Many Requests" error for Devnet
  // console.log("sleep 10 sec...");
  // sleep.sleep(10);


  // --------------------------------
  //  Transaction
  // --------------------------------
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
  const signature = await web3.sendAndConfirmTransaction(
    connection, // Connection
    transaction, // Transaction
    [payerA, payerB] // Signer[]
  );

  console.log('Signature -> ', signature);
};

main();

/*
% ts-node <THIS JS FILE>
payerA Public Key ->  6uR86qhU1nkJigvaNkCfTX6Jqkjh9mqakUihXdj8aDy2
payerB Public Key ->  BoyeuLu4J6JahFST3GBL1mhvhiw4RMLo6bj2LVetW8yy
Airdopping to PayerA
Airdopping to PayerB
Signature ->  31JTTqjPTuUM9PLGHjPoiWu2by5TsXhkHQef3X723pNuoitas1PWYcJWbu1cSmFcqA7kjaFrKdqgUsHGpCkrMzCv
*/

/*
If you got following error, you should have more long sleep.

```
Error: 429 Too Many Requests:  {"jsonrpc":"2.0","error":{"code": 429, "message":"Too requests for a specific RPC call, contact your app developer or support@rpcpool.com."}, "id": "99ff2fa9-c7db-4a49-b218-829b859a7f3f" }
```
*/