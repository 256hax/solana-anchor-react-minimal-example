// Docs: https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api/get-asset
import * as dotenv from 'dotenv';

const searchAssetsByCnft = async () => {
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
        compressed: true,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets: ", result);
};

searchAssetsByCnft();

/*
% ts-node src/<THIS_FILE>

Search Assets:  {
  total: 37,
  limit: 1000,
  cursor: 'Dat2rFk5A165RBNBV5v4ypSjxp1FmfuEuqkNXUz2ZLc',
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
  ~~~ snip ~~~
    {
      interface: 'V1_NFT',
      id: '2fznTpacYTDFVY67C59iBzjU5tnxceFUKZUkperwjpmT',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [Array],
      royalty: [Object],
      creators: [Array],
      ownership: [Object],
      supply: [Object],
      mutable: false,
      burnt: false
    },
    {
      interface: 'V1_NFT',
      id: 'Dat2rFk5A165RBNBV5v4ypSjxp1FmfuEuqkNXUz2ZLc',
      content: [Object],
      authorities: [Array],
      compression: [Object],
      grouping: [Array],
      royalty: [Object],
      creators: [Array],
      ownership: [Object],
      supply: [Object],
      mutable: false,
      burnt: false
    }
  ]
}
*/
