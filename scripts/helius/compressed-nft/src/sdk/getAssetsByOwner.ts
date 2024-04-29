import * as dotenv from 'dotenv';
import { Helius } from 'helius-sdk';

const getAssetsByOwner = async () => {
  dotenv.config();

  const heliusApiKey = process.env.HELIUS_API_KEY;
  if (!heliusApiKey) throw new Error('heliusApiKey not found.');
  const helius = new Helius(heliusApiKey, 'devnet');

  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress: '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY',
    page: 1,
  });
  console.log(response.items);
};

getAssetsByOwner();

/*
ts-node src/sdk/getAssetByOwner.ts
[
  {
    interface: 'V1_NFT',
    id: 'HbMZpP1mtYdzsyCLpUrJcJQrhnjHCibyLEKa3TQxJLyM',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://bafkreifiw3owe4uckbdipu6d3twykvprg5slloigi4feddiipkiv7aq7oq.ipfs.nftstorage.link/',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: 'AUV4ezveyFr4LX3TSjsJtZDhw73V1cXj6YaFR7NNq1GK',
      creator_hash: 'AnxzmA8kFqJ1ninhevWRwKJCQV8rsBUM4pnEF5ny78dK',
      asset_hash: 'De8VMvxEi17QZ2VdQbAPwb3WfsC4eVS8qk9hN2DFnaeT',
      tree: 'WDyabQQd5pCkcttw8YcD1oe6jouzpWupJ9FGxUTULEn',
      seq: 48,
      leaf_id: 47
    },
    grouping: [ [Object] ],
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
      delegated: true,
      delegate: '7Unav33snv6cxmWm3MBzwLUkm5sWC2dCDDAaDrQWpoy',
      ownership_model: 'single',
      owner: '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY'
    },
    supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 0 },
    mutable: false,
    burnt: false
  },
  ...
*/