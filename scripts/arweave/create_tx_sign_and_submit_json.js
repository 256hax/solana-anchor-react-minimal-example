const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
    // --- If you need testnet ---
    // host: 'testnet.redstone.tools',
    // port: 443,
    // protocol: 'https'
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
  id: 'yKYmhrB0HcOV7IeZc9PrENmUC6ZPJ0H78kZOK2esyhc',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
  tags: [ Tag { name: 'Q29udGVudC1UeXBl', value: 'YXBwbGljYXRpb24vanNvbg' } ],
  target: '',
  quantity: '0',
  data_size: '1449',
  data: <Buffer 0a 7b 0a 20 20 22 6e 61 6d 65 22 3a 20 22 53 4d 42 20 23 31 33 35 35 22 2c 0a 20 20 22 73 79 6d 62 6f 6c 22 3a 20 22 53 4d 42 22 2c 0a 20 20 22 64 65 ... 1399 more bytes>,
  data_root: 'BRUw7_fIWn--3lO7MGB5jtbpuxlUuZwhebSgGM5eza0',
  reward: '2847476268',
  signature: 'Ri6NpDic8uppn1bAu859Cnrsw6Cil1hn0Hv1xUpw9CbEcysQleAMdo1vghXGWxYELVtqvCzLOiGH4ZgLBnSA3Me_B55Nr2frsy_nbikTyjm4K7ZUZaV68zKD_HlKA70wHBHv_QJiHkwNxXdHxEScY4HDewWQQjgfD59NaEuKBOtsoOCIGT7tYxZJXVhRp4c8N17zZFoza8r2eKtJlVzi9an69xqSZEgDqUjtQyAClfiJiA6JZw-b4Ubpz3kR9CeQuWz57JUdSr82O5qRo50B__79dhj6oRtH7EK7_dcru7Y84_o2hH9b-8XJ7pmxY2r870w7XLZZeO1I5qeZQz3-fRrtvV6AcZlx5Zl3Ah-SJUudQQiy-2-DxALaLRYiGBLKNZ9McNnb4Ov7EnhDGAzAtOe_4ztidfjtARM9ifXNy83OjIX0mLelxPUrsfiK71Oe6DUAE-EQxCLsgSpQUWkMmYWtS3xIROwP_zIABjGsMiB29Lnyjt_VD26ric0jQHmcaEH86yIW0FJstbtGeb4jXhBlnmBaK2X3goSsnQm_q6oRF_eX6fBsq8IbKAxJa9i7pJw44dBA5vU2N-Rezv9D7scAf2k66kPy3igotGRlIREdvHO4e3YnSyoyNNfJACQibf3pk5GpSG3VNZCtbBQNYi06ieuMdJvZJSuV7B5q7pE',
  chunks: {
    data_root: Uint8Array(32) [
        5,  21,  48, 239, 247, 200,  90, 127,
      190, 222,  83, 187,  48,  96, 121, 142,
      214, 233, 187,  25,  84, 185, 156,  33,
      121, 180, 160,  24, 206,  94, 205, 173
    ],
    chunks: [ [Object] ],
    proofs: [ [Object] ]
  }
}
100% complete, 1/1
-------------------------------------------------------------------
Transaction ID     => yKYmhrB0HcOV7IeZc9PrENmUC6ZPJ0H78kZOK2esyhc
Get transaction    => http://127.0.0.1:1984/tx/yKYmhrB0HcOV7IeZc9PrENmUC6ZPJ0H78kZOK2esyhc
Get data directly  => http://127.0.0.1:1984/yKYmhrB0HcOV7IeZc9PrENmUC6ZPJ0H78kZOK2esyhc
*/
