// Docs: https://developers.metaplex.com/bubblegum/create-trees

// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
} from '@metaplex-foundation/mpl-bubblegum';

const fetchMerkleTreeForCnft = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');

  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

  umi.use(keypairIdentity(payerKeypair));

  // ----------------------------------------------------
  //  Fetching Merkle Tree
  // ----------------------------------------------------
  const merkleTree = publicKey('D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui');
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree);
  const treeConfig = await fetchTreeConfigFromSeeds(umi, {
    merkleTree: merkleTree,
  });

  console.log('merkleTree =>', merkleTree);
  console.log('merkleTreeAccount =>', merkleTreeAccount);
  console.log('treeConfig =>', treeConfig);
};

fetchMerkleTreeForCnft();

/*
% ts-node src/<THIS_FILE>

merkleTree => D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui
merkleTreeAccount => {
  publicKey: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
  header: {
    executable: false,
    owner: 'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK',
    lamports: { basisPoints: 9966720n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 18446744073709552000,
    exists: true
  },
  discriminator: 1,
  treeHeader: {
    __kind: 'V1',
    maxBufferSize: 8,
    maxDepth: 3,
    authority: '7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv',
    creationSlot: 270763465n,
    padding: [ 0, 0, 0, 0, 0, 0 ]
  },
  tree: {
    sequenceNumber: 1n,
    activeIndex: 1n,
    bufferSize: 2n,
    changeLogs: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    rightMostPath: {
      proof: [Array],
      leaf: 'CGs9Sk4LVppJADWjUnHRiNFAH7nQ7NimZwesijkD1Aze',
      index: 1
    }
  },
  canopy: []
}
treeConfig => {
  publicKey: '7LFU328jKzsUj1U1nVAGeR4R9Q1dVLBvvb725vFUVqXv',
  header: {
    executable: false,
    owner: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
    lamports: { basisPoints: 1559040n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 18446744073709552000,
    exists: true
  },
  discriminator: [
    122, 245, 175, 248,
    171,  34,   0, 207
  ],
  treeCreator: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  treeDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  totalMintCapacity: 8n,
  numMinted: 1n,
  isPublic: false,
  isDecompressible: 1
}
*/