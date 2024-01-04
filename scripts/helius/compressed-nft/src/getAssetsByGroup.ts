// Docs: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-group
import * as dotenv from 'dotenv';

const getAssetsByGroup = async () => {
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
      method: 'getAssetsByGroup',
      params: {
        groupKey: 'collection',
        groupValue: 'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx',
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log('Assets by Group: ', result.items);
};

getAssetsByGroup();

/*
%% ts-node src/<THIS_FILE>

Assets by Group:  [
  {
    interface: 'V1_NFT',
    id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
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
    grouping: [ [Object] ],
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
      edition_nonce: null
    },
    mutable: true,
    burnt: false
  },
  {
    interface: 'V1_NFT',
    id: '4N95uzyVy597TQAVXSccdExkMiFc9gaG3XKNUE2mEL27',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://example.com/my-cnft.json',
      files: [],
      metadata: [Object],
      links: {}
    },
    authorities: [ [Object] ],
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
    grouping: [ [Object] ],
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
      edition_nonce: null
    },
    mutable: true,
    burnt: false
  }
]
*/
