// Docs: https://developers.metaplex.com/bubblegum/delegate-cnfts

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi';
import {
  mplBubblegum,
  getAssetWithProof,
  delegate,
} from '@metaplex-foundation/mpl-bubblegum';

const revokingDelegateAuthority = async () => {
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
  //  Approving a Delegate Authority
  // ----------------------------------------------------
  const assetId = publicKey('HUotfePKvFWoCo7tYYv5YUkJZfif8sTbFNB2pn47Pt2u');
  let assetWithProof = await getAssetWithProof(umi, assetId);

  const leafOwner = createSignerFromKeypair(umi, payerKeypair);
  const currentDelegate = publicKey('55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK');
  const newDelegate = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');

  const result = await delegate(umi, {
    ...assetWithProof,
    leafOwner,
    previousLeafDelegate: currentDelegate,
    newLeafDelegate: newDelegate,
  }).sendAndConfirm(umi);

  console.log('assetId =>', assetId);
  console.log('assetWithProof =>', assetWithProof);
  console.log('leafOwner =>', leafOwner.publicKey);
  console.log('newDelegate =>', newDelegate);
  console.log('signature =>', bs58.encode(result.signature));

  console.log('\n--- After delegate ---------------------------------------------------');
  assetWithProof = await getAssetWithProof(umi, assetId);
  console.log('assetWithProof =>', assetWithProof);
};

revokingDelegateAuthority();

/*
ts-node src/revokingDelegateAuthority.ts
assetId => HUotfePKvFWoCo7tYYv5YUkJZfif8sTbFNB2pn47Pt2u
assetWithProof => {
  leafOwner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  leafDelegate: '55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK',
  merkleTree: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL',
  root: Uint8Array(32) [
    204, 226, 154, 125, 175,  63, 154,
    151, 209, 235,  84,   1, 156,  21,
    178, 228, 236, 168, 108, 230, 218,
     28, 123, 203, 181, 160, 184,  69,
    135,  99,  51, 245
  ],
  dataHash: Uint8Array(32) [
    161,   4, 124, 110,  12, 158, 193,  78,
     94, 243,  10,  56,  40, 238, 168, 203,
    171,  56, 102, 124, 251,  13,  14, 222,
      8, 183, 240,  21,  30, 222, 212,  79
  ],
  creatorHash: Uint8Array(32) [
    190, 134, 186,  50,  46, 133,  58,  80,
     86, 130, 231,  22,  73,  87, 143, 160,
     13, 194,  59, 166, 221, 219, 125, 116,
    249,  63, 207, 151,  40, 177, 201, 129
  ],
  nonce: 0,
  index: 0,
  proof: [
    '8AkzxWKewpgs3rRUTQAMDnkW69kii2amALixucU7VEYV',
    '3SmAN81z1vAMZvWdF19jj7WgXGC3JDCXwSFWKjbh8KGt',
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
    name: 'NFT Name',
    symbol: 'SSNC',
    uri: 'https://supersweetcollection.notarealurl/token.json',
    sellerFeeBasisPoints: 0,
    primarySaleHappened: false,
    isMutable: false,
    editionNonce: { __option: 'Some', value: 0 },
    tokenStandard: { __option: 'Some', value: 0 },
    collection: { __option: 'Some', value: [Object] },
    uses: { __option: 'None' },
    tokenProgramVersion: 0,
    creators: [ [Object], [Object] ]
  },
  rpcAsset: {
    interface: 'V1_NFT',
    id: 'HUotfePKvFWoCo7tYYv5YUkJZfif8sTbFNB2pn47Pt2u',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://supersweetcollection.notarealurl/token.json',
      files: [],
      metadata: [Object],
      links: {}
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: 'BqYcCNZ2vVPk3YMQT91qTRMBukPfu6HsH8iApXxCuuu8',
      creator_hash: 'DpjcjaovBVdccnWMicifk59uPh3so9BgFrVpLh3vS744',
      asset_hash: '63C6gKb37EXWgLQKk9nTb8TsHyGhL4BfoTT9mpvPU4H9',
      tree: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL',
      seq: 4,
      leaf_id: 0
    },
    grouping: [ [Object] ],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0,
      basis_points: 0,
      primary_sale_happened: false,
      locked: false
    },
    creators: [ [Object], [Object] ],
    ownership: {
      frozen: false,
      delegated: true,
      delegate: '55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK',
      ownership_model: 'single',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 0 },
    mutable: false,
    burnt: false
  },
  rpcAssetProof: {
    root: 'EnnacosKEtQZtXBJLT7R3av3tZu7sqRXW6y2v94S68Ax',
    proof: [
      '8AkzxWKewpgs3rRUTQAMDnkW69kii2amALixucU7VEYV',
      '3SmAN81z1vAMZvWdF19jj7WgXGC3JDCXwSFWKjbh8KGt',
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
    leaf: '63C6gKb37EXWgLQKk9nTb8TsHyGhL4BfoTT9mpvPU4H9',
    tree_id: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL'
  }
}
leafOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
newDelegate => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
signature => 5kPj8mbsc3hhRB879FZeZyXbi38DUs5wyUe62DZFAAMNRmKShDk1m3vJSaBmi3LxJkNMMiYJGjzrUR7cUxD6TKh

--- After delegate ---------------------------------------------------
assetWithProof => {
  leafOwner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  leafDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  merkleTree: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL',
  root: Uint8Array(32) [
    246, 211,  64, 24, 122,  41,  19, 188,
    137,  56,  59, 12,  93, 225, 159,  16,
    165,  27,  42, 11,  66,  72,  39,  26,
     75, 104, 130, 31,  38,  21,  87,  78
  ],
  dataHash: Uint8Array(32) [
    161,   4, 124, 110,  12, 158, 193,  78,
     94, 243,  10,  56,  40, 238, 168, 203,
    171,  56, 102, 124, 251,  13,  14, 222,
      8, 183, 240,  21,  30, 222, 212,  79
  ],
  creatorHash: Uint8Array(32) [
    190, 134, 186,  50,  46, 133,  58,  80,
     86, 130, 231,  22,  73,  87, 143, 160,
     13, 194,  59, 166, 221, 219, 125, 116,
    249,  63, 207, 151,  40, 177, 201, 129
  ],
  nonce: 0,
  index: 0,
  proof: [
    '8AkzxWKewpgs3rRUTQAMDnkW69kii2amALixucU7VEYV',
    '3SmAN81z1vAMZvWdF19jj7WgXGC3JDCXwSFWKjbh8KGt',
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
    name: 'NFT Name',
    symbol: 'SSNC',
    uri: 'https://supersweetcollection.notarealurl/token.json',
    sellerFeeBasisPoints: 0,
    primarySaleHappened: false,
    isMutable: false,
    editionNonce: { __option: 'Some', value: 0 },
    tokenStandard: { __option: 'Some', value: 0 },
    collection: { __option: 'Some', value: [Object] },
    uses: { __option: 'None' },
    tokenProgramVersion: 0,
    creators: [ [Object], [Object] ]
  },
  rpcAsset: {
    interface: 'V1_NFT',
    id: 'HUotfePKvFWoCo7tYYv5YUkJZfif8sTbFNB2pn47Pt2u',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://supersweetcollection.notarealurl/token.json',
      files: [],
      metadata: [Object],
      links: {}
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: 'BqYcCNZ2vVPk3YMQT91qTRMBukPfu6HsH8iApXxCuuu8',
      creator_hash: 'DpjcjaovBVdccnWMicifk59uPh3so9BgFrVpLh3vS744',
      asset_hash: 'Ffpf9hs1nNbge3jK859wqrvWSXYWYZT1UD1y8Hm4kfvy',
      tree: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL',
      seq: 5,
      leaf_id: 0
    },
    grouping: [ [Object] ],
    royalty: {
      royalty_model: 'creators',
      target: null,
      percent: 0,
      basis_points: 0,
      primary_sale_happened: false,
      locked: false
    },
    creators: [ [Object], [Object] ],
    ownership: {
      frozen: false,
      delegated: false,
      delegate: null,
      ownership_model: 'single',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
    },
    supply: { print_max_supply: 0, print_current_supply: 0, edition_nonce: 0 },
    mutable: false,
    burnt: false
  },
  rpcAssetProof: {
    root: 'HcW8DzJ9Pu4v2WaVhozqTrZQRs2gxxVB3vhXLU9sBcih',
    proof: [
      '8AkzxWKewpgs3rRUTQAMDnkW69kii2amALixucU7VEYV',
      '3SmAN81z1vAMZvWdF19jj7WgXGC3JDCXwSFWKjbh8KGt',
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
    leaf: 'Ffpf9hs1nNbge3jK859wqrvWSXYWYZT1UD1y8Hm4kfvy',
    tree_id: 'A3gAZ69UL6TExXL5GXzmLqV8H85wiDLUEn3GJAUH9fyL'
  }
}
*/
