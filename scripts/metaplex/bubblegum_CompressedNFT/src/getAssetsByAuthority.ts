// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
const getAssetsByAuthority = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Register Library
  umi.use(dasApi());
  
  // -------------------------------------
  //  Get Assets by Authority
  // -------------------------------------
  const authority = publicKey('7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv');
  const assets = await umi.rpc.getAssetsByAuthority({ authority });

  console.log('authority =>', authority);
  console.log('assets =>', assets);
};

getAssetsByAuthority();

/*
% ts-node src/<THIS_FILE>

authority => 7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv
assets => {
  total: 1,
  limit: 1000,
  page: 1,
  items: [
    {
      interface: 'V1_NFT',
      id: 'Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [Array],
      royalty: [Object],
      creators: [Array],
      ownership: [Object],
      supply: [Object],
      mutable: true,
      burnt: false
    }
  ]
}
*/
