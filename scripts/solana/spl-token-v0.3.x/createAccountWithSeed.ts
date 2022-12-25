// Ref: https://solanacookbook.com/references/accounts.html#how-to-create-accounts-with-seeds
import {
  PublicKey,
  SystemProgram,
  Connection,
  clusterApiUrl,
  Transaction,
  Keypair,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as bs58 from "bs58";

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ------------------------------------------------------------------------
  //  Create Account from Secret Key
  // ------------------------------------------------------------------------
  // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
  const feePayer = Keypair.fromSecretKey(
    bs58.decode('588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2')
  );

  // // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
  // const base = Keypair.fromSecretKey(
  //   bs58.decode(
  //     "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
  //   )
  // );
  const base = Keypair.generate(); // Generate random address for example

  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  let latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropAlice = await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropAlice,
  });

  // ------------------------------------------------------------------------
  //  Create PDA Account
  // ------------------------------------------------------------------------
  let basePubkey = base.publicKey;
  let seed = "robot001";
  let programId = SystemProgram.programId;

  let derived = await PublicKey.createWithSeed(basePubkey, seed, programId);

  const tx = new Transaction().add(
    // Ref: https://solana-labs.github.io/solana-web3.js/classes/SystemProgram.html#createAccountWithSeed
    SystemProgram.createAccountWithSeed({
      fromPubkey: feePayer.publicKey, // funder
      newAccountPubkey: derived,
      basePubkey: basePubkey,
      seed: seed,
      lamports: LAMPORTS_PER_SOL * 0.01, // 0.01 SOL
      space: 0,
      programId: programId,
    })
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    tx,
    [feePayer, base] // Signers
  );

  console.log('fromPubkey: feePayer.publicKey =>', feePayer.publicKey.toString());
  console.log('newAccountPubkey: derived =>', derived.toString());    
  console.log('basePubkey: basePubkey =>', base.publicKey.toString());
  console.log('seed: seed =>', seed);
  console.log('signature =>', signature);
};

main();

/*
% ts-node <THIS FILE>
fromPubkey: feePayer.publicKey => 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
newAccountPubkey: derived => ApFZ4YJmDmazTAA14JJVWEB8bqDsoGtePXgFRuYVmU4R
basePubkey: basePubkey => 7TPQvePxVZEKXYXqDqDncXbKMzQfWZhRuX44V1be2UG1
seed: seed => robot001
signature => 3TSxGn6dS7Mc19CDB76wo6nY4k4T4dBm7ULcLVyH5JERE1EcNjuwt6xKMMVgxBbyCTh7WY37XY9MxAAiv1cSVzb4
*/