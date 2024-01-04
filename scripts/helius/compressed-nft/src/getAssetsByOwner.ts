// Docs:
//  https://www.helius.dev/blog/all-you-need-to-know-about-compression-on-solana#reading-compressed-nfts-metadata-with-the-das-api
//  https://www.npmjs.com/package/helius-sdk#getasset
import * as dotenv from 'dotenv';

const getAssetsByOwner = async () => {
  dotenv.config();

  const url = process.env.HELIUS_API_WITH_URL;
  if (!url) throw new Error('url not found.');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });

  const { result } = await response.json();
  console.log('Assets by Owner: ', result.items);
};

getAssetsByOwner();

/*
% ts-node src/<THIS_FILE>

...
  {
    interface: 'V1_NFT',
    id: 'GuCrVjwajGW9bBvJkgSMDvS7tCmf3mXvW9pKQS682fz5',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/xsEQo7ucovAdrTAiyp2Qkh4JTf6ILgJ0J5v6vrP_0OA',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
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
    grouping: [],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0.05,
      basis_points: 500,
      primary_sale_happened: false,
      locked: false
    },
    creators: [ [Object] ],
    ownership: {
      frozen: false,
      delegated: false,
      delegate: null,
      ownership_model: 'single',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    supply: {
      print_max_supply: 0,
      print_current_supply: 0,
      edition_nonce: 255
    },
    mutable: true,
    burnt: false
  },
  {
    interface: 'V1_NFT',
    id: 'GsfGb5aUUG7oxd6JEqhSg7S5mvjCK4WQBdLocB9SHV85',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/7BCs01EoB157_0ILtAsAB4NQGgPBKTbhYpp0O6JMzJU',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
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
    grouping: [],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0,
      basis_points: 0,
      primary_sale_happened: false,
      locked: false
    },
    creators: [ [Object] ],
    ownership: {
      frozen: false,
      delegated: false,
      delegate: null,
      ownership_model: 'single',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    supply: {
      print_max_supply: 0,
      print_current_supply: 0,
      edition_nonce: 254
    },
    mutable: false,
    burnt: false
  },
  {
    interface: 'V1_NFT',
    id: 'Gs1BRE6VpgrPC8jzDw8x7B8zsvS2KuZDDxh8FVRfp7ty',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://mockstorage.example.com/gVIBdSxsqZZcyZnz2fUs',
      files: [],
      metadata: [Object],
      links: {}
    },
    authorities: [ [Object] ],
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
    grouping: [],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0.05,
      basis_points: 500,
      primary_sale_happened: false,
      locked: false
    },
    creators: [ [Object] ],
    ownership: {
      frozen: false,
      delegated: false,
      delegate: null,
      ownership_model: 'single',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    supply: {
      print_max_supply: 0,
      print_current_supply: 0,
      edition_nonce: 254
    },
    mutable: true,
    burnt: false
  },
  ... 900 more items
]
*/
