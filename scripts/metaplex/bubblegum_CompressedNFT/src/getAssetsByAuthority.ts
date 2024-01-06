// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
const getAssetsByAuthority = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // Public RPC unavailbale DAS on Devnet. Use following RPC:
  //  https://developers.metaplex.com/bubblegum/rpcs
  const endpoint = 'https://api.mainnet-beta.solana.com';
  const umi = createUmi(endpoint).use(dasApi());

  // -------------------------------------
  //  Get Assets by Authority
  // -------------------------------------
  const authority = publicKey('DSweX9jNzQ6M4qCXb2ow7X6cjZym2wtGk1RVmFW7Lq5T');
  const assets = await umi.rpc.getAssetsByAuthority({ authority });

  console.log('authority =>', authority);
  console.log('assets =>', assets);
};

getAssetsByAuthority();

/*
% ts-node src/<THIS_FILE>

~~~snip~~~
    {
      interface: 'V1_NFT',
      id: '5Z4JvVVrJ3ugp7qyBcurPSvWjcuPxkNFXGCDx3r6G26j',
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
      id: '9ZpGMtJwWdWVhYdz7vtHyLeuApLJYBJZmpBoij5czuwc',
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
      id: 'DrAktMnyiR7ifVPMkAqsbxSLXJ6j1JPL59dfYpq8dGmF',
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
