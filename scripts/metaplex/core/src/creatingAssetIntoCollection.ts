// Docs: https://developers.metaplex.com/core/create-asset
// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import {
  keypairIdentity,
  generateSigner,
  publicKey,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createV1 } from '@metaplex-foundation/mpl-core';

const creatingAssetIntoCollection = async () => {
  // -------------------------------------
  //  Setup
  // -------------------------------------
  dotenv.config();

  // Set Endpoint
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

  // -------------------------------------
  //  Set a Collection and Collection Authority
  // -------------------------------------
  const collection = publicKey('7YjTr5mQ6zcC9CCmFkLSAnVQuYZuMtmfbpQrkwLubmDv');
  // Set Keypair of Collection Authority.
  const collectionAuthoritySigner = createSignerFromKeypair(umi, payerKeypair);

  // -------------------------------------
  //  Create an Asset Into a Collection
  // -------------------------------------
  const asset = generateSigner(umi);

  const result = await createV1(umi, {
    asset,
    name: 'My Core NFT',
    uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
    collection,
    authority: collectionAuthoritySigner,
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('asset =>', asset.publicKey.toString());
  console.log('signature =>', bs58.encode(result.signature));
};

creatingAssetIntoCollection();

/*
ts-node src/creatingAssetIntoCollection.ts
payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
collection => GTDQoxdzoNJ2d2JUbduRPGgxpnNqWRFqnkn3pPabAGr4
asset => HhkyFrKKmhcQa5AT8mHjTEmKLUb8HBewG9ccsLjAuN3c
creatingCollectionResult signature => 2bb47mQXE9a9cRps7avYetCsR72rM66U9vZ62kUmcynrK6FMqBDGL8ALcncDURESVZoeHk2i2z2KoWckjRmJ7hT5
creatingAssetResult signature => 5atP9pDMGre7vJBMSjMDT1Lsd2R9p5TAdcobeLEDDYqHDgvo28dKyrJGDcAjWpunHtsbWzNpn3fSmR5yHZvjJAFn
*/
