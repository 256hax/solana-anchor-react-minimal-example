// Docs:
//  https://developers.metaplex.com/bubblegum/fetch-cnfts#by-owner
//  https://digital-asset-standard-api-js-docs.vercel.app/types/DasApiAssetList.html

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

  assets.items.map((a: any) => {
    console.log('assets =>', a);
  });
};

getAssetsByOwner();

/*
% ts-node src/<THIS_FILE>

~~~ snip ~~~
assets => {
  interface: 'V1_NFT',
  id: '5NF3EpsuqDnJ2KPScSXcKpKPPhgmwaYsd9h8ESJHuvGq',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'http://localhost:3000/metadata/scanner/32/32e6b39c-736c-41ba-9b6c-8c5d82afb1fe.json',
    files: [],
    metadata: { name: 'Scanner', symbol: '', token_standard: 'NonFungible' },
    links: {}
  },
  authorities: [
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: false,
    data_hash: '',
    creator_hash: '',
    asset_hash: '',
    tree: '',
    seq: 0,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: '2m62iaoxCViXDyFFZxueQP65rFvctrE9q2EQtKtyDH4s'
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
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 255 },
  mutable: true,
  burnt: false
}
assets => {
  interface: 'V1_NFT',
  id: '5NAusaffQAveTLLe8ey5JuNrf6iGiwxr1Lva3xb12kz7',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://arweave.net/2dyAzm_p5kz8GYYLAzKj41KQL3vYT_kWyomJ3mTpBcA',
    files: [ [Object] ],
    metadata: {
      attributes: [Array],
      description: 'Ancient pixage is the story of how the Ancientverse developed. The first collection in Ancient pixage will be 500 Neanderpixes. Future collections will continue to tell the story of how Neanderpix Brains evolved from multiple perspectives through multiple periods of time.',
      name: 'My NFT #2',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {
      external_url: 'https://twitter.com/Ancient_pixage',
      image: 'https://arweave.net/uf5Ph-X23PHWwQEN0186k6CdunHGFRP0jSGnoPwNJB8?ext=png'
    }
  },
  authorities: [
    {
      address: 'CJFQuG6DzMxLrgSKSAMDua8VXDn73rEdrPNwaryJJzoM',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: false,
    data_hash: '',
    creator_hash: '',
    asset_hash: '',
    tree: '',
    seq: 0,
    leaf_id: 0
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: '29cuUyDkQwibsGzFZ9pkgeu7kLgQezwR6GPvJcFeaDs5'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.0999,
    basis_points: 999,
    primary_sale_happened: true,
    locked: false
  },
  creators: [
    {
      address: '5egtBH9JDjZHhd95BLDEsaBBpve8e4ZwASGNgbaTyJDg',
      share: 0,
      verified: true
    },
    {
      address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      share: 100,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 252 },
  mutable: true,
  burnt: false
}
*/
