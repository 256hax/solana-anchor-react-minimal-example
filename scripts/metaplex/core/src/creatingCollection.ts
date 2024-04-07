// Docs: https://developers.metaplex.com/core/getting-started/js
// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { keypairIdentity, generateSigner } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createCollectionV1 } from '@metaplex-foundation/mpl-core';

// Modules
import { isConfirmed } from './modules/isConfirmed';

const creatingCollection = async () => {
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
  //  Create a Collection
  // -------------------------------------
  const collection = generateSigner(umi);

  const result = await createCollectionV1(umi, {
    collection: collection,
    name: 'Core Collection',
    uri: 'https://example.com/my-nft.json',
  }).sendAndConfirm(umi);

  await isConfirmed(
    endpoint,
    bs58.encode(result.signature), // Signature
    1000, // Sleep Time
    30 // Max Retry
  );

  console.log('signature =>', bs58.encode(result.signature));
};

creatingCollection();

/*
ts-node src/creatingCollection.ts
Confirmation status is confirmed.
signature => 5rfRBST6FioZWSYXBwJqcFEmNiwaXEJsc42FknNjigvr8tB3rRGq26tkyMzmLtFA4uP8YFnxoPbPpWnUqvkGGNje
*/
