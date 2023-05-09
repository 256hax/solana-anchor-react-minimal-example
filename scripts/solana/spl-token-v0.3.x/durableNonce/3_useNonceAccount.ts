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
  const secretKeyBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
  const nonceAccountAuth = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));

  const nonceAccountPubkey = new PublicKey('6LfYgu4KFrTFAffoN98CsQtvLxUy1jCjKYTiyyvQNXqD');
  const nonceAccountInfo = await connection.getAccountInfo(nonceAccountPubkey);

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
feePayer => G4JxPXmzZcSeDf1zK6a94BNyXdDaaGFy9YSwiwadXC6p
nonce => 5KMKpDTMSYKabdQLm4997vUv4gFYxy9gRTqBAeozBJuS
authority => 8ahaDBb5BwpViRvYKrggmCE2J4QPevnbVXFN5b7L6tN8
fee calculator => {"lamportsPerSignature":5000}
signature => 25R2UEuNAZqU4CG6RJsqzaU55Upnm4zHTwAnu9kfUUt788gw8GufjQDVeAshNCbCjLLhY2rakdX525JgieVFEDrV
*/