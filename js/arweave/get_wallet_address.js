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
  console.log(address);
}

main();


/*
% node get_wallet_address.js
96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI
*/
