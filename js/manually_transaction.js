// Ref: https://docs.solana.com/developing/clients/javascript-reference#transaction
const web3 = require('@solana/web3.js');
const nacl = require('tweetnacl');

async function main() {
  // Airdrop SOL for paying transactions
  let payer = web3.Keypair.generate();
  let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  let airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  let toAccount = web3.Keypair.generate();

  // Alternatively, manually construct the transaction
  let recentBlockhash = await connection.getRecentBlockhash();
  let manualTransaction = new web3.Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: payer.publicKey
  });
  manualTransaction.add(web3.SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: toAccount.publicKey,
      lamports: 1000,
  }));

  let transactionBuffer = manualTransaction.serializeMessage();
  let signature = nacl.sign.detached(transactionBuffer, payer.secretKey);

  manualTransaction.addSignature(payer.publicKey, signature);

  let isVerifiedSignature = manualTransaction.verifySignatures();
  console.log(`The signatures were verifed: ${isVerifiedSignature}`)

  let rawTransaction = manualTransaction.serialize();

  let tx_signature = await web3.sendAndConfirmRawTransaction(connection, rawTransaction);

  console.log('tx_signature -> ', tx_signature);
}

main();
/*
% node manually_transaction.js
The signatures were verifed: true
tx_signature ->  3kKWgWqbcR43KtE7pKiM8Ktjm5zoGw4pohAsWgj8GkV11SeMLb8uHVfSBS4AhhoPF5SgK2dNsAPUZ9MAdWrtBoz3
*/
