// Docs:
//   https://developers.metaplex.com/toolbox#spl-address-lookup-table
//   https://github.com/metaplex-foundation/umi/blob/main/docs/transactions.md#using-address-lookup-tables

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import { keypairIdentity, transactionBuilder } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createLut, addMemo } from '@metaplex-foundation/mpl-toolbox';

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
  //  Create Address Lookup Table
  // ----------------------------------------------------
  const authority = umi.payer;
  const addressA = umi.eddsa.generateKeypair().publicKey;
  const addressB = umi.eddsa.generateKeypair().publicKey;

  const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' });
  const [lutBuilder, lut] = await createLut(umi, {
    authority,
    recentSlot,
    addresses: [addressA, addressB],
  });
  await lutBuilder.sendAndConfirm(umi);

  lutBuilder.setAddressLookupTables([lut]);

  // ----------------------------------------------------
  //  Send Transaction
  // ----------------------------------------------------
  const result = await lutBuilder.sendAndConfirm(umi);

  console.log('addressA =>', addressA.toString());
  console.log('addressB =>', addressB.toString());
  console.log('lut =>', lut);
  console.log('signature =>', bs58.encode(result.signature));
};

main();

/*
ts-node src/addressLookupTable/1_createLut.ts
addressA => AtbyFhLbPQj2gtiRYaEyhdFRnE8WUuwNErY8QrgukFyB
addressB => 3MXZ3XKY3BTZL7HDTCKGqFdsTJvEpmQwGe1vEK8NWNPN
lut => {
  publicKey: 'DD6xxSHmvDyBvttrcH2bHgichFCDEkp7fZxuSWcH234e',
  addresses: [
    'AtbyFhLbPQj2gtiRYaEyhdFRnE8WUuwNErY8QrgukFyB',
    '3MXZ3XKY3BTZL7HDTCKGqFdsTJvEpmQwGe1vEK8NWNPN'
  ]
}
signature => 5DSsVBAcoYREuwLwDYTDkrHyozVXUUmj6NrgxvoRvh27cVHLLhSrcMdCLhypNfpkLhvrtPmdzcJSWGkqizu76LEA
*/
