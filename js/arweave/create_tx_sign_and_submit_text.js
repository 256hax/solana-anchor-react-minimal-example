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

  // Upload Text
  const data = '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>';

  // Transaction
  const transaction = await arweave.createTransaction({ data: data }, key);
  await arweave.transactions.sign(transaction, key);
  console.log('Transaction =>', transaction);

  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }

  console.log('-------------------------------------------------------------------');
  console.log('Transaction ID     =>', transaction.id);
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
  id: 'n73TTRcRYjBv9JX7ervtDeLrN255tgh-X9eAgiZPx2U',
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
  signature: 'bGPJlJpT4iUmWhoRv6wH3CJ-YaaBXaAVoaW7cagK3ObTy_3zBV2Bt4khErxLObo7_hULAZD2nMEQOnYWf_7VIrecLrCHx-gLpiTPYphIi8y-22evgX-kq8zj7PgDrRwZYRnuJw1BssoP6dIg5ao8c7ibaH8whfl9t-g-jNpxZSNLNO2WgAZSliIhCrHdnGMx9plpPqI811DCm2KeYNayIOhA4swS0riE-pa7Gu_ZbRxrFKJZWvOgjQXLIHfuB4YA1x5qp1YqbjpVXlHS66As3WPkP24fBBFzTmIwE1H9nJ-tthFr56s-ffp1Iq3AP6BH3UvIyyCEsJW-adg2W6AV5mFnnaOv9RT3jPuI0VjGfUS8tACI6OuJrzgL75CA09xYddjR0TYKDG8vCOJ--cF9EZpEW3fHYn-ddRTI0FN3zqpbvnhfjgxV6jxRUErIN_cIX7Vy8c0eQgfKDiFINzxRwmEHDq7jc39LgPVwNi8Zu1dS_c0AibrP-fdQ-fGJmNvdVXLJ4ob28f99dPCenLV8jx9xj3ZVu713CN1bAWBmzaUBQbk0jVQHsuk44Fu-bo7jt7ncdnMqYB8-0dAJ8bmTfNjxUO8WyEF7tBlwUV1YopeelHJ4U3yQTaw2gG8XXeCtrGavOngEMJB_K3KJk05U7UMnTgtpPy8yKFqZb38DH2Y',
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
100% complete, 1/1
-------------------------------------------------------------------
Transaction ID     => n73TTRcRYjBv9JX7ervtDeLrN255tgh-X9eAgiZPx2U
Get transaction    => http://127.0.0.1:1984/tx/n73TTRcRYjBv9JX7ervtDeLrN255tgh-X9eAgiZPx2U
Get data directly  => http://127.0.0.1:1984/n73TTRcRYjBv9JX7ervtDeLrN255tgh-X9eAgiZPx2U*/
