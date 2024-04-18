// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api

// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetByAssetId = async () => {
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
  //  Get an Asset
  // -------------------------------------
  const assetId = publicKey('Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq');
  const asset = await umi.rpc.getAsset(assetId);

  console.log('assetId =>', assetId);
  console.log('asset =>', asset);
};

getAssetByAssetId();

/*
% ts-node src/<THIS_FILE>

assetId => Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq
asset => {
  interface: 'V1_NFT',
  id: 'Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
    files: [ [Object], [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Claynosaurz is a collection of 10,000 3D animated NFTs. Helmed by a team of leading animation and game industry artists, Claynosaurz aims to rewrite the narrative on how successful IP can be built out of web3. With massive potential for scaling, the Genesis collection is an all access pass to our Universe.',
      name: 'cNFT in a Collection',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      image: 'https://nftstorage.link/ipfs/bafybeibhhh2mnebvajzdai4d7ar42m6s6pkvy7n7smgc6lpj4bp45qvj3y/7315.gif',
      external_url: 'https://twitter.com/Claynosaurz'
    }
  },
  authorities: [
    {
      address: '7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'HnnZFpKwwVHAgtTZkvoqvg4f9KK4ecLQJtmD7yHoU9fo',
    creator_hash: '5MhKaq3eEzsomVp5qU1EST7H9q8R9ndDxWuXeF6wbdgx',
    asset_hash: 'CGs9Sk4LVppJADWjUnHRiNFAH7nQ7NimZwesijkD1Aze',
    tree: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
    seq: 1,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.05,
    basis_points: 500,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: true
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
*/
