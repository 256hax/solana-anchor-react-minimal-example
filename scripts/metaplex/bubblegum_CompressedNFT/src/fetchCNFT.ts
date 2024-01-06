// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum';

const fetchCNFT = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endpoint).use(dasApi());

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');

  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

  umi.use(keypairIdentity(payerKeypair));

  // -------------------------------------
  //  Fetching a Compressed NFT
  // -------------------------------------
  const merkleTree = publicKey('B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT');
  const leafIndex = 7;

  const [assetId, bump] = await findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex,
  });

  // Use Metaplex DAS API RPCs if you need to get data.
  // Details: https://developers.metaplex.com/bubblegum/rpcs
  // 
  // e.g.
  // const rpcAsset = await umi.rpc.getAsset(assetId);
  // const rpcAssetProof = await umi.rpc.getAssetProof(assetId);
  // const rpcAssetListByOwner = await umi.rpc.getAssetsByOwner({
  //   owner: umi.identity.publicKey,
  // });
  // const rpcAssetListByCollection = await umi.rpc.getAssetsByGroup({
  //   groupKey: 'collection',
  //   groupValue: collectionMint,
  // });

  console.log('assetId =>', assetId);
  console.log('bump =>', bump);
};

fetchCNFT();

/*
% ts-node src/<THIS_FILE>

assetId => FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz
bump => 251
*/
