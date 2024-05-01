import * as dotenv from 'dotenv';
import { ShyftSdk, Network } from '@shyft-to/js';

const createMerkleTree = async () => {
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
  const result = await shyft.nft.compressed.mint({
    creatorWallet: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    metadataUri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
    merkleTree: '81WgE6NEKLT71YQpySphUE59oicJX3QRmRNZmijNvmzq',
    collectionAddress: 'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx',
  });
  console.log(result);
};

createMerkleTree();

/*
ts-node src/cNftMintToCollection.ts
{
  encoded_transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAkN9aRKbzaDlhFxHwQUn1HdQG3UvFLLhvIN0rEWCKYsfulQvMsSOSb6lp5TkHfDuBACuApItspH+rkEgmLD5QSG8mgjXRRBwUiwtjzk7neFvZ/4ilxxBmrHzyr6R9TRsEhi8lEJGTdQGb20GGYmOxd4V3mS+Zs9UH6mkRgq4AxE8M8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADZLL1Rhodf4wAu7ZXc4ZiZjkwHTJUvMr2m/ME7O6J68mIuA63k1KGmyJHRfWd2/iiZYyhPcaIEhJjUcrgfBpaUJKhPulcQcugimf1rGfo334doRYl4dZBN/j08jgwN/FKjmyH3pMi3QuGYKa9YifDJEhjiRK+pDtEMRnzXnsugjAwZGb+UhFzL/7K26csOb57yM5bvF9xJrLEObOkAAAADwqootFSM7J2Mhu89sQH7PBLxtYPah6OMXSLMN/J34pAtwZbHj0XxFOJ1Sf2sEw81YuGxzGqD9tUm20bwD+ClGC7wPwLtHyi90xBEulKsTz6PGNOXcF+rLA80aI81+eHzxKH52SOffcFOwCs0OWqCIWBqRbGFoVr1Fcl0FXgH2VAIJAAUCwNQBAAYQAwAAAgAAAAYIAQoFDAcLBNMBmRKyL8WeVg8RAAAAQ2xheW5vc2F1cnogIzczMTYEAAAARElOT1gAAABodHRwczovL25mdHN0b3JhZ2UubGluay9pcGZzL2JhZmtyZWlkazNyZm92dHg0dWVoaXZncDd0bXJ1b2lhcWt5cHByb3ltbGZ6enBnZXlheXFjYmZha21h9AEAAQEAAQABAKjmyH3pMi3QuGYKa9YifDJEhjiRK+pDtEMRnzXnsugjAAABAAAAHzmyzGuaWaZj+/S813PsUD6qBQ1deleS+LFCxjdIoIgAZA==',
  transaction_version: 'legacy',
  mint: 'DCan69QBgzhamg4bzcAjn7y8SzFowv3G59pM8u8jDZp7',
  signers: [ 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg' ]
}
*/
