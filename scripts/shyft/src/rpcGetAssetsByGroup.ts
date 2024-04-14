import * as dotenv from 'dotenv';
import { ShyftSdk, Network } from '@shyft-to/js';

const rpcGetAssetsByGroup = async () => {
  // Config
  dotenv.config();

  const shyftApiKey = process.env.SHYFT_API_KEY;
  if (!shyftApiKey) throw new Error('shyftApiKey not found.');

  const shyft = new ShyftSdk({
    apiKey: shyftApiKey,
    network: Network.Mainnet,
  });

  // Run
  const response = await shyft.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'BxWpbnau1LfemNAoXuAe9Pbft59yz2egTxaMWtncGRfN',
    sortBy: { sortBy: 'created', sortDirection: 'asc' },
    page: 1,
    limit: 1000,
  });
  const assets = response.items;
  console.log(assets);
};

rpcGetAssetsByGroup();

/*
ts-node src/rpcGetAssetsByGroup.ts
[
  {
    interface: 'V1_NFT',
    id: '3CbL1tbeULV82AvEXpz4qmynNssDi1zaufh2AXrv4q6C',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://nfts.dialect.to/phantom/ok-metadata.json',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: '7a3VUid6SrJKwqgrChxGNguTuqk2aCFe2fd6Xnok8p1K',
      creator_hash: 'Ci4pku5FNteZm9e7ZhLbUeEKnGhjtnVZeFycj1qjRz4E',
      asset_hash: 'E9ud8Rch8xAWVT6Fe8arrbTMw2ehitXTNQd2P6zF3AgU',
      tree: '5wGVLH8miGEywAepbxGq6nmXXMeKoKjHmnTc9gcChLce',
      seq: 75492,
      leaf_id: 72617
    },
    grouping: [ [Object] ],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0,
      basis_points: 0,
      primary_sale_happened: true,
      locked: false
    },
    creators: [ [Object] ],
    ownership: {
      frozen: false,
      delegated: false,
      delegate: null,
      ownership_model: 'single',
      owner: '2pkdE6wbNwVGnzGX1jtMh7VX1vQGrEmTkETVJFYaY5q4'
    },
    supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 0 },
    mutable: true,
    burnt: false
  },
  ... 900 more items
]
*/
