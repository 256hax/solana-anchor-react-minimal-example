// Docs:
//  https://developers.metaplex.com/bubblegum/verify-creators
//  https://github.com/metaplex-foundation/mpl-bubblegum/blob/main/clients/js/test/verifyCreator.test.ts

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  mplBubblegum,
  getAssetWithProof,
  unverifyCreator,
} from '@metaplex-foundation/mpl-bubblegum';

const verifyCreatorForCnft = async () => {
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
  umi.use(mplBubblegum());
  
  // -------------------------------------
  //  Create a Collection NFT
  // -------------------------------------
  const assetId = publicKey('CjBKALu6F1CERdXmyJVfKRXviBQWAcgYGPejyuQpgGb8');
  let assetWithProof = await getAssetWithProof(umi, assetId);
  let creator = createSignerFromKeypair(umi, payerKeypair);

  const result = await unverifyCreator(umi, {
    ...assetWithProof,
    creator,
  }).sendAndConfirm(umi);

  console.log('payer =>', umi.identity.publicKey.toString());
  console.log('assetId =>', assetId);
  console.log('creators =>', assetWithProof.rpcAsset.creators);

  console.log('\n--- After unverify ---------------------------------------------------');
  console.log('result =>', bs58.encode(result.signature));

  assetWithProof = await getAssetWithProof(umi, assetId);
  creator = createSignerFromKeypair(umi, payerKeypair);
  console.log('creators =>', assetWithProof.rpcAsset.creators);
};

verifyCreatorForCnft();

/*
% ts-node src/<THIS_FILE>

assetId => CjBKALu6F1CERdXmyJVfKRXviBQWAcgYGPejyuQpgGb8
creators => [
  {
    address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    share: 100,
    verified: true
  }
]

--- After unverify ---------------------------------------------------
result => 58ZmmuMr3xaD6SCgb4v1T2Evvmi6mLBL631mXsrmBFMhDYtfbS9stcQfghauKkEEE9TaVRaszbrz4hW5BW3far5x
creators => [
  {
    address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    share: 100,
    verified: false
  }
]
*/
