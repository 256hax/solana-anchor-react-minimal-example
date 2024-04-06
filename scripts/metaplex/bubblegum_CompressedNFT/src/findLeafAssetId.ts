// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum';

const findLeafAssetId = async () => {
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
  umi.use(dasApi());

  // -------------------------------------
  //  Fetching an Asset ID by Merkle Tree and Leaf Index
  // -------------------------------------
  const merkleTree = publicKey('D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui');
  const leafIndex = 0;

  const [assetId, bump] = await findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex,
  });

  console.log('assetId =>', assetId);
  console.log('bump =>', bump);
};

findLeafAssetId();

/*
% ts-node src/<THIS_FILE>

assetId => Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq
bump => 253
*/
