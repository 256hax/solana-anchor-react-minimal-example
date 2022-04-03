const Arweave = require('arweave');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function main() {

  const calcBytes = 1_000_000; // unit is bytes
  const priceGetApi = await arweave.api.get('/price/' + calcBytes);
  const winstonToArApi = arweave.ar.winstonToAr(priceGetApi.data);

  console.log('--- arweave.api.get(Hard Coding) ---');
  console.log('calcBytes =>', calcBytes.toLocaleString());
  console.log('Transaction Price =>');
  console.log(priceGetApi.data, 'Winston');
  console.log(winstonToArApi, 'AR');


  const txId = '3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E';
  const getTx = await arweave.transactions.get(txId);
  const priceGetTx = await arweave.api.get('/price/' + getTx.data_size);
  const winstonToArTx = arweave.ar.winstonToAr(priceGetTx.data);

  console.log('--- arweave.api.get(Get TX Data Size) ---');
  console.log('calcBytes =>', getTx.data_size);
  console.log('Transaction Price =>');
  console.log(priceGetTx.data, 'Winston');
  console.log(winstonToArTx, 'AR');


  // Memo: Arweave JS have getPrice function but, there's no documents.
  //
  // const getPrice = await arweave.transactions.getPrice(calcBytes);
  // console.log(getPrice);
}

main();

/*
% node <THIS FILE>
--- arweave.api.get(Hard Coding) ---
calcBytes => 1,000,000
Transaction Price =>
234758635 Winston
0.000234758635 AR
--- arweave.api.get(Get TX Data Size) ---
calcBytes => 1447
Transaction Price =>
59227012 Winston
0.000059227012 AR
*/
