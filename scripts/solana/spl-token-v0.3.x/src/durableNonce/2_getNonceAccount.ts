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
  const nonceAccountPubkey = new PublicKey('Huh4F3cWrrvUSSUaxyQFw22y8n2ohS76EwA9YuKoAdGQ');

  const accountInfo = await connection.getAccountInfo(nonceAccountPubkey);

  if (!accountInfo) throw Error('Nonce Account not found. Create Nonce Account first.');
  const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);
  console.log('nonce =>', nonceAccount.nonce);
  console.log('authority =>', nonceAccount.authorizedPubkey.toString());
  console.log('fee calculator =>', JSON.stringify(nonceAccount.feeCalculator));
})();

/*
% ts-node <THIS FILE>
nonce => 7NE62rJbf775M18hJsyCA54ywqeKD15nxnySzcoVAN2H
authority => 8ahaDBb5BwpViRvYKrggmCE2J4QPevnbVXFN5b7L6tN8
fee calculator => {"lamportsPerSignature":5000}
*/