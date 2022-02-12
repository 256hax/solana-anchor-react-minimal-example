const Arweave = require('arweave');
const { default: ArLocal } = require("arlocal");
const fs = require('fs');

let port = 1985; // Avoid conflicts existing ArLocal process
const arweave = Arweave.init({
    host: '127.0.0.1',
    port: port,
    protocol: 'http'
});

const key = JSON.parse(fs.readFileSync('key.json'));

async function main() {
  // --- Start ArLocal ---
  const arLocal = new ArLocal(port);
  await arLocal.start();

  // --- Airdrop ---
  const address = await arweave.wallets.jwkToAddress(key);
  // Airdrop AR from ArLocal. http://127.0.0.1:1984/mint/<ADDRESS>/<AMOUNT>
  // 100 AR = 100000000000000 Winston
  await arweave.api.get('mint/' + address + '/100000000000000');


  // --- Transaction ---
  const data = '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>';

  const transaction = await arweave.createTransaction({ data: data }, key);
  await arweave.transactions.sign(transaction, key);
  console.log('Transaction =>', transaction);

  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }

  // --- Stop ArLocal ---
  await arLocal.stop();
}

main();


/*
% node arlocal_builtin_example.js
arlocal started on port 1985
[2022/2/9 23:13:59]   <-- GET /mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000
[2022/2/9 23:13:59]   --> GET /mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000 200 23ms 15b
[2022/2/9 23:13:59]   <-- GET /tx_anchor
[2022/2/9 23:13:59]   --> GET /tx_anchor 200 3ms 0b
[2022/2/9 23:13:59]   <-- GET /price/88
[2022/2/9 23:13:59]   --> GET /price/88 200 1ms 9b
Transaction => Transaction {
  format: 2,
  id: '9b8Z75UV51alKVDYPezfQzjiL1qmeW67C4qPTVloBRE',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
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
  signature: 'l88Pswo2kXBF5B_DTb86hbCUTJh2d3oSYyRgBPacq5qhTBhemq_9L3pV1njK-hAdKmsn_KIyjm_bQvHn2c3clF3Yx8nmVp6oxqtkRr4ROM7aU4qLeBYGYlkD7YdY4ChO2T2C_xD_fS6TAYXRZZLsD4AQHw5Bw-uIyzq3WyF1h6CvQ9YqszuwYr8PuWRfGHvU9lG0SZ7I5GzQagZU2N2Wo9dbQVT3T9lNhkaqo4WGeLYfOp6a-4M0E1EQCQFGLLLQfOsKZM9sxw6VRNB32_Awqq5XxuY1vlzg-4C2_A5LAkfrsCRfM-DDNPAO8eKaNlCiLTNN7-_dOVuEx7vW6Efr-zz4t6bAd4gvGBBMEqnjwLVr-nYXOw9xy3ICNzyJ1NUe0kf0CS9DmirUTahE01YHi2ZwK8kMn3ZPn66ywk-598ajKK5Y_Q9vHhsLbxk7U0nXr6j9ufdnRjAWfVRu285gI4feRKrk1l4lINwQVFimcb1n8wMyjGrVG5XPUuaxt4v0u28VwslRpsS_tC6VJoxLFZlKNfKXGqkaj_tdylnoNSK6aqF-HChPeLITdBH5hqJNBRimSMuuz8M-uvGJYa92EZR7J6zE5se2zZn81o5E6yLxM2PsoVwAwNfoUBrFBL2CBD0UFlNUslB35FlCBRBrpoCpk600wSPx141DTXZZRw8',
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
[2022/2/9 23:13:59]   <-- POST /tx
[2022/2/9 23:13:59] post {
  format: 2,
  id: '9b8Z75UV51alKVDYPezfQzjiL1qmeW67C4qPTVloBRE',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
  tags: [],
  target: '',
  quantity: '0',
  data: 'PGh0bWw-PGhlYWQ-PG1ldGEgY2hhcnNldD0iVVRGLTgiPjx0aXRsZT5IZWxsbyB3b3JsZCE8L3RpdGxlPjwvaGVhZD48Ym9keT48L2JvZHk-PC9odG1sPg',
  data_size: '88',
  data_root: 'GQunzmbwk2_JPU7oJOmLrTMvj8v_7BJaF0weyjVn5Nc',
  reward: '172931616',
  signature: 'l88Pswo2kXBF5B_DTb86hbCUTJh2d3oSYyRgBPacq5qhTBhemq_9L3pV1njK-hAdKmsn_KIyjm_bQvHn2c3clF3Yx8nmVp6oxqtkRr4ROM7aU4qLeBYGYlkD7YdY4ChO2T2C_xD_fS6TAYXRZZLsD4AQHw5Bw-uIyzq3WyF1h6CvQ9YqszuwYr8PuWRfGHvU9lG0SZ7I5GzQagZU2N2Wo9dbQVT3T9lNhkaqo4WGeLYfOp6a-4M0E1EQCQFGLLLQfOsKZM9sxw6VRNB32_Awqq5XxuY1vlzg-4C2_A5LAkfrsCRfM-DDNPAO8eKaNlCiLTNN7-_dOVuEx7vW6Efr-zz4t6bAd4gvGBBMEqnjwLVr-nYXOw9xy3ICNzyJ1NUe0kf0CS9DmirUTahE01YHi2ZwK8kMn3ZPn66ywk-598ajKK5Y_Q9vHhsLbxk7U0nXr6j9ufdnRjAWfVRu285gI4feRKrk1l4lINwQVFimcb1n8wMyjGrVG5XPUuaxt4v0u28VwslRpsS_tC6VJoxLFZlKNfKXGqkaj_tdylnoNSK6aqF-HChPeLITdBH5hqJNBRimSMuuz8M-uvGJYa92EZR7J6zE5se2zZn81o5E6yLxM2PsoVwAwNfoUBrFBL2CBD0UFlNUslB35FlCBRBrpoCpk600wSPx141DTXZZRw8'
}
[2022/2/9 23:13:59]   --> POST /tx 200 14ms 1.69kb
100% complete, 1/1
*/
