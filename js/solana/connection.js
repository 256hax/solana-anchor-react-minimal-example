// Source: https://docs.solana.com/developing/clients/javascript-reference#connection
const web3 = require("@solana/web3.js");

async function main() {
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  let slot = await connection.getSlot();
  console.log('slot => ', slot);

  let blockTime = await connection.getBlockTime(slot);
  console.log('blockTime => ', blockTime);

  let block = await connection.getBlock(slot);
  console.log('block => ', block);

  let slotLeader = await connection.getSlotLeader();
  console.log('slotLeader =>', slotLeader);
}

main();
/*
% node <THIS JS FILE>
slog =>  97501255
blockTime ->  1638185260
block =>  {
  blockHeight: 94561154,
  blockTime: 1638185260,
  blockhash: 'FMPNKFgBRCnjSpuzRWxUt69ANUkAHZzX2o3MTZhHkiDa',
  parentSlot: 97501254,
  previousBlockhash: 'GVPSKfeSmyKHQKbwkZK78K1Ng9SNT1eCDXbwajPsw4iH',
  rewards: [
    {
      commission: null,
      lamports: -46,
      postBalance: 489356,
      pubkey: 'D1sma6SBrejDTctdL71boh9EXRPBecnJt9pZxVFFFBdr',
      rewardType: 'Rent'
    },
    {
      commission: null,
      lamports: 467500,
      postBalance: 2401740976166005,
      pubkey: 'dv4ACNkpYPcE3aKmYDqZm9G5EB3J4MRoeE7WNDRBVJB',
      rewardType: 'Fee'
    },
    {
      commission: null,
      lamports: 6,
      postBalance: 1101747078873344,
      pubkey: 'dv2eQHeP4RFrJZ6UeiZWoc3XTtmtZCUKxxCApCDcRNV',
      rewardType: 'Rent'
    },
    {
      commission: null,
      lamports: 5,
      postBalance: 2401740976166010,
      pubkey: 'dv4ACNkpYPcE3aKmYDqZm9G5EB3J4MRoeE7WNDRBVJB',
      rewardType: 'Rent'
    },
    {
      commission: null,
      lamports: 5,
      postBalance: 201723096575516,
      pubkey: 'dv3qDFk1DTF36Z62bNvrCXe9sKATA6xvVy6A798xxAS',
      rewardType: 'Rent'
    },
    {
      commission: null,
      lamports: 5,
      postBalance: 501662348770836,
      pubkey: 'dv1ZAGvdsz5hHLwWXsVnM94hWf1pjbKVau1QVkaMJ92',
      rewardType: 'Rent'
    },
    {
      commission: null,
      lamports: 2,
      postBalance: 10149491681396216,
      pubkey: 'ETSKPSzESbVdmtUn67LA2p9J1gPCSEgYvmJS9pNNWQqR',
      rewardType: 'Rent'
    }
  ],
  transactions: [
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    { meta: [Object], transaction: [Object] },
    ... 51 more items
  ]
}
slotLeader => dv2eQHeP4RFrJZ6UeiZWoc3XTtmtZCUKxxCApCDcRNV
*/
