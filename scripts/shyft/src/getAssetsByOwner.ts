import * as dotenv from 'dotenv';
import { ShyftSdk, Network } from '@shyft-to/js';

const getAssetsByOwner = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const shyftApiKey = process.env.SHYFT_API_KEY;
  if (!shyftApiKey) throw new Error('shyftApiKey not found.');

  const shyft = new ShyftSdk({
    apiKey: shyftApiKey,
    // network: Network.Devnet,
    network: Network.Mainnet,
  });

  // ----------------------------------------------------
  //  Create Merkle Tree
  // ----------------------------------------------------
  const result = await shyft.rpc.getAssetsByOwner({
    ownerAddress: '8SKisd77dkXDxbHmhQbrkp6mjnKcwL5hYPqh9Yr8isvh',
    page: 1  // Assuming pagination starts at page 1
  });
  console.log(result);
};

getAssetsByOwner();

/*
    {
      interface: 'V1_NFT',
      id: 'GU2mfvJe1kxbCWYNN87VKXMWh4fpQ6pSGANrzXXXMaxR',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [Array],
      royalty: [Object],
      creators: [],
      ownership: [Object],
      supply: [Object],
      mutable: false,
      burnt: false
    },
    {
      interface: 'V1_NFT',
      id: 'GTTkeAB7FhBULz7ifeB1ECQxofVZddk3eS3b3KuepMNk',
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
      id: 'GSxrndFpRzF3NpAkBN7GNy6ZxgDVxsjvEanaAywJbmA2',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [Array],
      royalty: [Object],
      creators: [Array],
      ownership: [Object],
      supply: [Object],
      mutable: true,
      burnt: true
    },
    ... 741 more items
  ]
}
*/
