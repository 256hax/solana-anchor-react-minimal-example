// Source: https://docs.solana.com/developing/clients/javascript-reference#transaction
import * as web3 from '@solana/web3.js';

export const main = async() => {
  // Airdrop SOL for paying transactions
  let payer = web3.Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://127.0.0.1:8899', 'confirmed');

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
};

main();

/*
% ts-node <THIS JS FILE>
signature ->  4nRgQQEcW8qsA9f9v8sTg8LByxo7hv53xjir6xp27zXdNUB31cqen16DkMoX9tgCzPJm2MppnpTswB3ghMc1KiRW
*/
