// Docs:
//  https://developers.metaplex.com/core/getting-started/js
//  https://github.com/metaplex-foundation/mpl-core/blob/main/clients/js/README.md
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

  const endpoint = 'https://api.devnet.solana.com';
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
  const asset = publicKey('11111111111111111111111111111111');
  const newOwner = generateSigner(umi).publicKey;
  const collection = publicKey('GTDQoxdzoNJ2d2JUbduRPGgxpnNqWRFqnkn3pPabAGr4');

  await transferV1(umi, {
    asset,
    newOwner,
    collection,
  }).sendAndConfirm(umi);
};

transferringAssetInCollection();

/*
ts-node src/createNft.ts
payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
asset => 9rEm1ABr7ey2knn8QQFz8s8noXr5MQzcPRTvCJKoxRdH
creating signature => nzwcCr5fCkovXr85KXHFamYCKY2x8QgSHa9bFqZM5R5vTbdrGEAS6wPGWkSGSfzwTb5baVPVTrcDDL4oQafg2zX
*/
