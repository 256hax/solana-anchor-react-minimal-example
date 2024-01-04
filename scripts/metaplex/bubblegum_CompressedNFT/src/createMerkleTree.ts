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
};

createMerkleTree();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => {
  publicKey: '4RFxwemYRR9RUDLEH2Uo2EuatUu4EZQsFuEeH7wA8r4f',
  secretKey: Uint8Array(64) [
    205, 127,  93, 247,  81,  73, 117, 116, 125,  78,  65,
     47,  60, 120,  23,  47,  43, 141, 186, 179, 123, 162,
     78, 194,  13,  57,  59, 138, 165, 123,  58, 157,  50,
    201, 235, 174, 197, 104,  49, 113, 168, 154, 203, 219,
     35, 201, 220,  27, 226, 164,  16, 227, 191,   1, 147,
    189, 237, 117, 253, 225, 244, 145,  69, 160
  ],
  signMessage: [AsyncFunction: signMessage],
  signTransaction: [AsyncFunction: signTransaction],
  signAllTransactions: [AsyncFunction: signAllTransactions]
}
signature => 3xovxQNZHmvJ9biXrtngGvHSaZHX1Grf4MqZHuQQWqaHjpRvkaHGDyFsU2XncZRKnAP9CGob7f7xCGhHxt13MxHp
*/