const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const key = JSON.parse(fs.readFileSync('key.json'));

async function main() {
  const transaction = await arweave.createTransaction({
      data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>',
  }, key);

  transaction.addTag('Content-Type', 'text/html');
  transaction.addTag('key2', 'value2');

  console.log(transaction);
}

main();

/*
% npx arlocal
arlocal started on port 1984

% node create_tx_with_tags.js
Transaction {
  format: 2,
  id: '',
  last_tx: '0pu2jb7e7iliw4qk1idjzjzpc37prjey2b3vx9a0oikgn5320gn6uayebwtdyhjp',
  owner: '7RB7yEt8gtSOxklBhKkKVBKkB8BWBvkbu3hMQFzsOum_WHJmXu8hNaSsaWq8Fk4VAQrMGFtKEXya_MyD5Q6utTSC5QX9MFgfJ1Txh9lpF4vLahGLIBbi8bB1xcC7_TUSK4SL9X-rxposTvGzG0S_N53ZAuF6eqKRhseScaZGnea8S0_3pMGKG93RYXpw4W6yGylPvwcXiX_uvJYukPR34Vj6uwwPmh-VRrhVx8A8DjBKQxntqy69g_1P2qtN5uigNK7TdAmyc-l8NktxNcIOOZxayilcmRG4g1dQjBOdPbcKe-9BIV0ITWaFMMJ1aMxCIRMGg0rfbhBqhofF-6o1nz5T9Ja1JANBLOqc52Omm1fQcRYQ4RjQOolfE_UaEAxUAjDtdGgV8AJ4T1IT0Ko6tgB61PQfSLRmCUrQaknKIJxZbPZ6FfkjjYDZtTkcL3-lqu31TkNuN4BGBX3nSR_FpKI19uRLfLPBpid37ZA6Hi2FQsaFnXzxSMRpBh0V_pCKfBcg9g4dvqmiiUIRTgrXetTPjZim8vB3ijTANFh1cvp-F0BlJ8b4c-7EYxDw4kTMhYKPQl56TslFjpjoJwpWZrJjqw6RWh1z0CfmtoLGIrnZXbkxtnA7hqUVG9Nt7gF4ezmzT85fjIFIQG9KpqYRvBJDzKFbojXRRjy_NnI1VXE',
  tags: [
    Tag { name: 'Q29udGVudC1UeXBl', value: 'dGV4dC9odG1s' },
    Tag { name: 'a2V5Mg', value: 'dmFsdWUy' }
  ],
  target: '',
  quantity: '0',
  data_size: '88',
  data: Uint8Array(88) [
     60, 104, 116, 109, 108,  62,  60, 104, 101,  97, 100,  62,
     60, 109, 101, 116,  97,  32,  99, 104,  97, 114, 115, 101,
    116,  61,  34,  85,  84,  70,  45,  56,  34,  62,  60, 116,
    105, 116, 108, 101,  62,  72, 101, 108, 108, 111,  32, 119,
    111, 114, 108, 100,  33,  60,  47, 116, 105, 116, 108, 101,
     62,  60,  47, 104, 101,  97, 100,  62,  60,  98, 111, 100,
    121,  62,  60,  47,  98, 111, 100, 121,  62,  60,  47, 104,
    116, 109, 108,  62
  ],
  data_root: 'GQunzmbwk2_JPU7oJOmLrTMvj8v_7BJaF0weyjVn5Nc',
  reward: '172931616',
  signature: '',
  chunks: {
    data_root: Uint8Array(32) [
       25, 11, 167, 206, 102, 240, 147, 111,
      201, 61,  78, 232,  36, 233, 139, 173,
       51, 47, 143, 203, 255, 236,  18,  90,
       23, 76,  30, 202,  53, 103, 228, 215
    ],
    chunks: [ [Object] ],
    proofs: [ [Object] ]
  }
}
*/
