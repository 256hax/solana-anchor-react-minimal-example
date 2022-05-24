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
  const data = fs.readFileSync('./assets/dummy.pdf');

  // Transaction
  const transaction = await arweave.createTransaction({ data: data }, key);
  transaction.addTag('Content-Type', 'application/pdf');
  await arweave.transactions.sign(transaction, key);
  console.log('Transaction =>', transaction);

  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }

  console.log('-------------------------------------------------------------------');
  console.log('Transaction ID     =>', transaction.id);
  console.log('Get Transaction    =>', 'http://127.0.0.1:1984/tx/' + transaction.id);
  console.log('Get Data Directly  =>', 'http://127.0.0.1:1984/' + transaction.id);
}

main();


/*
% npx arlocal
arlocal started on port 1984

% node <THIS FILE>
Transaction => Transaction {
  format: 2,
  id: '4j5Mlo_XducsJ0Jm4Q3FJ2m3vioqOejhYIK-uLx_LcA',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
  tags: [ Tag { name: 'Q29udGVudC1UeXBl', value: 'YXBwbGljYXRpb24vcGRm' } ],
  target: '',
  quantity: '0',
  data_size: '6300',
  data: <Buffer 25 50 44 46 2d 31 2e 33 0a 25 c4 e5 f2 e5 eb a7 f3 a0 d0 c4 c6 0a 33 20 30 20 6f 62 6a 0a 3c 3c 20 2f 46 69 6c 74 65 72 20 2f 46 6c 61 74 65 44 65 63 ... 6250 more bytes>,
  data_root: 'iwIZmYf6jJB1yyjwg_YdNdisCQjW2yUtF_JraI69nYQ',
  reward: '12380331600',
  signature: 'npBeZ5tfNuxy50OFO_ZAp01-Auv5bHAOHzTUrDCoAp3TqyUNlHTlPpR_xYLowGCv_8PH0L7dzRa7_OzXSrV-savVfwLoCBQ4RlecDcsrfEsoq2CMgS4odJWTPzot87edQTOhr6SIqjWZDcdR9B13F4ZCnG5J-OYRXOteSsPfStCt1R1TuarHqe8D7KLYpIkpnQLkulcmvrWOKBLDo9VBBdS4jrtGZY7boSff4zCUxYaA9T8aGHg68RJ635SXmPpYEZ2EH_2BXHyFesmuiQpZa82zXV460gjKN4s_QFt6bh8kfrtAtUFpi4qLZSxUoJgLciykJ7etcWGYWCKpBInshLR9hDEf6bbAc3IKQ1OMAMvDNBxyDgrwIKyvFwxqvjuOF8hQXfYwGqKjVS0JrEkUu-mnasD7EO_enHfTOyhW0fBLHkuyflw8hXmb6F_wlQodxU80HjZ6OaxvNO4_qvh6btpP1AD5aMzYISaX39eGuf6bUULiekO_heumvihXwGedhIOMWMNHMnt7skpuQXhYfr5GVcp4TZt6csV7VHUGJYx6IClldHcik6vI_9eUV2sSDCFoyQilpoevwzFQuTvuxcEhkAGpP5mpjwr7q19iT7nQ33NeOd8cploH8G2m1gJfJUDjvHHIKOWN2x3A47kBU_pKjrr5dkZytvN80uh7Ir0',
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
-------------------------------------------------------------------
Transaction ID     => 4j5Mlo_XducsJ0Jm4Q3FJ2m3vioqOejhYIK-uLx_LcA
Get Transaction    => http://127.0.0.1:1984/tx/4j5Mlo_XducsJ0Jm4Q3FJ2m3vioqOejhYIK-uLx_LcA
Get Data Directly  => http://127.0.0.1:1984/4j5Mlo_XducsJ0Jm4Q3FJ2m3vioqOejhYIK-uLx_LcA
*/
