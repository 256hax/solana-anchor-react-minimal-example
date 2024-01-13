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

  // Public RPC unavailbale DAS on Devnet. Use following RPC:
  //  https://developers.metaplex.com/bubblegum/rpcs
  const endpoint = process.env.HELIUS_API_WITH_URL;
  if (!endpoint) throw new Error('endpoint not found.');

  const umi = createUmi(endpoint).use(dasApi());

  // -------------------------------------
  //  Get Asset ID from Mint to Collection Signature
  // -------------------------------------
  const merkleTree = publicKey('D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui');
  const signatureString =
    '3b763DEtvBzRR5mShbS25yQVoVuUsDCGmSLUvS6C3TCeGQkhyAPVcNuCy2HuoUNphKfieXAyXupBYJipaqxMe48V';
  const signatureUint8Array = bs58.decode(signatureString);

  const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
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

parseLeafFromMintToCollectionSignature();

/*
% ts-node src/<THIS_FILE>

signatureString => 3b763DEtvBzRR5mShbS25yQVoVuUsDCGmSLUvS6C3TCeGQkhyAPVcNuCy2HuoUNphKfieXAyXupBYJipaqxMe48V
leaf => {
  __kind: 'V1',
  id: 'Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq',
  owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  delegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  nonce: 0n,
  dataHash: Uint8Array(32) [
    249, 117, 163,  64, 223, 102,  55, 155,
     10, 109, 180, 117, 232, 163, 124, 149,
     71, 127, 135,  33, 199, 204,  71, 141,
     18,  74, 149, 250,  38,  11,  12,   2
  ],
  creatorHash: Uint8Array(32) [
     64, 187, 244,  77, 160,  13,  30, 158,
    253,  48,  33, 242, 128,  17,  11,  97,
    144,  18, 109, 195, 152, 197, 213, 201,
    246, 238,  82, 159, 194, 227, 182, 237
  ]
}
assetId => [ 'Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq', 253 ]
*/
