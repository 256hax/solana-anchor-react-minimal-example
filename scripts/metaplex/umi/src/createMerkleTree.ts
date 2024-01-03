// Docs: https://developers.metaplex.com/bubblegum/create-trees

// Lib
import * as dotenv from 'dotenv'
import * as bs58 from 'bs58';

// Metaplex
import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const createMerkleTree = async () => {
  dotenv.config();

  const endpoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endpoint)
    
  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.')

  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

  umi.use(keypairIdentity(payerKeypair));

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
  publicKey: 'BSqSLz1LoVWqt6adWN2okLQBT3QiyDz2ysEbjJqEnb4Y',
  secretKey: Uint8Array(64) [
    242,  87, 130, 210,  52, 176,  10, 233, 212, 210,  90,
    190,  33, 122, 204,  30, 217, 105, 129,   9, 167, 220,
     21, 242,  60, 226,   7, 251,  55,  77, 202,  91, 155,
     51,  40,  72,  61,  72, 109,  18, 183, 242,  77, 121,
     86, 231, 133,  43, 163,  93, 112,  78, 138, 183,  54,
    167, 111,  84,  87, 197,  32, 167,  31, 173
  ],
  signMessage: [AsyncFunction: signMessage],
  signTransaction: [AsyncFunction: signTransaction],
  signAllTransactions: [AsyncFunction: signAllTransactions]
}
signature => 4DdNqmki1nj5KBqYHtg5JD1bcTyQQk6MvP3SxKmftFDWSsK9vuHaXNTDH4DucHfy2bQ7CTWbZ4XQzFC2DghoB6vb
*/