// Docs: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-asset
import * as dotenv from 'dotenv';

const searchAssetsByGroup = async () => {
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
      method: 'searchAssets',
      params: {
        ownerAddress: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
        grouping: [
          'collection',
          'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx',
        ],
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log('Assets: ', result);
};

searchAssetsByGroup();

/*
% ts-node src/<THIS_FILE>

Assets:  {
  total: 5,
  limit: 1000,
  page: 1,
  items: [
    {
      interface: 'V1_NFT',
      id: 'Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq',
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
      id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
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
      id: 'EbZ3C2Wo9f4RUvi7XHpK554cMo9WNcVZaMUsYx7tKv5L',
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
      id: 'C84LJACyyp6HZSuAnMKZGqzwinzPkynnVpJUMEjy8mrp',
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
      id: '4N95uzyVy597TQAVXSccdExkMiFc9gaG3XKNUE2mEL27',
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
    }
  ]
}
*/
