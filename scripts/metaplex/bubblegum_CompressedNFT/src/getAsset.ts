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
const getAsset = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // const endpoint = 'https://api.devnet.solana.com'; // Metaplex DAS unavailbale on Devnet.
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
  //  Get an Asset
  // -------------------------------------
  const assetId = publicKey('Bvnw4J2ijQ2ht9uhnEDzGaGndg9rAdwUPfan62L4touT');
  const asset = await umi.rpc.getAsset(assetId);

  console.log('assetId =>', assetId);
  console.log('asset =>', asset);
};

getAsset();

/*
% ts-node src/<THIS_FILE>

assetId => Bvnw4J2ijQ2ht9uhnEDzGaGndg9rAdwUPfan62L4touT
asset => {
  interface: 'V1_NFT',
  id: 'Bvnw4J2ijQ2ht9uhnEDzGaGndg9rAdwUPfan62L4touT',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://arweave.net/T22-vnvj7NDUyKMnmtUOC7jZQL9NzL69MLOWZsCay_g',
    files: [],
    metadata: { name: 'BonkBot', symbol: '' },
    links: {}
  },
  authorities: [
    {
      address: 'DSweX9jNzQ6M4qCXb2ow7X6cjZym2wtGk1RVmFW7Lq5T',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '95CyM8P98pYB2UsABvGkwmbY8bNLCZ7tjShWZg3H1sb8',
    creator_hash: 'EwBYYdBeEbhYXRZVVZrKz5aNFFwkohjhnfupP1ZLsixu',
    asset_hash: '76V78ZqLJMjnpkj5ZEiV8StmJZxNF2SEnnPcLEEV7JQK',
    tree: '31iJeZ7Sg452LMvVTjsNhwhYCUdneHJHFFawqAbGb1W7',
    seq: 74731,
    leaf_id: 72823
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'DGPTxgKaBPJv3Ng7dc9AFDpX6E7kgUMZEgyTm3VGWPW6'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.030000000000000002,
    basis_points: 300,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'DGPTx9RcP5GkxRNscrSaSETcwuiK6xcbX93G1DSxrLoY',
      share: 0,
      verified: true
    },
    {
      address: 'WoMbXFtdfH8crq2Zi7bQhfGx2Gv8EN4saP13gcdUGog',
      share: 50,
      verified: false
    },
    {
      address: 'ART5dr4bDic2sQVZoFheEmUxwQq5VGSx9he7JxHcXNQD',
      share: 50,
      verified: false
    }
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: 'single',
    owner: 'CJsPSQtV28CJiRt8XThuG5Ei1cX2fH5GcPoZYyM26gzm'
  },
  supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: null },
  mutable: true,
  burnt: false
}
*/
