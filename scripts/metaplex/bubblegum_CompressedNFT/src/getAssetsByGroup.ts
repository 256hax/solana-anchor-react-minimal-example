// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetsByGroup = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // Public RPC unavailbale DAS on Devnet. Use following RPC:
  //  https://developers.metaplex.com/bubblegum/rpcs
  const endpoint = 'https://api.mainnet-beta.solana.com';
  const umi = createUmi(endpoint).use(dasApi());

  // -------------------------------------
  //  Get Assets by Group
  // -------------------------------------
  const collectionMint = publicKey('DGPTxgKaBPJv3Ng7dc9AFDpX6E7kgUMZEgyTm3VGWPW6');
  const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'DGPTxgKaBPJv3Ng7dc9AFDpX6E7kgUMZEgyTm3VGWPW6',
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
      id: 'BdpJxZmQDbfC8JQ2Tr2eHDjRGJgfP4JpJHqeWmpwF69f',
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
      id: 'HXZ3J9ZqU4An7cYNVqoi2zyKvu5yoACUFqcPFLigCF9g',
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
      id: '8UM4XhqMdJgf45qN9qtR5dv2HXoHrLZFFyAeuzNPycjc',
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
    ... 900 more items
  ]
}
*/
