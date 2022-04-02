const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const key = JSON.parse(fs.readFileSync('key.json'));

async function main() {
  const transactionId = await arweave.wallets.getLastTransactionID(key);
  console.log(transactionId);
}

main();

/*
% npx arlocal
arlocal started on port 1984

% node get_last_transaction_id.js
(empty)
*/
