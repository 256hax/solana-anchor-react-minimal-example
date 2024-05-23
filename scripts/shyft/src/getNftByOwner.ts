import * as dotenv from 'dotenv';
import { ShyftSdk, Network } from '@shyft-to/js';

const getNftByOwner = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const shyftApiKey = process.env.SHYFT_API_KEY;
  if (!shyftApiKey) throw new Error('shyftApiKey not found.');

  const shyft = new ShyftSdk({
    apiKey: shyftApiKey,
    network: Network.Devnet,
  });

  // ----------------------------------------------------
  //  Create Merkle Tree
  // ----------------------------------------------------
  const result = await shyft.nft.getNftByOwner({
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  });
  console.log(result);
};

getNftByOwner();

/*
  {
    name: 'My NFT #2',
    symbol: '',
    royalty: 9.99,
    image_uri: 'https://arweave.net/uf5Ph-X23PHWwQEN0186k6CdunHGFRP0jSGnoPwNJB8?ext=png',
    cached_image_uri: 'https://arweave.net/uf5Ph-X23PHWwQEN0186k6CdunHGFRP0jSGnoPwNJB8?ext=png',
    animation_url: '',
    cached_animation_url: '',
    metadata_uri: 'https://arweave.net/2dyAzm_p5kz8GYYLAzKj41KQL3vYT_kWyomJ3mTpBcA',
    description: 'Ancient pixage is the story of how the Ancientverse developed. The first collection in Ancient pixage will be 500 Neanderpixes. Future collections will continue to tell the story of how Neanderpix Brains evolved from multiple perspectives through multiple periods of time.',
    mint: '6nDjNUPgmgpNSqAdiSHuUKdmGPcJBdYvNucvj6g5A3GY',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    update_authority: '9HHDEuGNjpua9vhZGB68djfAKBeTXqnGq4J7rfFncaWs',
    creators: [ [Object], [Object] ],
    collection: {
      address: '76FoA2NFCKnMT9RS9q6MgKih4dFLV1hvmJuWMH4xe2B9',
      verified: true
    },
    attributes: {},
    attributes_array: [],
    files: [ [Object] ],
    external_url: 'https://twitter.com/Ancient_pixage',
    primary_sale_happened: true,
    is_mutable: true,
    token_standard: 'NonFungible',
    is_loaded_metadata: true,
    is_compressed: false,
    merkle_tree: '',
    is_burnt: false
  },
  {
    name: 'Q',
    symbol: '',
    royalty: 5,
    image_uri: 'https://arweave.net/9wsKv4kjpNJam_MFOmgZLSv7T5MF1m25giGWzj2JW6I',
    cached_image_uri: 'https://arweave.net/9wsKv4kjpNJam_MFOmgZLSv7T5MF1m25giGWzj2JW6I',
    animation_url: '',
    cached_animation_url: '',
    metadata_uri: 'https://arweave.net/RONSbtSF4AzZJOKh_fhhqMwbBhEc1vt4zkrQIZBeWYo',
    description: 'This is secret Q!',
    mint: 'Bq2eMq6AsWhzCk67BzUu1KaWsupKh7nzjRrihT9cw3XX',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    update_authority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    creators: [ [Object] ],
    collection: {},
    attributes: {},
    attributes_array: [],
    external_url: '',
    primary_sale_happened: false,
    is_mutable: true,
    token_standard: 'NonFungible',
    is_loaded_metadata: true,
    is_compressed: false,
    merkle_tree: '',
    is_burnt: false
  },
  {
    name: 'Weapon Glove Flame Dark(363)',
    symbol: '',
    royalty: 5,
    image_uri: '',
    cached_image_uri: '',
    animation_url: '',
    cached_animation_url: '',
    metadata_uri: 'http://localhost:3000/metadata/weapon/18/18d57985-f8a9-4892-af85-4f7c1b36c57d.json',
    description: '',
    mint: 'HYnQwUoDBsnAKJ2GD4f4MtkM7PKZFxr17Z6metj85uwv',
    owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    update_authority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    creators: [ [Object] ],
    collection: {
      address: '76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z',
      verified: true
    },
    attributes: {},
    attributes_array: [],
    external_url: '',
    primary_sale_happened: false,
    is_mutable: true,
    token_standard: 'NonFungible',
    is_loaded_metadata: true,
    is_compressed: false,
    merkle_tree: '',
    is_burnt: false
  },
  ... 1273 more items
]
*/
