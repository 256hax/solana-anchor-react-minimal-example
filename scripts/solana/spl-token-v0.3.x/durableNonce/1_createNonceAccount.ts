// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as bs58 from "bs58";

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const feePayer = Keypair.generate();
  const nonceAccount = Keypair.generate();
  const nonceAccountAuth = Keypair.generate();

  // -------------------------------------
  //  Airdrop
  // -------------------------------------
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropAlice = await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropAlice,
  });

  // -------------------------------------
  //  Create Nonce Account
  // -------------------------------------
  let tx = new Transaction().add(
    // create nonce account
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: nonceAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        NONCE_ACCOUNT_LENGTH
      ),
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // init nonce account
    SystemProgram.nonceInitialize({
      noncePubkey: nonceAccount.publicKey, // nonce account pubkey
      authorizedPubkey: nonceAccountAuth.publicKey, // nonce account authority (for advance and close)
    })
  );
  const signature = await sendAndConfirmTransaction(
    connection,
    tx,
    [feePayer, nonceAccount],
  );

  console.log('feePayer =>', feePayer.publicKey.toString());
  console.log('nonceAccount =>', nonceAccount.publicKey.toString());
  console.log('nonceAccountAuth.publicKey =>', nonceAccountAuth.publicKey.toString());
  console.log('nonceAccountAuth.secretKey(Base58) =>', bs58.encode(nonceAccountAuth.secretKey));
  console.log('signature =>', signature);
})();

/*
% ts-node <THIS FILE>
feePayer => D5p6fh6avq7fcN872aSZGww1uR8tVC9UqXXt1793rG1q
nonceAccount => 6LfYgu4KFrTFAffoN98CsQtvLxUy1jCjKYTiyyvQNXqD
nonceAccountAuth.publicKey => 8ahaDBb5BwpViRvYKrggmCE2J4QPevnbVXFN5b7L6tN8
nonceAccountAuth.secretKey(Base58) => 3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC
signature => 9eAfrMCV37wkonAQEKGcvE66CpryvrxTEHwjAn7zcPiMUgCD38M4FkJcerrEEqtUyJhwxwwZhDPDJj1UU1EWHAd
*/