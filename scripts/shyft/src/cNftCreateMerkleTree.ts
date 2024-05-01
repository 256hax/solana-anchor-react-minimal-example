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
  const result = await shyft.nft.compressed.createMerkleTree({
    walletAddress: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    maxDepthSizePair: {
      maxDepth: 3,
      maxBufferSize: 8,
    },
    canopyDepth: 10,
  });
  console.log(result);
};

createMerkleTree();

/*
ts-node src/createMerkleTree.ts
{
  encoded_transaction: 'AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaKcEVkc0ZPnD5RndY/f7jVZzWX0Fnuux8BRJN9jrdJlSzPwbmDmRxdbyV8bqTRPVleIXtvufrhDR8MWBwBE0EAgAEB/WkSm82g5YRcR8EFJ9R3UBt1LxSy4byDdKxFgimLH7pt1fQxnwIqceJh07ecrDQIFtboA/+R9CWOq10U1xoErO2bufoM+irYPjcEu4CoKGwejoyba2IrW8ybQU6zJkDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmIuA63k1KGmyJHRfWd2/iiZYyhPcaIEhJjUcrgfBpaUJKhPulcQcugimf1rGfo334doRYl4dZBN/j08jgwN/FAu8D8C7R8ovdMQRLpSrE8+jxjTl3BfqywPNGiPNfnh8mlyvFVMQ13RAtXO2qbjeddJeCoUdyDyzAgWqzd21BlYCAwIAATQAAAAAgEjBGwAAAADYBAEAAAAAAAkqE+6VxBy6CKZ/WsZ+jffh2hFiXh1kE3+PTyODA38UBAcCAQAABgUDEqVTiI5Zyi/cAwAAAAgAAAABAA==',
  tree: 'DLhGr1TFMkU6Cc8vEXiDcMeJxprNCYJHzpf3swqvJzUS',
  signers: [ 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg' ]
}
*/
