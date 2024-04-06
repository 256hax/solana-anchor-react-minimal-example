// Docs: https://developers.metaplex.com/core/fetch
// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { getAssetV1GpaBuilder, Key } from '@metaplex-foundation/mpl-core';

const fetchingMultipleAsset = async () => {
  // -------------------------------------
  //  Setup
  // -------------------------------------
  dotenv.config();
  
  // Set Endpoint
  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);


  // -------------------------------------
  //  Fetching Multiple Assets
  // -------------------------------------
  const owner = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');

  const assetsByOwner = await getAssetV1GpaBuilder(umi)
    .whereField('key', Key.AssetV1)
    .whereField('owner', owner)
    .getDeserialized();

  console.log('assetsByOwner =>', assetsByOwner);
};

fetchingMultipleAsset();

/*
ts-node src/fetchingMultipleAsset.ts
assetsByOwner => [
  {
    publicKey: '1wXKga6Q4qs4XQDMkkkcwm6bEeC8b4ftUGXZqZViCat',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n
    },
    pluginHeader: undefined,
    key: 1,
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    updateAuthority: {
      type: 'Address',
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    name: 'My Core NFT',
    uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
    seq: { __option: 'None' }
  },
  {
    publicKey: '9rEm1ABr7ey2knn8QQFz8s8noXr5MQzcPRTvCJKoxRdH',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n
    },
    pluginHeader: undefined,
    key: 1,
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    updateAuthority: {
      type: 'Address',
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    name: 'My Core NFT',
    uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
    seq: { __option: 'None' }
  },
  {
    publicKey: '47PYvEKVb8MCQ5nqPFkihinbgwucmoM6oKCkZXjVqB11',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n
    },
    pluginHeader: undefined,
    key: 1,
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    updateAuthority: {
      type: 'Address',
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    name: 'My Core NFT',
    uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
    seq: { __option: 'None' }
  },
  {
    publicKey: 'HhkyFrKKmhcQa5AT8mHjTEmKLUb8HBewG9ccsLjAuN3c',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n
    },
    pluginHeader: undefined,
    key: 1,
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    updateAuthority: {
      type: 'Collection',
      address: 'GTDQoxdzoNJ2d2JUbduRPGgxpnNqWRFqnkn3pPabAGr4'
    },
    name: 'My Core NFT',
    uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
    seq: { __option: 'None' }
  }
]
*/
