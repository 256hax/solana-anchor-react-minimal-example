// Ref: https://solanacookbook.com/references/offline-transactions.html#durable-nonce
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  NonceAccount,
} from "@solana/web3.js";

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // -------------------------------------
  //  Get Nonce Account Info
  // -------------------------------------
  const nonceAccountPubkey = new PublicKey('6LfYgu4KFrTFAffoN98CsQtvLxUy1jCjKYTiyyvQNXqD');

  const accountInfo = await connection.getAccountInfo(nonceAccountPubkey);
  
  if (accountInfo) {
    const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);
    console.log('nonce =>', nonceAccount.nonce);
    console.log('authority =>', nonceAccount.authorizedPubkey.toString());
    console.log('fee calculator =>', JSON.stringify(nonceAccount.feeCalculator));
  } else {
    console.log('Nonce Account not found. Create Nonce Account first.');
  }
})();

/*
% ts-node <THIS FILE>
nonce => 6RFon6fcbM5rKcADgEQy2fcyrovED4CsNC34Mi8jPkh8
authority => Axxqs2eXmxQHsrYTREcSoVmFb64u32ZYS7Bdj11drFVN
fee calculator => {"lamportsPerSignature":5000}
*/