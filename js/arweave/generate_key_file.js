const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const key_file_name = 'key.json';

async function main() {
  const key = await arweave.wallets.generate();
  fs.writeFileSync(key_file_name, JSON.stringify(key));
  console.log('Generated Key File =>', __dirname + '/' + key_file_name);
}

main();

/*
% node generate_key_file.js
Generated Key File => /Users/user/Documents/Programming/Blockchain/solana-anchor-react-minimal-example/js/arweave/key.json
*/
