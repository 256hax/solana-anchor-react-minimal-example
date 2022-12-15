// Source: https://solanacookbook.com/references/offline-transactions.html#sign-transaction
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Message,
} from "@solana/web3.js";
import * as nacl from "tweetnacl";
import * as bs58 from "bs58";

// to complete a offline transaction, I will seperate them into four steps
// 1. Create Transaction
// 2. Sign Transaction
// 3. Recover Transaction
// 4. Send Transaction

(async () => {
  // create connection
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // ------------------------------------------------------------------------
  //  Account
  // ------------------------------------------------------------------------
  // create a example tx, alice transfer to bob and feePayer is `feePayer`
  // alice and feePayer are signer in this tx
  const feePayer = Keypair.generate();
  const alice = Keypair.generate();
  const bob = Keypair.generate();

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

  latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropBob = await connection.requestAirdrop(alice.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropBob,
  });

  // ------------------------------------------------------------------------
  //  1. Create Transaction
  // ------------------------------------------------------------------------
  let tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: alice.publicKey,
      toPubkey: bob.publicKey,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    })
  );

  latestBlockhash = await connection.getLatestBlockhash();
  tx.recentBlockhash = latestBlockhash.blockhash;
  tx.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

  tx.feePayer = feePayer.publicKey;
  const realDataNeedToSign = tx.serializeMessage(); // the real data singer need to sign.

  // ------------------------------------------------------------------------
  //  2. Sign Transaction
  // ------------------------------------------------------------------------
  // use any lib you like, the main idea is to use ed25519 to sign it.
  // the return signature should be 64 bytes.
  const feePayerSignature = nacl.sign.detached(
    realDataNeedToSign,
    feePayer.secretKey
  );
  const aliceSignature = nacl.sign.detached(realDataNeedToSign, alice.secretKey);

  // ------------------------------------------------------------------------
  //  3. Recover Tranasction
  // ------------------------------------------------------------------------

  // you can verify signatures before you recovering the transaction
  const verifyFeePayerSignatureResult = nacl.sign.detached.verify(
    realDataNeedToSign,
    feePayerSignature,
    feePayer.publicKey.toBytes() // you should use the raw pubkey (32 bytes) to verify
  );
  console.log(`verify feePayer signature: ${verifyFeePayerSignatureResult}`);

  const verifyAliceSignatureResult = nacl.sign.detached.verify(
    realDataNeedToSign,
    aliceSignature,
    alice.publicKey.toBytes()
  );
  console.log(`verify alice signature: ${verifyAliceSignatureResult}`);


  // there are two ways you can recover the tx

  // ------------------------------------------------------------------------
  //  3.a. Recover Tranasction (use populate then addSignauture)
  // ------------------------------------------------------------------------
  {
    let recoverTx = Transaction.populate(Message.from(realDataNeedToSign));
    recoverTx.addSignature(feePayer.publicKey, Buffer.from(feePayerSignature));
    recoverTx.addSignature(alice.publicKey, Buffer.from(aliceSignature));

    // ------------------------------------------------------------------------
    //  4. Send transaction
    // ------------------------------------------------------------------------
    console.log(
      `Case a(populate then sign): txhash => ${await connection.sendRawTransaction(recoverTx.serialize())}`
    );
  }

  // or

  // ------------------------------------------------------------------------
  //  3.b. Recover Tranasction (use populate with signature)
  // ------------------------------------------------------------------------
  {
    let recoverTx = Transaction.populate(Message.from(realDataNeedToSign), [
      bs58.encode(feePayerSignature),
      bs58.encode(aliceSignature),
    ]);

    // ------------------------------------------------------------------------
    //  4. Send transaction
    // ------------------------------------------------------------------------
    console.log(
      `Case b(populate with sign): txhash => ${await connection.sendRawTransaction(recoverTx.serialize())}`
    );
  }

  // if this process takes too long, your recent blockhash will expire (after 150 blocks).
  // you can use `durable nonce` to get rid of it.

  console.log('feePayer =>', feePayer.publicKey.toString());
  console.log('alice =>', alice.publicKey.toString());
  console.log('bob =>', bob.publicKey.toString());
})();

/*
% ts-node <THIS FILE>
verify feePayer signature: true
verify alice signature: true
Case a(populate then sign): txhash => 2uyx5oWZ6wcUmrdRZNw3B1DcdH6k1FfZkGQJoerXfSeDSZa8qc8cdEe4bLKLriDbn5LupZYyH7GxU6B7JG6NnWUW
Case b(populate with sign): txhash => 2uyx5oWZ6wcUmrdRZNw3B1DcdH6k1FfZkGQJoerXfSeDSZa8qc8cdEe4bLKLriDbn5LupZYyH7GxU6B7JG6NnWUW
feePayer => 2yd57J1kAiwsKLS6UboR7NKbGMUs8xkcfuzHawP11qxn
alice => 3GrzPRMuBwUKY3uM6i3PNY55boEGewpmrRJpPvLcRWGK
bob => Dw285j2d5b1CTE4BU4atj5uoyA8fMAVEg1arZodztBH
*/