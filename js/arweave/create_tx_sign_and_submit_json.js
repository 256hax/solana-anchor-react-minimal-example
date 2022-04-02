const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const key = JSON.parse(fs.readFileSync('key.json'));

async function main() {
  // Airdrop
  const address = await arweave.wallets.jwkToAddress(key);
  const airdrop = await arweave.api.get('/mint/' + address + '/100000000000000')

  // Upload File
  // Metaplex Token Metadatas Standard: https://docs.metaplex.com/token-metadata/specification
  const data = fs.readFileSync('./assets/token_metadata_standard.json');

  // Transaction
  const transaction = await arweave.createTransaction({ data: data }, key);
  transaction.addTag('Content-Type', 'application/json');
  await arweave.transactions.sign(transaction, key);
  console.log('Transaction =>', transaction);

  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }

  console.log('-------------------------------------------------------------------');
  console.log('Get transaction    =>', 'http://127.0.0.1:1984/tx/' + transaction.id);
  console.log('Get data directly  =>', 'http://127.0.0.1:1984/' + transaction.id);
}

main();


/*
% npx arlocal
arlocal started on port 1984

% node <THIS FILE>
Transaction => Transaction {
  format: 2,
  id: 'eOeWvVlIigCmtGeqxVNjCmJwdQUcyDkvwkp9nT7AMg8',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
  tags: [ Tag { name: 'Q29udGVudC1UeXBl', value: 'YXBwbGljYXRpb24vanNvbg' } ],
  target: '',
  quantity: '0',
  data_size: '1198',
  data: <Buffer 7b 0a 20 20 22 6e 61 6d 65 22 3a 20 22 53 6f 6c 61 6e 61 41 72 74 50 72 6f 6a 65 63 74 20 23 31 22 2c 0a 20 20 22 64 65 73 63 72 69 70 74 69 6f 6e 22 ... 1148 more bytes>,
  data_root: 'YVFQDs6Pd6fHFFy8IkkRf6_pHwUzCf-k6wUde-ejGZ8',
  reward: '2354228136',
  signature: 'bEp5zgTImGyg_lK_d9E7JBjc3IQQs9Ix7IlqEJJYPKeGhyBlgUMhoNP3OzID0Xb0DpqlBxHSavAIlq7wh444SX6KEtUXnSP0A79a1wSQTa5c9B9jzdkuPVeRlbaT9Djh6ILgaPwH_39-YpmHP6utqn6ZlFgXCGOB6BMkP5IAO1pbGrgtumGhtOaQ2ZyszuoTcZmO2WE2aY-turGtHo0hdPGIREjJy5ySuSo3dwc_p25yI4eJvVHrf7Lr1K1IHpciJ8paulPjl3L_vMoknw28xrF19erEuq0lZ1_XlnQ4DGY8YmKaPr_4qK4oQlNpgBPhAKum857e9H49xaOgeHo8uVJJRsLjHydgiy71y_wp4r6S894Af3ntzqPgOrud0XvGnh0RnWQoBfcBByo-sFtCphiLlvk95SbEGKHLvFM6Wy5fIPoKrEsEH5QZgoHySM7gof40IVA8J0rSPlCj96R6Fti6zPqLZ37TRxgChrBvNgDJW64258O0m87mOFYY28DYDabhs1KH622UfyCcLrVxZiR3Gn8rfBAp86-4dzcKkXOJmYA5nHDEEB52ZwerWa2FSPzU-Nz6H9Z4-3QJ5umbaeBiaUPGntGuUmwaO_yVJ2weDCnqy4Uujm7JOvM7nKQAhPpVDPSyXDnBgEbG0OgcpnZMKl7R0Q8xgjuDMZ7e_G8',
  chunks: {
    data_root: Uint8Array(32) [
       97,  81, 80,  14, 206, 143, 119, 167,
      199,  20, 92, 188,  34,  73,  17, 127,
      175, 233, 31,   5,  51,   9, 255, 164,
      235,   5, 29, 123, 231, 163,  25, 159
    ],
    chunks: [ [Object] ],
    proofs: [ [Object] ]
  }
}
100% complete, 1/1
URL => http://127.0.0.1:1984/eOeWvVlIigCmtGeqxVNjCmJwdQUcyDkvwkp9nT7AMg8
-------------------------------------------------------------------
Get transaction    => http://127.0.0.1:1984/tx/eOeWvVlIigCmtGeqxVNjCmJwdQUcyDkvwkp9nT7AMg8
Get data directly  => http://127.0.0.1:1984/eOeWvVlIigCmtGeqxVNjCmJwdQUcyDkvwkp9nT7AMg8
*/
