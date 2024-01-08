// Docs: https://developers.metaplex.com/bubblegum/fetch-cnfts#by-owner
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetsByOwner = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // Public RPC unavailbale DAS on Devnet. Use following RPC:
  //  https://developers.metaplex.com/bubblegum/rpcs
  const endpoint = process.env.HELIUS_API_WITH_URL;
  if (!endpoint) throw new Error('endpoint not found.');

  const umi = createUmi(endpoint).use(dasApi());

  // -------------------------------------
  //  Get Assets by Owner
  // -------------------------------------
  const owner = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');
  const assets = await umi.rpc.getAssetsByOwner({ owner });

  console.log('owner =>', owner);
  console.log('assets =>', assets);
};

getAssetsByOwner();

/*
% ts-node src/<THIS_FILE>

~~~snip~~~
    {
      interface: 'V1_NFT',
      id: 'GvkSVzXPaVzVxZd3u7jiqWr1goeq7AczJmwya1cX7suB',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [Array],
      royalty: [Object],
      creators: [],
      ownership: [Object],
      supply: [Object],
      mutable: true,
      burnt: false
    },
    {
      interface: 'V1_NFT',
      id: 'GuCrVjwajGW9bBvJkgSMDvS7tCmf3mXvW9pKQS682fz5',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [],
      royalty: [Object],
      creators: [Array],
      ownership: [Object],
      supply: [Object],
      mutable: true,
      burnt: false
    },
    {
      interface: 'V1_NFT',
      id: 'GsfGb5aUUG7oxd6JEqhSg7S5mvjCK4WQBdLocB9SHV85',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [],
      royalty: [Object],
      creators: [Array],
      ownership: [Object],
      supply: [Object],
      mutable: false,
      burnt: false
    },
    ... 900 more items
  ]
}
*/
