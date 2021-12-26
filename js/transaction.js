// Ref: https://docs.solana.com/developing/clients/javascript-reference#transaction
const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');
const cluster = 'devnet';
// const cluster = 'http://localhost:8899'; // for debug

async function main() {
  // Airdrop SOL for paying transactions
  let payer = web3.Keypair.generate();
  let connection = new web3.Connection(
      web3.clusterApiUrl(cluster),
      // cluster, // for debug
      'confirmed'
  );

  let airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  let toAccount = web3.Keypair.generate();

  // Create Simple Transaction
  let transaction = new web3.Transaction();

  // Add an instruction to execute
  transaction.add(web3.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: 1000,
  }));

  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  let signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log('signature -> ', signature);
}

main();
/*
% node transaction.js
signature ->  4nRgQQEcW8qsA9f9v8sTg8LByxo7hv53xjir6xp27zXdNUB31cqen16DkMoX9tgCzPJm2MppnpTswB3ghMc1KiRW
*/
