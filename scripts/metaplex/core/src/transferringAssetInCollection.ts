// Docs: https://developers.metaplex.com/core/transfer
// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import {
  keypairIdentity,
  publicKey,
  generateSigner,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore, createV1, transferV1 } from '@metaplex-foundation/mpl-core';

const transferringAssetInCollection = async () => {
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
  //  Transferring Asset In a Collection
  // -------------------------------------
  const asset = publicKey('EWALWLHh2F1LQAHpw2zDQdDyMBiQQAWVRJoeJ5uz6gk6');
  const collection = publicKey('2zgtwZ5oc7FBZRxDrVnpQqNsWm1kWZhnZtXqRat75KqE');
  const newOwner = generateSigner(umi).publicKey;

  const result = await transferV1(umi, {
    asset,
    newOwner,
    collection,
  }).sendAndConfirm(umi);

  console.log('signature =>', bs58.encode(result.signature));
};

transferringAssetInCollection();

/*
ts-node src/transferringAssetInCollection.ts
signature => dP6VU8W1Lakp8u3tXaKYjhgof6ZyTzi7cNpCEFH8uSWbXwY3ttGVfJuztFSDDGBQMzbacHCZz7mkjBRNpDhV1wp
*/
