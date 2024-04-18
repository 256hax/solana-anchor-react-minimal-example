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
  parseLeafFromMintV1Transaction,
  findLeafAssetIdPda,
} from '@metaplex-foundation/mpl-bubblegum';

const parseLeafFromMintSignature = async () => {
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
  //  Get Asset ID from Mint(without collection)
  // -------------------------------------
  const merkleTree = publicKey('AxR2UTtq3pZ5ZFaAs9tSWtiz4HftTAftKzMfs8ZjtcqQ');
  const signatureString =
    'GRWaP7NutXcrnH9QZwZT5XP5ksU3jUs2pRaREbjx1SFoxMtgPZLkq4SF58MFEmrePaTD1koofhcLJNKbcmSgKjF';
  const signatureUint8Array = bs58.decode(signatureString);

  const leaf: LeafSchema = await parseLeafFromMintV1Transaction(
    umi,
    signatureUint8Array
  );
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex: leaf.nonce,
  });

  console.log('signatureString =>', signatureString);
  console.log('leaf =>', leaf);
  console.log('assetId =>', assetId);
};

parseLeafFromMintSignature();

/*
% ts-node src/<THIS_FILE>

signatureString => GRWaP7NutXcrnH9QZwZT5XP5ksU3jUs2pRaREbjx1SFoxMtgPZLkq4SF58MFEmrePaTD1koofhcLJNKbcmSgKjF
leaf => {
  __kind: 'V1',
  id: 'CjBKALu6F1CERdXmyJVfKRXviBQWAcgYGPejyuQpgGb8',
  owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  delegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  nonce: 6n,
  dataHash: Uint8Array(32) [
    122, 193,  19, 200,  35,  43,  24, 208,
    114, 122, 193,  75,  69, 107,  38, 238,
    185,  61, 234, 138, 172, 156, 246, 108,
      6,  23,   9, 150, 177, 248, 160, 175
  ],
  creatorHash: Uint8Array(32) [
    246, 203, 247, 167, 122, 253,  78,
    161, 245, 117, 112, 177, 231, 175,
    225,  71, 197,  19,  82,  76, 153,
    203, 245, 172, 250, 159, 220, 225,
     82, 161, 115,  73
  ]
}
assetId => [ 'D6Wx9S28GPrUuLH5dnyyrMBKfQ3JNGcMdJtnjKCE9DHa', 254 ]
*/
