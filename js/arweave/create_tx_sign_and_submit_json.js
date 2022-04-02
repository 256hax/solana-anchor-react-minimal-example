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

  console.log('URL =>', 'http://127.0.0.1:1984/' + transaction.id);
}

main();


/*
% npx arlocal
arlocal started on port 1984

Airdrop
http://127.0.0.1:1984/mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000

% node create_tx_sign_and_submit_file.js
Transaction => Transaction {
  format: 2,
  id: 'NSLV8IPs49DcFWyJ_UAGjTWXOYLd8c4oIxQmYia041E',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
  tags: [ Tag { name: 'Q29udGVudC1UeXBl', value: 'YXBwbGljYXRpb24vcGRm' } ],
  target: '',
  quantity: '0',
  data_size: '6300',
  data: <Buffer 25 50 44 46 2d 31 2e 33 0a 25 c4 e5 f2 e5 eb a7 f3 a0 d0 c4 c6 0a 33 20 30 20 6f 62 6a 0a 3c 3c 20 2f 46 69 6c 74 65 72 20 2f 46 6c 61 74 65 44 65 63 ... 6250 more bytes>,
  data_root: 'iwIZmYf6jJB1yyjwg_YdNdisCQjW2yUtF_JraI69nYQ',
  reward: '12380331600',
  signature: 'mkmbh2iiKX26QE1TKQKgq9zaXH-bOM635qnH6gB7lWqAqLGT_KZnqtdMyMdgwO6b_Ivn8lHzFAlPGrhVrKYnQq3WhY1PCfnZsgYBZmQZiRYRePR-ebM3Zr1AihBnNpefK5UQUXZDoHB5QpCE7ibspUHWrZVS2KEGS1UMvpNrLFssmGCL2QTRfHOIlS8uWHUttn33LP-ZaLsO_lIVLhQiDjkb7efN2YvUvI-bDu1L2eKhIUOpaUwojgo5wrwWdMAQuf2wdErd01ruKZQ7faxKFIBPBisGDj2OhExrIfRxF8L0qjSQkFo4J_DVlnpteutYxz6hqOone9BHDOdhyefZOUvHdrEZbJl9nKuGeyCQ8dmorPxBPu9CeU60jmhVvPlLZ0JuOdLuzUNj2tdRCFRIfQDj0z3CgpYNJnfnNIZw7gLQUatWJsMD-LsZqYdkO5Dek-ZubGmNWgZXCvVj4YPal030mBajRvlVPFBtvWFpR42NvxGIOgNrx5_SBVApfCIXr9aqsel6VQul4lTNtVAmiohyS4nwroKR-XwkhR3Pu2SeKAKfsw1KtghZuv2Do7QodgOKnTK5_qA9qFufXRLKUfbHfHMYklBJbGVhgYSGRTiXx1vBvDZ8b4-CSropinq1t6rv5HkRg_fBcEzrDINHSqukmwxnjfuuHoPckiwHuIs',
  chunks: {
    data_root: Uint8Array(32) [
      139,   2,  25, 153, 135, 250, 140, 144,
      117, 203,  40, 240, 131, 246,  29,  53,
      216, 172,   9,   8, 214, 219,  37,  45,
       23, 242, 107, 104, 142, 189, 157, 132
    ],
    chunks: [ [Object] ],
    proofs: [ [Object] ]
  }
}
100% complete, 1/1
URL => http://127.0.0.1:1984/NSLV8IPs49DcFWyJ_UAGjTWXOYLd8c4oIxQmYia041E
*/
