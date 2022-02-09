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

  const transaction = await arweave.createTransaction({
      target: address,
      quantity: arweave.ar.arToWinston('10.5')
  }, key);

  const result = await arweave.transactions.sign(transaction, key);

  console.log(transaction);
}

main();


/*
% npx arlocal
arlocal started on port 1984

% node create_tx_and_sign.js
Transaction {
 format: 2,
 id: 'e6Gc2teEnknB5GeYKxCEMAhTowgAwx-xSnT07wXwsiU',
 last_tx: '0pu2jb7e7iliw4qk1idjzjzpc37prjey2b3vx9a0oikgn5320gn6uayebwtdyhjp',
 owner: '4SKWF0kAhYSsx7niYObei7yuqHR2GP1QLMB9ba4raZEX3s_TWUxl-xmdoGKoTnzDUmNxZAs-1RRMMH1wo50_XBoVB45eLcahjzSHYXp5xqseEgHnSJrOB-unQYGnyWufWJl5QFFqKsm__3bb3ZhS2VQHyrItx-0mdGfOOyA1prRZbPH3a4rH5zXnh1_-T0cJvQSRGD-PKgAnsbhJPHCSb_QvQw14n2UBJhX2iZopAjJSgtvcFtiQA7IQQe1oucj05NVeTL9SDpcQT_2D1QZlhcEbe5pM6JnvRP9s4Tby1eyjPnFgG5sc5rUFwJg0i5Ofv2AoNdd8gpgaRwvRLb1IlU5uoMkEpqn2Tc3Q00RmBbgWPTxO3-0hOvjf8dg72_T58tZDM9AjhsJITwDPt4ALza3ombX6oPOOMZdPuNdqVjuBWwc0I7IvDj3-jmqOdwmkhpmTc2S_QIgob9eS3bxkbzqzb0EeoxUfiCUF_2peDVd6X7vG-vqt92REr8YQOQfCGPsMd1dBqq9piCMiHxG-rx1ki5hkvkB9bDC0ClOOOXIJZzSPNi8szyd8pmQTvI1lHmG4VWDhwuBE_jTKpPc1IFv5TU-FcA5EFaoEqa8uMofM9Aas6zN2Qgn3ImHoP6RY38_065YMm4RtvPNpzxy0ZdP8o0Fb4fLJjkJl_qqdq1s',
 tags: [],
 target: '1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY',
 quantity: '10500000000000',
 data_size: '0',
 data: Uint8Array(0) [],
 data_root: '',
 reward: '0',
 signature: 'pesw407FyLQNqKCBaLxTZRgFeSZsba1ZziEE9Nsl2FgqV26aAWjStwiMquPSUhI0pm1Shwwl-tAsRzRWETelVxyHscJ_jNTBy84-D4wtdhSnR7-IzGHUkFhoUCwVN6FWlx0O6VisQuhR1Gx1XUVif-Te2qEqMPZijQEMfcpx_uB17TDH4DFbAVWk_1MXBuqr-S2T1VgzVN1Svc67UXk9rtJYHaSaz1AbWmhfqVSHQXsDTiz2ay0MgGOoIIUu05waS-TFek2KIDUsycVHvSEFA9sDp1tGKK2gxwATSY7oesq9mTcI77GpX72QUqUF0xV5WAJZItSpLnZxRucrz5X5tvxs2dtDRUt-ezo_p6ZYc21XppFh6ffc2zXyP_sK5w_Ct5XWAzTW9QdcNIEBYUrrCEOPSpNcPn1CEHYvaTKTwH5gQ1ebaRK2Tmk65DEipYR_z71NS-vzfibd87Md_gh4RaTbNZ4jA9Jm1-1lvGMpNHmuIcNLZJxXr3LuOyZ39Py__cx3wphC3nKT1v38PQjTT51L1spntwZ92r168ALzl0bVZxROttGGGmPogxipKMKV7CgFm6Nrn2v6HiPT2TZK9T_XctRMwff5q99SWe3ZD6WOxfG9_W2UJWKgCOXN95zX5ZCJsjJ7xZWyWwmo67RccTTTKUIKY9DKJWghiGEEnZQ',
 chunks: { chunks: [], data_root: Uint8Array(0) [], proofs: [] }
}
*/
