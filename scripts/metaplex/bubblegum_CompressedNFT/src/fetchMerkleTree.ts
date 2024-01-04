// Docs: https://developers.metaplex.com/bubblegum/create-trees

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  createTree,
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
} from '@metaplex-foundation/mpl-bubblegum';

const createMerkleTree = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = 'https://api.devnet.solana.com';
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
  const merkleTree = publicKey('4RFxwemYRR9RUDLEH2Uo2EuatUu4EZQsFuEeH7wA8r4f');
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree);
  const treeConfig = await fetchTreeConfigFromSeeds(umi, {
    merkleTree: merkleTree,
  });

  console.log('merkleTree =>', merkleTree);
  console.log('merkleTreeAccount =>', merkleTreeAccount);
  console.log('treeConfig =>', treeConfig);
};

createMerkleTree();

/*
% ts-node src/<THIS_FILE>

merkleTree => 4RFxwemYRR9RUDLEH2Uo2EuatUu4EZQsFuEeH7wA8r4f
merkleTreeAccount => {
  publicKey: '4RFxwemYRR9RUDLEH2Uo2EuatUu4EZQsFuEeH7wA8r4f',
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
    authority: 'AgGoE8DcTK6nDdy5xo2Pa5GqEpWXwQz8HPJr1C16egnk',
    creationSlot: 270176961n,
    padding: [ 0, 0, 0, 0, 0, 0 ]
  },
  tree: {
    sequenceNumber: 0n,
    activeIndex: 0n,
    bufferSize: 1n,
    changeLogs: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    rightMostPath: {
      proof: [Array],
      leaf: '11111111111111111111111111111111',
      index: 0
    }
  },
  canopy: []
}
treeConfig => {
  publicKey: 'AgGoE8DcTK6nDdy5xo2Pa5GqEpWXwQz8HPJr1C16egnk',
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
  numMinted: 0n,
  isPublic: false,
  isDecompressible: 1
}
*/