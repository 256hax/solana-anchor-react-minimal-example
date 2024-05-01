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
  const merkleTree = publicKey('52QLGuQijXUUXm4FubWqiENsPYYavvBzygsqWUHXtEja');
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
ts-node src/fetchMerkleTreeForCnft.ts
merkleTree => 52QLGuQijXUUXm4FubWqiENsPYYavvBzygsqWUHXtEja
merkleTreeAccount => {
  publicKey: '52QLGuQijXUUXm4FubWqiENsPYYavvBzygsqWUHXtEja',
  header: {
    executable: false,
    owner: 'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK',
    lamports: { basisPoints: 222218880n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 18446744073709551616n,
    exists: true
  },
  discriminator: 1,
  treeHeader: {
    __kind: 'V1',
    maxBufferSize: 64,
    maxDepth: 14,
    authority: 'GhzQbNyPTCrMX3m4aPJhJqRQGFhS1VWfBasSNfpgJ3Yt',
    creationSlot: 295652248n,
    padding: [ 0, 0, 0, 0, 0, 0 ]
  },
  tree: {
    sequenceNumber: 17n,
    activeIndex: 17n,
    bufferSize: 18n,
    changeLogs: [
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object]
    ],
    rightMostPath: {
      proof: [Array],
      leaf: 'CAfpsYBDLmsw7A7UL7rqe5dUDacjDvaWjBJapqizC1GF',
      index: 14
    }
  },
  canopy: []
}
treeConfig => {
  publicKey: 'GhzQbNyPTCrMX3m4aPJhJqRQGFhS1VWfBasSNfpgJ3Yt',
  header: {
    executable: false,
    owner: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
    lamports: { basisPoints: 1559040n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 18446744073709551616n,
    exists: true
  },
  discriminator: [
    122, 245, 175, 248,
    171,  34,   0, 207
  ],
  treeCreator: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  treeDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  totalMintCapacity: 16384n,
  numMinted: 14n,
  isPublic: false,
  isDecompressible: 1
}
*/