// Docs: https://github.com/metaplex-foundation/digital-asset-standard-api
// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const getAssetProof = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // const endpoint = 'https://api.devnet.solana.com'; // DAS unavailbale on Devnet.
  const endpoint = 'https://api.mainnet-beta.solana.com';
  const umi = createUmi(endpoint).use(dasApi());

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');

  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

  umi.use(keypairIdentity(payerKeypair));

  // -------------------------------------
  //  Get an Asset Proof
  // -------------------------------------
  const assetId = publicKey('9pk95RtqaXwSVwWwL9LDMBTQvPCBd6eWmVPyvTXoaFqH');
  const proof = await umi.rpc.getAssetProof(assetId);

  console.log('assetId =>', assetId);
  console.log('proof =>', proof);
};

getAssetProof();

/*
% ts-node src/<THIS_FILE>

assetId => 9pk95RtqaXwSVwWwL9LDMBTQvPCBd6eWmVPyvTXoaFqH
proof => {
  root: 'EcG2XcZNcJ1whADdue8FXY4pYwcHcHmJudGy7pvvjvKt',
  proof: [
    '2LftJcVJewzLzP2iu1ZcDnEqY3ddNyyboXVRLBKyUApd',
    '6B1Ks2FhhMyBRJWeR1WhFouMxg7y6o5jfFmzMoinznV1',
    'FVHjZXyeH8vFfPVyxh4Vz18oU3ctagT2QqFcAkCEBcra',
    'CH2s73xSdCBkk1kuF768BoBhRkRGTHCjQw1J844sRpmG',
    'FTCgkxq9dAE1voUxaF1iFXFZ7RGt6LckWqdDgXemKPHf',
    '8BULTtry2WYNHWFmj3XaWbMhNADfTtdnKpmDejp7rqSs',
    '2cLGB3ZUaRiNnVciXRmSnthcwPkZ21WAoGkjHVWsKXHB',
    '3s7zVadGbES4oF2wC9Qqn6RPRH8QuSSWAiiwXvDnjke8',
    'F8uWx4TpXgt3Uu7BhwMFtsbnmTXhV8sJM8RdbTx2YeeL',
    'C5LuCCNzVtkV9rssK81bnLnASEAowzTaVmS12gZkcHVo',
    'GsMH8uzDsVqy7RHeD9jcvSJTCpRwh8HYsSootadfFBaA',
    '4qAbgiQqNrQxs3piqzTVHp3XWPEHjF2ev8B5rU4dgfuD',
    'HLxQJoD6CvL6L1DMCZzJWEH1858EDYiZsUrk1qF9Ks6k',
    '75XjLZbaR1wTzvAJVWFoCe2pXRpBdiyApdSbSSD21U1Y',
    '2uwcQAJNUwZaF82zUtnFY8GxTzALKzF7s8i1ELXY1b8j',
    'DjBQzMcNWe8bLxE44PkaKbnxwMkYFe3WVRhgCaKTXmQE',
    'HcWq5nQ6LKD2epLqP111nCEnLTKsZPR9eB2cVS37WUdD',
    'CNg82XMSry4vNrTdWRqBy3jtiragfG8ibRg8T93hHy3q',
    '752CmMF5k7acEFEmJA7oE3aobbWj7CAZVm3KpDR6HiRV',
    'D9GGr1ycBmgRbHJyJzmxMk5aoKZmjdezB4NpxopAcgpP'
  ],
  node_index: 1122217,
  leaf: '31U584EuPS4urtQXHtD8fqCtS3MrY2yhJaVtSg5Gza4H',
  tree_id: 'DQpWLLs7Feakyij7hYJtTRf6XkheMy9b5KUHdYW1CvG4'
}
*/
