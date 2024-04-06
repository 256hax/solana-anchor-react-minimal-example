// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetsByCollection = async () => {
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
  //  Get Assets by Group
  // -------------------------------------
  const collectionMint = publicKey('CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx');
  const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collectionMint,
  });

  assets.items.map((a: any) => {
    console.log('assets =>', a);
  });
};

getAssetsByCollection();

/*
% ts-node src/<THIS_FILE>

~~~snip~~~
assets => {
  interface: 'V1_NFT',
  id: 'C84LJACyyp6HZSuAnMKZGqzwinzPkynnVpJUMEjy8mrp',
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
      address: 'AgGoE8DcTK6nDdy5xo2Pa5GqEpWXwQz8HPJr1C16egnk',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'HnnZFpKwwVHAgtTZkvoqvg4f9KK4ecLQJtmD7yHoU9fo',
    creator_hash: '5MhKaq3eEzsomVp5qU1EST7H9q8R9ndDxWuXeF6wbdgx',
    asset_hash: 'J6itq8sWXXMoFkNeYMfVhHC1XCvZzYzGed3RBWh44qGA',
    tree: '4RFxwemYRR9RUDLEH2Uo2EuatUu4EZQsFuEeH7wA8r4f',
    seq: 2,
    leaf_id: 1
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
assets => {
  interface: 'V1_NFT',
  id: '4N95uzyVy597TQAVXSccdExkMiFc9gaG3XKNUE2mEL27',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://example.com/my-cnft.json',
    files: [],
    metadata: {
      name: 'My Compressed NFT',
      symbol: '',
      token_standard: 'NonFungible'
    },
    links: {}
  },
  authorities: [
    {
      address: 'GNfst5RPtrdv4AhnyBH3Zzz3cezUUztjw38TujRSfaE1',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '9TzVpU79sNHYyDKa4rFfa8ex8t5PMyKPtuGg1h5ag1cp',
    creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
    asset_hash: 'CfmbJMXTTrgymoqkoRTkDL7pvaTppVhvCMxgWzi56pKw',
    tree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
    seq: 6,
    leaf_id: 5
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
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
*/