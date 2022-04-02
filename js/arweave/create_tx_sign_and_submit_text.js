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
  console.log('Get transaction    =>', 'http://127.0.0.1:1984/tx/' + transaction.id);
  console.log('Get data directly  =>', 'http://127.0.0.1:1984/' + transaction.id);
}

main();


/*
% npx arlocal
Transaction => Transaction {
  format: 2,
  id: 'LHt4bAaZ_FI0KdOoAnvnKFcH3exYvnQaeuf7mgbErJo',
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
  signature: 'V15VxBaproIyMngOLM-V05p2dQ9eJ4xUHkbecAc2hUkyz2fQfePkskgVDjt6WDuBXqJsDMc35PhlhcAt9uf1i_LPOkXBfh7zM3JSeW3J9PwUyGq1QhZgD1f_e86Qdo8Zfq2-nSq-aGX_TVpmLOr96_VX2Di2jhifaswDo2BzcU8UaKrKT-QHVs1N6Jk4pp1HGrjT5ZpQgnLni7yjaL3jj8wbDkFDWDd1cM5FCpZA7cJ3-qlBtWSQLtJbTSn9JkXDmt2vKtNykI7A7sh3gHAj2KxqLLkukxiVqs5HJN08rmmclcmxyfizlL7AwgDkBAce484nx1BbIcR0jw6hKGoIc-sMCXXHwEK0HrCH98thZLZJ3DQg8M3MPytcpQAVNfjzweCbV8B0Zj4ap8uZ0HYCyIZNGIzv7-65ukTULSpgyPqUR8X5hdnLywnFTXBmq4n0BD0lbzZXPsYyGvn-DzTNRnZkTQ8S88ewGLSfC-ESyLnDLxzLY0Qw2JOn2NhBa9eN5GGbUTvlhc3EhqC8E-ixpQw5gwMJ42hxRT9596cgP_oMC_1hs9VJrNF4MI0fIRYHP5xYrQOqMn2u9Mjx8OcV1GMFBrUgM4isAUmnjhKBY9BpxFinQOAMj6JTQV5uDRNiVdrTrZMJvlYuC1G-gLjIhhNVGz_5Ghnub-qqKPFb5iY',
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
URL => http://127.0.0.1:1984/LHt4bAaZ_FI0KdOoAnvnKFcH3exYvnQaeuf7mgbErJo
-------------------------------------------------------------------
Get transaction    => http://127.0.0.1:1984/tx/LHt4bAaZ_FI0KdOoAnvnKFcH3exYvnQaeuf7mgbErJo
Get data directly  => http://127.0.0.1:1984/LHt4bAaZ_FI0KdOoAnvnKFcH3exYvnQaeuf7mgbErJo
*/
