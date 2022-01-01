// Ref: https://docs.solana.com/developing/clients/javascript-reference#transaction
const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');

async function main() {
  // Airdrop SOL for paying transactions
  let payer = web3.Keypair.generate();
  let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  // let connection = new web3.Connection('http://localhost:8899', 'confirmed'); // For debug

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
      lamports: web3.LAMPORTS_PER_SOL * 0.0123,
  }));

  transaction.add(web3.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.0345,
  }));

  // Send and confirm transaction
  // Note: feePayer is by default the first signer, or payer, if the parameter is not set
  let signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log('signature -> ', signature);
}

main();
/*
% node multiple_transfer.js
signature ->  54QoHonRnYokx1NHANR7GGYQ3M3f1Tp6dyyT7DpcfSZkd794UTv16sPQ7WB7E1W4kzBsiS9MCfu3whWR6LhsSxY2
*/
