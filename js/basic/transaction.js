// Ref: https://docs.solana.com/developing/clients/javascript-reference#transaction
const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');

async function main() {
  // Airdrop SOL for paying transactions
  let payer = web3.Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://localhost:8899', 'confirmed'); // For debug

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
}

main();
/*
% node transaction.js
signature ->  4nRgQQEcW8qsA9f9v8sTg8LByxo7hv53xjir6xp27zXdNUB31cqen16DkMoX9tgCzPJm2MppnpTswB3ghMc1KiRW
*/
