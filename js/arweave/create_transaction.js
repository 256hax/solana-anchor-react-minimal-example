const Arweave = require('arweave');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

async function main() {
  let key = await arweave.wallets.generate();

  // Plain text
  let transactionA = await arweave.createTransaction({
      data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>'
  }, key);

  // Buffer
  let transactionB = await arweave.createTransaction({
      data: Buffer.from('Some data', 'utf8')
  }, key);


  console.log(transactionA);
}

main();


/*
% npx arlocal
arlocal started on port 1984

% node create_transaction.cjs
Transaction {
  format: 2,
  id: '',
  last_tx: '',
  owner: '89QpZnaDmFD0-xzyqEUu5xYELfQvJgjFmeZxR4IcpKkrXxujHI36mSS69Y3eTTGn7rS8wQ7hfyWlWupnZ9JsF5lH07eRagv0bqepeUol998rSFKlQRo_1wbCZN_tzOWNRGorHQbCoq5p1v1XZDZEFG2oPemGplmbYCKgl41tkYYP5qZvYgLRP6xQfonuYDWRTudlf6Lisnt8pP_yTSK6OVNAzFN-MKhRo5hHXsOZj0NIH55Emkn6QQOGgrO8Z2x5mLH7RJCNucQsP7UkLrmVrUj_KxNh7vM_ipTk_WaczTZ6sQ9U9It2fiKmFNlWBRsDd2hz5zjTQrWuEDZ4v-6FAbgvtKKGcwXdh0ecTa6imYVt7EaETwCgkgiy_q2e-9JEJ-NMijCgJzWRBgjO0ttlKUb_9g4fywn-LDcAIe7AnR3DMestrPZw-xw9_sYF37EjSmbUKGoxFRhd5Hrow9o_3JVgKEg9q0v9aCfTO0PavOtY6XnaY67XcOHIRCUe1A4wxJwvjSHq2_211ZwoBs89zi1fu41UIb_iqnJkONdIZ3qPOjVlFGWk0YqHrJ5w6DQQLPu898XgE9T3nyBzpWu9SrTl6bzvAUboFiF19S3uZFO8pQVrYVFLwYB9Rye_kNGOT5KIiT_Oivdy75GhsYSMak9w_i7asaePz4MFK67g-gs',
  tags: [],
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
