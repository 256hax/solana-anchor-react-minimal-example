// Docs: https://mpl-toolbox-js-docs.vercel.app/functions/deactivateLut.html

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { deactivateLut } from '@metaplex-foundation/mpl-toolbox';

const main = async () => {
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
  //  Create a Deactive LUT Instructions
  // ----------------------------------------------------
  const address = publicKey('DD6xxSHmvDyBvttrcH2bHgichFCDEkp7fZxuSWcH234e');
  const authority = umi.payer;

  const instruction = deactivateLut(umi, {
    address,
    authority,
  });

  // ----------------------------------------------------
  //  Send Transaction
  // ----------------------------------------------------
  const result = await instruction.sendAndConfirm(umi);

  console.log('signature =>', bs58.encode(result.signature));
};

main();

/*
ts-node src/addressLookupTable/2_deactivateLut.ts
signature => 4bKMuEwxJ9qKURUwccaKVFJ8fGdNmugTg9W7Y4SShs5UW31sQ5QaCGJ7dq4DMu8pMffK7FEBuB7kFkuLb6bJSbHm
*/
