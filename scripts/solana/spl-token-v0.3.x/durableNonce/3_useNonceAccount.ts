// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  NonceAccount,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import * as bs58 from "bs58";

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const feePayer = Keypair.generate();

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
  //  Use Nonce Account
  // -------------------------------------
  const nonceAccountPubkey = new PublicKey('Huh4F3cWrrvUSSUaxyQFw22y8n2ohS76EwA9YuKoAdGQ');
  const nonceAccountInfo = await connection.getAccountInfo(nonceAccountPubkey);

  const secretKeyBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));

  if (nonceAccountInfo) {
    const nonceAccount = NonceAccount.fromAccountData(nonceAccountInfo.data);

    let tx = new Transaction().add(
      // nonce advance must be the first insturction
      SystemProgram.nonceAdvance({
        noncePubkey: nonceAccountPubkey,
        authorizedPubkey: nonceAccountAuth.publicKey,
      }),
      // after that, you do what you really want to do, here we append a transfer instruction as an example.
      SystemProgram.transfer({
        fromPubkey: feePayer.publicKey,
        toPubkey: nonceAccountAuth.publicKey,
        lamports: LAMPORTS_PER_SOL * 0.01,
      })
    );
    // assign `nonce` as recentBlockhash
    tx.recentBlockhash = nonceAccount.nonce;
    tx.feePayer = feePayer.publicKey;
    tx.sign(
      feePayer,
      nonceAccountAuth
    ); /* fee payer + nonce account authority + ... */

    const signature = await connection.sendRawTransaction(tx.serialize());

    console.log('feePayer =>', feePayer.publicKey.toString());
    console.log('nonce =>', nonceAccount.nonce);
    console.log('authority =>', nonceAccount.authorizedPubkey.toString());
    console.log('fee calculator =>', JSON.stringify(nonceAccount.feeCalculator));
    console.log('signature =>', signature);
  } else {
    console.log('Nonce Account not found. Create Nonce Account first.');
  }
})();

/*
% ts-node <THIS FILE>
feePayer => Fd4zt2yiQevF26rxm7f95MpB7uRUUTi1m9LeZ3Uex9CH
nonce => 7NE62rJbf775M18hJsyCA54ywqeKD15nxnySzcoVAN2H
authority => 8ahaDBb5BwpViRvYKrggmCE2J4QPevnbVXFN5b7L6tN8
fee calculator => {"lamportsPerSignature":5000}
signature => SKQanHHKjeVVtyp21haHyCu98scAqmaUHLD699ijMhiBtPVbCf66DmVM8f3FK3KwjQ9huDnDNonwxkWUrpinCWs
*/