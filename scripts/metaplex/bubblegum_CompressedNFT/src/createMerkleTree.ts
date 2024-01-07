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
  publicKey: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
  secretKey: Uint8Array(64) [
    200,  46, 167, 176, 248,  50, 165,  36, 121, 180,  97,
    180, 138,  27,   1, 114,  51, 115, 226, 144, 172,  74,
    212,  16,   4, 190, 100, 210, 115,  89, 100,  27, 179,
    188,  62, 247,  95, 245, 177, 198, 114, 191, 122, 184,
    226, 227,  81,  67, 130,  21, 165,   7, 105, 231,  21,
     60, 239, 192,  31,  99, 211,  12, 143,  81
  ],
  signMessage: [AsyncFunction: signMessage],
  signTransaction: [AsyncFunction: signTransaction],
  signAllTransactions: [AsyncFunction: signAllTransactions]
}
signature => 5kgtHMb7qxNpEquTv2VyYAjLns7cS3rGei2vbnAqxc7zvuskANwq3X8kGVEFpW2uB2QhzaxA8U5cdFL9i3kqRjiv
result => {
  context: { apiVersion: '1.17.12', slot: 270763465 },
  value: {
    confirmationStatus: 'processed',
    confirmations: 0,
    err: null,
    slot: 270763465,
    status: { Ok: null }
  }
}
*/