// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetsByGroup = async () => {
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
  //  Get Assets by Group
  // -------------------------------------
  const collectionMint = publicKey('CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx');
  const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collectionMint,
  });

  console.log('collectionMint =>', collectionMint);
  console.log('assets =>', assets);
};

getAssetsByGroup();

/*
% ts-node src/<THIS_FILE>

~~~snip~~~
    {
      interface: 'V1_NFT',
      id: 'EbZ3C2Wo9f4RUvi7XHpK554cMo9WNcVZaMUsYx7tKv5L',
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
    },
    {
      interface: 'V1_NFT',
      id: 'C84LJACyyp6HZSuAnMKZGqzwinzPkynnVpJUMEjy8mrp',
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
    },
    {
      interface: 'V1_NFT',
      id: '4N95uzyVy597TQAVXSccdExkMiFc9gaG3XKNUE2mEL27',
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
