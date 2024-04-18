// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetProof = async () => {
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
  //  Get an Asset Proof
  // -------------------------------------
  const assetId = publicKey('Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq');
  const proof = await umi.rpc.getAssetProof(assetId);

  console.log('assetId =>', assetId);
  console.log('proof =>', proof);
};

getAssetProof();

/*
% ts-node src/<THIS_FILE>

assetId => Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq
proof => {
  root: '9KVu8iZ3CzZXfQAdanZLG8XyETV7uxp1uVixJqvSdKE3',
  proof: [
    '11111111111111111111111111111111',
    'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
    'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1'
  ],
  node_index: 8,
  leaf: 'CGs9Sk4LVppJADWjUnHRiNFAH7nQ7NimZwesijkD1Aze',
  tree_id: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui'
}
*/
