// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as bs58 from 'bs58';

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const feePayer = Keypair.generate(); // This is dummy. Change to your Keypair.
  const nonceAccountAuth = Keypair.generate(); // This is dummy. Change to your Keypair.
  const nonceAccount = Keypair.generate(); // This is dummy. Change to your Keypair.
  
  const txNonceWithdraw = new Transaction().add(
    SystemProgram.nonceWithdraw({
      authorizedPubkey: nonceAccountAuth.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.00001,
      noncePubkey: nonceAccount.publicKey,
      toPubkey: feePayer.publicKey,
    })
  );

  const signatureNonceWithdraw = await sendAndConfirmTransaction(
    connection,
    txNonceWithdraw,
    [feePayer, nonceAccountAuth]
  );

  console.log('signatureNonceWithdraw =>', signatureNonceWithdraw);
})();
