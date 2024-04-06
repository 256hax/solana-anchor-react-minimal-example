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
  verifyCreator,
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

  const result = await verifyCreator(umi, {
    ...assetWithProof,
    creator,
  }).sendAndConfirm(umi);

  console.log('payer =>', umi.identity.publicKey.toString());
  console.log('assetId =>', assetId);
  console.log('assetWithProof =>', assetWithProof);
  console.log('creators =>', assetWithProof.rpcAsset.creators);

  console.log('\n--- After verify ---------------------------------------------------');
  console.log('result =>', bs58.encode(result.signature));

  assetWithProof = await getAssetWithProof(umi, assetId);
  creator = createSignerFromKeypair(umi, payerKeypair);
  console.log('creators =>', assetWithProof.rpcAsset.creators);
};

verifyCreatorForCnft();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
assetId => CjBKALu6F1CERdXmyJVfKRXviBQWAcgYGPejyuQpgGb8
assetWithProof => {
  leafOwner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  leafDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  merkleTree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
  root: Uint8Array(32) [
    226, 118, 178, 186, 170, 14, 110,  56,
    192,  86, 138, 110, 158, 20,  85,  63,
     68, 142, 173, 158,  27, 45,  96, 153,
    166,   5, 104,  22, 153, 18, 189, 109
  ],
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
  ],
  nonce: 6,
  index: 6,
  proof: [
    '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
    'DD3L4Z8SA73NGLqGBpM17w65X97cZn595vvdddE5k14L',
    'AXmXpUFx1SsEEYTJT1FvihogRxzHALVhQsdXAoHLherw'
  ],
  metadata: {
    name: 'cNFT w/o Collection',
    symbol: '',
    uri: 'https://madlads.s3.us-west-2.amazonaws.com/json/4731.json',
    sellerFeeBasisPoints: 500,
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: { __option: 'None' },
    tokenStandard: { __option: 'Some', value: 0 },
    collection: { __option: 'None' },
    uses: { __option: 'None' },
    tokenProgramVersion: 0,
    creators: [ [Object] ]
  },
  rpcAsset: {
    interface: 'V1_NFT',
    id: 'CjBKALu6F1CERdXmyJVfKRXviBQWAcgYGPejyuQpgGb8',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://madlads.s3.us-west-2.amazonaws.com/json/4731.json',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: '9GBVs5cpjKbUjY6Gast5nySBcGA1Qg21qCV94NXzAN6a',
      creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
      asset_hash: 'CMgchHbpYPYu5MpxGRFhtHRBeABicbhWVkP3958TPtjB',
      tree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
      seq: 7,
      leaf_id: 6
    },
    grouping: [],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0.05,
      basis_points: 500,
      primary_sale_happened: false,
      locked: false
    },
    creators: [ [Object] ],
    ownership: {
      frozen: false,
      delegated: false,
      delegate: null,
      ownership_model: 'single',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    supply: {
      print_max_supply: 0,
      print_current_supply: 0,
      edition_nonce: null
    },
    mutable: true,
    burnt: false
  },
  rpcAssetProof: {
    root: 'GF27nRBdibiqnPLH1G98Agj13Q423SSRYUStc6F8BFTJ',
    proof: [
      '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
      'DD3L4Z8SA73NGLqGBpM17w65X97cZn595vvdddE5k14L',
      'AXmXpUFx1SsEEYTJT1FvihogRxzHALVhQsdXAoHLherw'
    ],
    node_index: 14,
    leaf: 'CMgchHbpYPYu5MpxGRFhtHRBeABicbhWVkP3958TPtjB',
    tree_id: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT'
  }
}
creators => [
  {
    address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    share: 100,
    verified: false
  }
]

--- After verify ---------------------------------------------------
result => Pn88PTpAESmRoYNfamPb4L6dHLno4Lg9tbXT49QuF6cbkk2AZhnxWsiEUzFWyNNBFAEHejLronqhqTHYbpJH1Tu
creators => [
  {
    address: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    share: 100,
    verified: true
  }
]
*/
