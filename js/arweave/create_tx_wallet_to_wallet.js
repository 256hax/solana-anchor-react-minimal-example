const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
});

const key = JSON.parse(fs.readFileSync('key.json')); // Payer

async function main() {
  // Airdrop for Payer
  const address = await arweave.wallets.jwkToAddress(key);
  const airdrop = await arweave.api.get('/mint/' + address + '/100000000000000')

  // Generate Taker Wallet
  const taker_key = await arweave.wallets.generate(); // Taker
  const takder_address = await arweave.wallets.jwkToAddress(taker_key);

  // Transaction
  const transaction = await arweave.createTransaction({
      target: takder_address,
      quantity: arweave.ar.arToWinston('10.5')
  }, key);

  await arweave.transactions.sign(transaction, key);
  const response = await arweave.transactions.post(transaction);

  console.log('Transaction =>', transaction);
  console.log('Http Status =>', response.status);
}

main();

/*
% npx arlocal
arlocal started on port 1984

Airdrop
http://127.0.0.1:1984/mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000

% node <THIS FILE>
Transaction => Transaction {
  format: 2,
  id: 'W7xq5WcnMmwWmWS-RZvHkS0DJ633ovPcNYVuZ9NE75o',
  last_tx: '',
  owner: '1UlWuBtbDi17XX1EquMp322muLYTb8PtK3oSm3eYPo0e-zQkuv0SZ1hD3dsLOxlOmb8snhm8vN2wpN2GeGAPNyXBuip-KBfufGeO5hZVyvAU6KQj4fn5_nMp-BjSEMNzCfTEOgaqZxFDzWDXwwSCySEkcrN8Ufmc5Lkf4ekVtjpaTHjvQly46M8U4RPI8qu8yJrr1rCdYzWjEa_awv1JVwHGZIWrzGV-wP1lv1_OTkc4HiA2tvNMWydDRqO-zYbej4qUKE-u2ch5JfPmif9ccXXgGD2dsH6GrONNKoD-T2l1cCD41u6gG1H7KXCvshFbDdbJ57WLFshAnwD3GRa_Z-76jss_pFCcR_0ICn3e3xBlvNfRcclMyZ017TTOcb2u5R-yU4JXjqhD0tDdchj_vJZkMeJ8F9fMGNlkKV6LWiwHQPB19iTL2FAJWtpCZgs-8hNKcdmmZtpFxul5DufNL20Z4lgXtuOBXIwyiKCo_-8aZLtXiB0-dtsW--exR_b2I4dpb5eOiQ3OHjjkRAYStFcMTgNBMi_FvxqVexSwIcDJuPvIMtFcRlxPeN5jJs-HG_LLehCGhZY0GF9NR4BLykYTf21pM_iyPOqOpIA_ynzLs_E3o8_xEdF_2HNsdyr0H01-ehca4U9zi04XilsUK3ruhFIAprc9coYZ7wqJ91s',
  tags: [],
  target: 'C_kjztrsZDx74BfYPuuVvhgIV6Fqpvz2LcbWhB9AWNU',
  quantity: '10500000000000',
  data_size: '0',
  data: Uint8Array(0) [],
  data_root: '',
  reward: '0',
  signature: 'oFkqekQP2msD0D6-EcZ5TkfSZ01YRJJeXQomx-PXwwusFMkjyMasgK51zV3PYOGRGdQRl3ONHku2Oc_lfMMaIEbeWsK6mM15M9lQf2cyZYlHgq6HACsRZ4zgHCNRjgeJUbVghwgjsa3yWwZXVbNcVZfT1hiqOjqxze1J01MjvABsO1MPuOSZ8OWgiZPk1ttoWK1Pdf5-OjV0Yd7ckxNEYfNsH3M07gQ2ymwOpJIYUjQs3I1tf0ljHdSdV2mR46pNkLpwlCEoRq2--W2lD0SH3clOchL3zdHfJQt1EHSgHrNQoSJOKIA3CFlNwMS_PPzeRhssIF98TexHn8X24atY8e-_y3R4WfQZK55hOo4EIYEApOYDSSDhxDXbvKSQucVJw5JdSRhnDIbNE0N9nGvVnSh8ZIAbgksnOG_Td00zknCPlSZDSgG9GMMV81eXmziHxmglHkHVZAPemrcHxmx81rWw4lNCdb7e38rpBsMlK6k83OdboP8tcQmRC1f67L3sZf6H5QckEhRFZtuVIbBalvoI2IoI_OTwmU9isxpUxoy4OWPMmCmsXFP5zP0z3dupffpMmLwtJW9wGt_Y-7-aqUKGq-jqf2AZm1yxS0zYTOd7SPbVj1qZpZzTZ9P1BphtiJIk8h0kAdwDQFHMUIDrtVcLfg8xm2vlLzW4g0pKOQc',
  chunks: { chunks: [], data_root: Uint8Array(0) [], proofs: [] }
}
Http Status => 200
*/
