// Docs: https://developers.metaplex.com/bubblegum/create-trees

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  generateSigner,
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
  //  Create Merkle Tree
  // ----------------------------------------------------
  // Max Depth / Max Buffer Size Table:
  //  https://developers.metaplex.com/bubblegum/create-trees#creating-a-bubblegum-tree
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 3,
    maxBufferSize: 8,
    // maxDepth: 14,
    // maxBufferSize: 64,
  });
  const result = await builder.sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('signature =>', bs58.encode(result.signature));

  // ----------------------------------------------------
  //  Fetching Merkle Tree
  // ----------------------------------------------------
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
  const treeConfig = await fetchTreeConfigFromSeeds(umi, {
    merkleTree: merkleTree.publicKey,
  });

  console.log('merkleTreeAccount =>', merkleTreeAccount);
  console.log('treeConfig =>', treeConfig);
};

createMerkleTree();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => {
  publicKey: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
  secretKey: Uint8Array(64) [
    252, 154,  35, 128, 139, 102, 128, 218, 145, 160, 234,
     40,  30,  82,  36,  86, 100,  26, 201,  92, 130, 112,
     98, 235, 126, 154, 240,  90, 217,  45,  20, 200, 150,
    200, 229,  99,  26, 136, 136, 213, 230, 202, 154, 219,
    138,  40,  38, 198,  72, 205, 188,  60, 254,  89, 143,
    168, 240, 150, 104,  42, 134, 250, 246, 142
  ],
  signMessage: [AsyncFunction: signMessage],
  signTransaction: [AsyncFunction: signTransaction],
  signAllTransactions: [AsyncFunction: signAllTransactions]
}
signature => 3ADDNLSTX3hsYbr1YZy37jmA5QG61rG1Erq7uzuGRxDqd3L1CxwsgKAwxX6k7p5XUT9gTn5XeqArKbsiUJX8Gh1Z
merkleTreeAccount => {
  publicKey: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
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
    authority: 'GNfst5RPtrdv4AhnyBH3Zzz3cezUUztjw38TujRSfaE1',
    creationSlot: 269942887n,
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
  publicKey: 'GNfst5RPtrdv4AhnyBH3Zzz3cezUUztjw38TujRSfaE1',
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
