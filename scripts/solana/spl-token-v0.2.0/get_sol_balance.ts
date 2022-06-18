// Source: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getBalance
import * as web3 from "@solana/web3.js";

async function main() {
  let myPubkey = web3.Keypair.generate();
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  const myPubkey_balance = await connection.getBalance(myPubkey.publicKey);

  console.log('--- Not airdrop ---');
  console.log('myPubkey_balance =>', myPubkey_balance);

  let airdropSignature = await connection.requestAirdrop(
      myPubkey.publicKey,
      web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);

  const airdropped_myPubkey_balance = await connection.getBalance(myPubkey.publicKey);

  console.log('\n--- Airdropped ---');
  console.log('airdropped_myPubkey_balance =>', airdropped_myPubkey_balance);
}

main();

/*
% node <THIS JS FILE>
--- Not airdrop ---
myPubkey_balance => 0

--- Airdropped ---
airdropped_myPubkey_balance => 1000000000
*/
