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

  console.log('URL =>', 'http://127.0.0.1:1984/' + transaction.id);
}

main();


/*
% npx arlocal
arlocal started on port 1984

Airdrop
http://127.0.0.1:1984/mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000

% node create_tx_sign_and_submit_text.js
Transaction => Transaction {
  format: 2,
  id: 'VODEaxULjXvZgxtB5dZhcvA_25VRgpSVIxW5ap5lLdw',
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
  signature: 'yw5Du4y5OI0RiHYyBQWinYksbDREl7jcOTvrskdCgFBQnyKFDRg_q7btaqFsJ7EbcoKUN7hz4uNzmr7nLkAIlM66Bvk5o95BZ5RZ1QeGtu1nZKFcruDo_cCAwx_RF4m2yNm1peXbaMnlqyjEhJSTS3sgcc0l250be_fA-JmaSd6UAytJDhWaYqN-I0LgDtS19R8Hr_o5XYH-NKENUrv9e4pJh88oTpkIJTaaP3KIi3finB7eu0fEAaqGN0yDIgR6vDR_6c4og0hxoAtuxEH2--jEzzUIbk1uUq_qvnK1Da314yanM6PZHZtsvjLaqkH3rJTlRe54FAnFE9DxYAuHX8AXSMGltpmUsGscQH8o74IA4JEOl7eYo_2E3mt151N36d44AQ0J9J3_QDZQJXQAiKKQmJOyar1i71cnhA7FA5NvK_AdAPqj4n3p7ijV-PUjoWF8MXg-FkRnWJT4m1GnCZc190u937LbA2kN91eZw2AahFd8kbRs0KWG253FT9T8-RJEElxfbyBrU3JvfSlOiZ_2HwgrbGj5v_GBkV9qGh57oNEirrT2bbnabMt6_IHiz7BJp2xhEomCFRb2SQNRNi9EjUqJYBm8oP5jKwfm13Mv-zYwDjmYD1ao5FP2Nunah8PTrhCzdPuF2-WXQZFVjoz2QnnmVnOxkENXdHuRA0I',
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
URL => http://127.0.0.1:1984/VODEaxULjXvZgxtB5dZhcvA_25VRgpSVIxW5ap5lLdw
*/
