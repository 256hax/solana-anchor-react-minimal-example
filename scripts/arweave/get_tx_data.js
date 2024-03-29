const Arweave = require('arweave');
const fs = require('fs');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

async function main() {
  const transactionId = '3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E';

  const tx_data = await arweave.transactions.getData(transactionId, { decode: true, string: true });
  console.log('Transaction Data =>', tx_data);

  console.log('------------------------------------------------');

  const tx_tags = await arweave.transactions.get(transactionId);
  console.log('<key> : <value>');
  tx_tags.get('tags').forEach(tag => {
    let key = tag.get('name', { decode: true, string: true });
    let value = tag.get('value', { decode: true, string: true });
    console.log(`${key} : ${value}`);
  });
}

main();

/*
% node <THIS FILE>
Transaction Data => {
  "name": "SMB #1355",
  "symbol": "SMB",
  "description": "SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.",
  "seller_fee_basis_points": 500,
  "image": "https://arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4",
  "external_url": "https://solanamonkey.business/",
  "collection": {
    "name": "SMB Gen2",
    "family": "SMB"
  },
  "attributes": [
    {
      "trait_type": "Attributes Count",
      "value": 2
    },
    {
      "trait_type": "Type",
      "value": "Skeleton"
    },
    {
      "trait_type": "Clothes",
      "value": "Orange Jacket"
    },
    {
      "trait_type": "Ears",
      "value": "None"
    },
    {
      "trait_type": "Mouth",
      "value": "None"
    },
    {
      "trait_type": "Eyes",
      "value": "None"
    },
    {
      "trait_type": "Hat",
      "value": "Crown"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4",
        "type": "image/png"
      },
      {
        "uri": "https://cdn.solanamonkey.business/gen2/1355.png",
        "type": "image/png",
        "cdn": true
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F",
        "verified": true,
        "share": 100
      }
    ]
  }
}
------------------------------------------------
<key> : <value>
Content-Type : application/json
*/
