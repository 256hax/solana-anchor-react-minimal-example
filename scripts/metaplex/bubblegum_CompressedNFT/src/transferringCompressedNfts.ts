// Docs: https://developers.metaplex.com/bubblegum/transfer-cnfts

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import {
  mplBubblegum,
  getAssetWithProof,
  transfer,
} from '@metaplex-foundation/mpl-bubblegum';

const transferringCompressedNfts = async () => {
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
  
  // ----------------------------------------------------
  //  Transferring cNFT
  // ----------------------------------------------------
  const assetId = publicKey('GyKSHxPxMpBPnvNUmcJVcjS6VmqpfNBmmGHUyX5THG4x');
  const assetWithProof = await getAssetWithProof(umi, assetId);
  const currentLeafOwner = publicKey(
    'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  );
  const newLeafOwner = publicKey(
    '55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK'
  );

  const result = await transfer(umi, {
    ...assetWithProof,
    leafOwner: currentLeafOwner,
    newLeafOwner: newLeafOwner,
  }).sendAndConfirm(umi);

  console.log('assetId =>', assetId);
  console.log('assetWithProof =>', assetWithProof);
  console.log('currentLeafOwner =>', currentLeafOwner);
  console.log('newLeafOwner =>', newLeafOwner);
  console.log('signature =>', bs58.encode(result.signature));
};

transferringCompressedNfts();

/*
ts-node src/transferringCompressedNfts.ts
assetId => GyKSHxPxMpBPnvNUmcJVcjS6VmqpfNBmmGHUyX5THG4x
assetWithProof => {
  leafOwner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  leafDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  merkleTree: 'GzdYevfnseXbGr7QdsGZwTe5VjrZjddGN2TehrFxuAxJ',
  root: Uint8Array(32) [
    230, 241, 235,  80, 138,  62,   8,  27,
    187,  41, 185,  26,  46, 118, 189,  44,
     46,   2,  11, 246, 101, 108, 127, 224,
    169,  73,  54,  19, 251,  30, 195,  35
  ],
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
  ],
  nonce: 0,
  index: 0,
  proof: [
    '11111111111111111111111111111111',
    'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
    'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
    '3HCYqQRcQSChEuAw1ybNYHibrTNNjzbYzm56cmEmivB6',
    'GSz87YKd3YoZWcEKhnjSsYJwv8o5aWGdBdGGYUphRfTh',
    'zLUDhASAn7WA1Aqc724azRpZjKCjMQNATApe74JMg8C',
    'ABnEXHmveD6iuMwfw2po7t6TPjn5kYMVwYJMi3fa9K91',
    'JDh7eiWiUWtiWn623iybHqjQ6AQ6c2Czz8m6ZxwSCkta',
    'BFvmeiEuzAYcMR8YxcuCMGYPDpjcmP5hsNbcswgQ8pMc',
    'EvxphsdRErrDMs9nhFfF4nzq8i1C2KSogA7uB96TPpPR',
    'HpMJWAzQv9HFgHBqY1o8V1B27sCYPFHJdGivDA658jEL',
    'HjnrJn5vBUUzpCxzjjM9ZnCPuXei2cXKJjX468B9yWD7',
    '4YCF1CSyTXm1Yi9W9JeYevawupkomdgy2dLxEBHL9euq',
    'E3oMtCuPEauftdZLX8EZ8YX7BbFzpBCVRYEiLxwPJLY2'
  ],
  metadata: {
    name: 'Dummy cNFT',
    symbol: '',
    uri: 'https://static.scannner.io/metadata/armor/95/95af08ab-a917-4684-8161-f2458d95b683.json',
    sellerFeeBasisPoints: 500,
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: { __option: 'None' },
    tokenStandard: { __option: 'Some', value: 0 },
    collection: { __option: 'Some', value: [Object] },
    uses: { __option: 'None' },
    tokenProgramVersion: 0,
    creators: [ [Object] ]
  },
  rpcAsset: {
    interface: 'V1_NFT',
    id: 'GyKSHxPxMpBPnvNUmcJVcjS6VmqpfNBmmGHUyX5THG4x',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://static.scannner.io/metadata/armor/95/95af08ab-a917-4684-8161-f2458d95b683.json',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: '2GDMeENBQgXEpsJrBp6yDtTTQc73CRYyyiTkoJweug6B',
      creator_hash: '5MhKaq3eEzsomVp5qU1EST7H9q8R9ndDxWuXeF6wbdgx',
      asset_hash: 'BjWGLcsi6roNVLikpJkRkSzuhkqVx4wLjp4cfue9JiGF',
      tree: 'GzdYevfnseXbGr7QdsGZwTe5VjrZjddGN2TehrFxuAxJ',
      seq: 1,
      leaf_id: 0
    },
    grouping: [ [Object] ],
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
    root: 'GYWj44wNfZmjpcxzCpby3ujbFUGT8qShXkvcmkALCUmQ',
    proof: [
      '11111111111111111111111111111111',
      'Cf5tmmFZ4D31tviuJezHdFLf5WF7yFvzfxNyftKsqTwr',
      'DAbAU9srHpEUogXWuhy5VZ7g8UX9STymELtndcx1xgP1',
      '3HCYqQRcQSChEuAw1ybNYHibrTNNjzbYzm56cmEmivB6',
      'GSz87YKd3YoZWcEKhnjSsYJwv8o5aWGdBdGGYUphRfTh',
      'zLUDhASAn7WA1Aqc724azRpZjKCjMQNATApe74JMg8C',
      'ABnEXHmveD6iuMwfw2po7t6TPjn5kYMVwYJMi3fa9K91',
      'JDh7eiWiUWtiWn623iybHqjQ6AQ6c2Czz8m6ZxwSCkta',
      'BFvmeiEuzAYcMR8YxcuCMGYPDpjcmP5hsNbcswgQ8pMc',
      'EvxphsdRErrDMs9nhFfF4nzq8i1C2KSogA7uB96TPpPR',
      'HpMJWAzQv9HFgHBqY1o8V1B27sCYPFHJdGivDA658jEL',
      'HjnrJn5vBUUzpCxzjjM9ZnCPuXei2cXKJjX468B9yWD7',
      '4YCF1CSyTXm1Yi9W9JeYevawupkomdgy2dLxEBHL9euq',
      'E3oMtCuPEauftdZLX8EZ8YX7BbFzpBCVRYEiLxwPJLY2'
    ],
    node_index: 16384,
    leaf: 'BjWGLcsi6roNVLikpJkRkSzuhkqVx4wLjp4cfue9JiGF',
    tree_id: 'GzdYevfnseXbGr7QdsGZwTe5VjrZjddGN2TehrFxuAxJ'
  }
}
currentLeafOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
newLeafOwner => 55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK
signature => 3486HV3oYSCNuN32VJsnC2xU2q5bbGd3Ywh8K7eUa4APEQxHL1PQksTMU4vVKYr3Q5bZ4chZskmSjpdzsSZ9H4iN
*/
