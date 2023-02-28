// Source: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getBalance
import * as web3 from "@solana/web3.js";

export const main = async() => {
  const myPubkey = web3.Keypair.generate();
  const connection = new web3.Connection('http://127.0.0.1:8899', 'confirmed');

  const myPubkey_balance = await connection.getBalance(myPubkey.publicKey);

  console.log('--- My Balance ---');
  console.log('myPubkey_balance =>', myPubkey_balance);

  const airdropSignature = await connection.requestAirdrop(
      myPubkey.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  const airdropped_myPubkey_balance = await connection.getBalance(myPubkey.publicKey);

  console.log('\n--- My Balance after Airdropped ---');
  console.log('airdropped_myPubkey_balance =>', airdropped_myPubkey_balance);
};

main();

/*
% ts-node <THIS JS FILE>
--- Not airdrop ---
myPubkey_balance => 0

--- Airdropped ---
airdropped_myPubkey_balance => 1000000000
*/
