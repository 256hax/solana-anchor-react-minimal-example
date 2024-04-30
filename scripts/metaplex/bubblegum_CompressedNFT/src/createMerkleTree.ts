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
} from '@metaplex-foundation/mpl-bubblegum';

const createMerkleTree = async () => {
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
  //  Create Merkle Tree
  // ----------------------------------------------------
  // Max Depth / Max Buffer Size Table:
  //  https://developers.metaplex.com/bubblegum/create-trees#creating-a-bubblegum-tree
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    // maxDepth: 3,
    // maxBufferSize: 8,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  const confirmResult = await builder.sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('signature =>', bs58.encode(confirmResult.signature));
  console.log('result =>', confirmResult.result);
};

createMerkleTree();

/*
ts-node src/createMerkleTree.ts
payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => {
  publicKey: '52QLGuQijXUUXm4FubWqiENsPYYavvBzygsqWUHXtEja',
  secretKey: Uint8Array(64) [
    199, 186, 163, 227,   6, 165, 201, 235,  78,  64, 124,
    101,  34, 146,  82,  37, 184,  90, 156,  47, 181,  96,
    158,  95, 176, 184, 103, 255,   2, 149, 209,  63,  59,
    202, 181, 223, 198, 157,  64,  18,  54, 170,  75,  67,
     79, 236, 199, 138, 184,  94, 139, 142, 226, 238,  40,
    130,  98, 124, 185, 162, 215, 243, 213, 145
  ],
  signMessage: [AsyncFunction: signMessage],
  signTransaction: [AsyncFunction: signTransaction],
  signAllTransactions: [AsyncFunction: signAllTransactions]
}
signature => 2Szt7pVaz63bY2r6f9L9Hxk4RjhvCe7Y2MMquw8soV7ePPJnUxMY7S2cNKDQJDLHtcfLiFvtGCtnYAHXhczxzR9W
result => { context: { slot: 295652248 }, value: { err: null } }
*/