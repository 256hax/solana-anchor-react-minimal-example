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
  PublicKey,
} from "@solana/web3.js";
import * as bs58 from "bs58";
import { log } from "console";

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const feePayer = Keypair.generate();

  // The below secret key is for testing purposes.
  const secretKeyNonceBase58 = '3Y22mLLggMZDJySRrq4ottv97ihyzHJjK5v711aNHS7oB9ELrhqsqPCpEyaBTjEsZjB3rvvca7RTEzV6e36AZQHA';
  const nonceAccount = Keypair.fromSecretKey(bs58.decode(secretKeyNonceBase58));
  // Normally, Keypair.generate() should be used.
  // const nonceAccount = Keypair.generate();
  
  const secretKeyAuthBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKeyAuthBase58));

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
feePayer => 9qSDotnB7HM4uev4DxjyXPccTPQSh2t54CZyUNM9Y6Kx
nonceAccount => Huh4F3cWrrvUSSUaxyQFw22y8n2ohS76EwA9YuKoAdGQ
nonceAccountAuth.publicKey => 8ahaDBb5BwpViRvYKrggmCE2J4QPevnbVXFN5b7L6tN8
nonceAccountAuth.secretKey(Base58) => 3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC
signature => 2TbuTrCi9HCwLWtEo2xaEiM9WeLtjEKAXQDsrXspFagXxXKZ4oMen724AyRPzzZF4zfFCWZNFfZXGEmgSu6o3yiF
*/