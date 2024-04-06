// Docs: https://developers.metaplex.com/core/create-asset
// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';
import { sleep } from './lib/sleep';

// Metaplex
import { keypairIdentity, generateSigner, publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplCore,
  createV1,
  createCollectionV1,
} from '@metaplex-foundation/mpl-core';

// Solana
import { Connection } from '@solana/web3.js';

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

  // Register Library
  // umi.use(mplCore());

  // -------------------------------------
  //  Create a Collection
  // -------------------------------------
  const collection = generateSigner(umi);

  const creatingCollectionResult = await createCollectionV1(umi, {
    collection: collection,
    name: 'Core Collection',
    uri: 'https://example.com/my-nft.json',
  }).sendAndConfirm(umi);

  // -------------------------------------
  //  Check a Created Collection
  // -------------------------------------
  const connection = new Connection(endpoint, 'confirmed');

  let status = await connection.getSignatureStatus(
    bs58.encode(creatingCollectionResult.signature),
    {
      searchTransactionHistory: true,
    }
  );

  while (
    status.value?.err === null &&
    status.value?.confirmationStatus === 'confirmed'
  ) {
    console.log('Collection not found. Sleep then check again...');
    await sleep(3000); // 1000 = 3sec

    status = await connection.getSignatureStatus(
      bs58.encode(creatingCollectionResult.signature),
      {
        searchTransactionHistory: true,
      }
    );
  }

  // -------------------------------------
  //  Create an Asset Into a Collection
  // -------------------------------------
  const asset = generateSigner(umi);

  const creatingAssetResult = await createV1(umi, {
    asset,
    name: 'My Core NFT',
    uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
    collection: collection.publicKey,
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('collection =>', collection.publicKey.toString());
  console.log('asset =>', asset.publicKey.toString());
  console.log(
    'creatingCollectionResult signature =>',
    bs58.encode(creatingCollectionResult.signature)
  );
  console.log(
    'creatingAssetResult signature =>',
    bs58.encode(creatingAssetResult.signature)
  );
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
