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
    maxDepth: 3,
    maxBufferSize: 8,
    // maxDepth: 14,
    // maxBufferSize: 64,
  });
  const confirmResult = await builder.sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('signature =>', bs58.encode(confirmResult.signature));
  console.log('result =>', confirmResult.result);
};

createMerkleTree();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => {
  publicKey: '81WgE6NEKLT71YQpySphUE59oicJX3QRmRNZmijNvmzq',
  secretKey: Uint8Array(64) [
     11, 241, 124, 113,  94, 217,  53, 249, 253, 202, 240,
    246, 158,  51, 245, 126, 220,  52, 243,  15,  47,  90,
     42, 156,  29,  85, 228,   9, 143,  69, 159,   7, 104,
     35,  93,  20,  65, 193,  72, 176, 182,  60, 228, 238,
    119, 133, 189, 159, 248, 138,  92, 113,   6, 106, 199,
    207,  42, 250,  71, 212, 209, 176,  72,  98
  ],
  signMessage: [AsyncFunction: signMessage],
  signTransaction: [AsyncFunction: signTransaction],
  signAllTransactions: [AsyncFunction: signAllTransactions]
}
signature => 3gz1a2XFzNNMfDa1NxVjTHHNYjajQDkZB61P4Qt83UGk1Tz93zRhtGZJuZsGAgTbVga7WQYB5QNQELS2KNvZxQbg
result => {
  context: { apiVersion: '1.18.4', slot: 285930224 },
  value: {
    confirmationStatus: 'processed',
    confirmations: 0,
    err: null,
    slot: 285930224,
    status: { Ok: null }
  }
}
*/