const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const key = JSON.parse(fs.readFileSync('key.json'));

async function main() {
  const address = await arweave.wallets.jwkToAddress(key);
  console.log('Walle Address:', address);

  const balance = await arweave.wallets.getBalance(address);
  const winston = balance;
  const ar = arweave.ar.winstonToAr(balance);

  console.log(winston, 'Winston');
  console.log(ar, 'AR');
}

main();

/*
Winston is the smallest possible unit of AR, similar to a satoshi in Bitcoin, or wei in Ethereum.
1 AR = 1000000000000 Winston (12 zeros) and 1 Winston = 0.000000000001 AR.

Source: https://docs.arweave.org/developers/server/http-api#ar-and-winston
*/


/*
% npx arlocal
arlocal started on port 1984

% node get_wallet_balance.js
Walle Address: 96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI
0 Winston
0.000000000000 AR
*/
