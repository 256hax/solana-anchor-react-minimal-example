// Docs: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-asset
import * as dotenv from 'dotenv';

const getAssetById = async () => {
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
      method: 'getAsset',
      params: {
        id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
      },
    }),
  });

  const { result } = await response.json();
  console.log('Asset: ', result);
};

getAssetById();

/*
% ts-node src/<THIS_FILE>

Asset:  {
  interface: 'V1_NFT',
  id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
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
      address: 'GNfst5RPtrdv4AhnyBH3Zzz3cezUUztjw38TujRSfaE1',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: 'Ad645MeFx94jeh8xAdp7u8bnRfHa9RGaZZrWK5j5qcCY',
    creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
    asset_hash: '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
    tree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
    seq: 8,
    leaf_id: 7
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
