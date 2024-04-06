// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  keypairIdentity,
  generateSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  createNft,
} from '@metaplex-foundation/mpl-token-metadata';

const createCollection = async () => {
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

  // Register Library
  umi.use(mplTokenMetadata());

  // -------------------------------------
  //  Create a Collection NFT
  // -------------------------------------
  // If you need to upload JSON Metadata, use "umi.uploader.uploadJson".

  // const collectionUpdateAuthority = generateSigner(umi);
  const collectionUpdateAuthority = createSignerFromKeypair(umi, payerKeypair);

  const collectionMint = generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: 'My Collection NFT',
    uri: 'https://arweave.net/tyt1PcejOzYs_8aZcna6KhN-vmIEnIMfm3Ip3G7Us2A',
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log(
    'collectionUpdateAuthority =>',
    collectionUpdateAuthority.publicKey.toString()
  );
  console.log('collectionMint =>', collectionMint.publicKey.toString());
};

createCollection();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
collectionUpdateAuthority => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
collectionMint => CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx
*/