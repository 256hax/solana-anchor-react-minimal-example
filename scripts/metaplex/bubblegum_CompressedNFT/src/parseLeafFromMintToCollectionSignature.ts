// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import {
  LeafSchema,
  parseLeafFromMintToCollectionV1Transaction,
  findLeafAssetIdPda,
} from '@metaplex-foundation/mpl-bubblegum';

const parseLeafFromMintToCollectionSignature = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Register Library
  umi.use(dasApi());
  
  // -------------------------------------
  //  Get Asset ID from Mint to Collection Signature
  // -------------------------------------
  const merkleTree = publicKey('81WgE6NEKLT71YQpySphUE59oicJX3QRmRNZmijNvmzq');
  const signatureString =
    '47X1811k6jsQ2FyebkHo3uX3JBdWJXyHCTSq5VFtog69CUgsyDyhNoR5ZapzguG2MdjjeX7fqjSwnfhvqy9taTPG';
  const signatureUint8Array = bs58.decode(signatureString);

  const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
    umi,
    signatureUint8Array
  );
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex: leaf.nonce,
  });

  console.log('signatureUint8Array =>', signatureUint8Array);
  console.log('leaf =>', leaf);
  console.log('assetId =>', assetId);
};

parseLeafFromMintToCollectionSignature();

/*
ts-node src/parseLeafFromMintToCollectionSignature.ts
signatureUint8Array => Uint8Array(64) [
  155, 171, 214, 227,  34,  28, 138,  30,  70,   6, 183,
  238,  50, 210, 178, 214,  22, 106, 251,  53, 166, 127,
   75,   0,  18, 225, 128, 117, 183, 234,   8, 228,  96,
   22, 177,  27,  60,  31, 226, 255, 178, 119,  50, 114,
  132,  88, 191, 255, 238, 222, 203,  77, 163, 171,  91,
  138, 230,  36,  73, 151,  56, 125,  92,  11
]
leaf => {
  __kind: 'V1',
  id: 'GyKSHxPxMpBPnvNUmcJVcjS6VmqpfNBmmGHUyX5THG4x',
  owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  delegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  nonce: 0n,
  dataHash: Uint8Array(32) [
     18, 193,  94, 178, 231, 192, 138, 208,
     78,  88, 182, 107,  49, 210,  88,  57,
    243, 169, 197,   7, 202, 193, 201,  70,
    138,  60,   5, 238, 128,  83,  37,  24
  ],
  creatorHash: Uint8Array(32) [
     64, 187, 244,  77, 160,  13,  30, 158,
    253,  48,  33, 242, 128,  17,  11,  97,
    144,  18, 109, 195, 152, 197, 213, 201,
    246, 238,  82, 159, 194, 227, 182, 237
  ]
}
assetId => [ '29SddwDjgBtBHK3SvyQLfXRykYDsyrca3SdmzC5VtNnH', 254 ]
*/
