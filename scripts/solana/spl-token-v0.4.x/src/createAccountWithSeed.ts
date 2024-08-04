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
} from '@solana/web3.js';
import * as bs58 from 'bs58';

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ------------------------------------------------------------------------
  //  Wallet
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
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdrop = await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdrop,
  });

  // ------------------------------------------------------------------------
  //  Create PDA Account
  // ------------------------------------------------------------------------
  const basePubkey = base.publicKey;
  const seed = "robot001";
  const programId = SystemProgram.programId;

  const derived = await PublicKey.createWithSeed(basePubkey, seed, programId);
  const space = 0;
  // Seed the created account with lamports for rent exemption
  const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);

  const tx = new Transaction().add(
    // Ref: https://solana-labs.github.io/solana-web3.js/classes/SystemProgram.html#createAccountWithSeed
    SystemProgram.createAccountWithSeed({
      fromPubkey: feePayer.publicKey, // funder
      newAccountPubkey: derived,
      basePubkey: basePubkey,
      seed: seed,
      lamports: rentExemptionAmount,
      space: space,
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
  console.log('rentExemptionAmount =>', rentExemptionAmount / LAMPORTS_PER_SOL, 'SOL');
  console.log('seed: seed =>', seed);
  console.log('signature =>', signature);
};

main();

/*
% ts-node <THIS FILE>
fromPubkey: feePayer.publicKey => 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
newAccountPubkey: derived => EUr8gLoMuPJu3uYALQueBHzgstH4A1dAycp2Zti1ETRX
basePubkey: basePubkey => 9iWXqTeze3bTF4Aj4StWVA8od9KNi9aJu4jryfsXmAn
rentExemptionAmount => 0.00089088 SOL
seed: seed => robot001
signature => 2pvSZWoXiNUGUuUXCM9w1ei65XhF8dS7beyUERDADgRBv15DACyJsCpKrajsPPBf7wF7DKmqTtEncrSCP9cJpX3T
*/