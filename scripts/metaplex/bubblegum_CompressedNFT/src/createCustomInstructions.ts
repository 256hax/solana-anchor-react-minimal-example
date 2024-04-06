// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  createSignerFromKeypair,
  publicKey,
  transactionBuilder,
  WrappedInstruction,
  TransactionBuilderItemsInput,
} from '@metaplex-foundation/umi';
import {
  mplBubblegum,
  getAssetWithProof,
  transfer,
} from '@metaplex-foundation/mpl-bubblegum';
// import { transferSol, addMemo } from '@metaplex-foundation/mpl-toolbox';

const createCustomInstructions = async () => {
  // ----------------------------------------------------
  //  Setup Enviornment
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
  //  Prepare Addresses
  // ----------------------------------------------------
  const assetId = publicKey('FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz');
  const assetWithProof = await getAssetWithProof(umi, assetId);
  const currentLeafOwner = publicKey(
    'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'
  );
  const newLeafOwner = publicKey(
    '55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK'
  );

  // Generate a new random keypair.
  const referenceKeypair = umi.eddsa.generateKeypair();
  const referenceSigner = createSignerFromKeypair(umi, referenceKeypair);

  // ----------------------------------------------------
  //  Create Custom Instructions
  // ----------------------------------------------------

  // @metaplex-foundation/mpl-toolbox has addMemo function.
  // e.g.
  //    const memoInstruction = addMemo(umi, { memo: 'Hello world!' });
  const memoInstruction: WrappedInstruction = {
    bytesCreatedOnChain: 300,
    instruction: {
      keys: [
        {
          pubkey: publicKey(referenceKeypair.publicKey),
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from('Hello world!', 'utf-8'),
      programId: publicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    },
    signers: [umi.payer, referenceSigner],
  };

  const transferInstruction: TransactionBuilderItemsInput = transfer(umi, {
    ...assetWithProof,
    leafOwner: currentLeafOwner,
    newLeafOwner: newLeafOwner,
  });

  let builder = transactionBuilder()
    .add(memoInstruction)
    .add(transferInstruction);

  // ----------------------------------------------------
  //  Run Transaction
  // ----------------------------------------------------
  const result = await builder.sendAndConfirm(umi);

  console.log('%o', builder);
  console.log('referenceKeypair.publicKey =>', referenceKeypair.publicKey);
  console.log('-------------------------------------------');
  console.log('assetId =>', assetId);
  console.log('assetWithProof =>', assetWithProof);
  console.log('currentLeafOwner =>', currentLeafOwner);
  console.log('newLeafOwner =>', newLeafOwner);
  console.log('signature =>', bs58.encode(result.signature));
};

createCustomInstructions();

/*
ts-node src/createCustomInstructions.ts
TransactionBuilder {
  items: [
    {
      bytesCreatedOnChain: 300,
      instruction: {
        keys: [ [Object], [length]: 1 ],
        data: <Buffer 48 65 6c 6c 6f 20 77 6f 72 6c 64 21>,
        programId: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
      },
      signers: [
        {
          publicKey: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
          secretKey: [Uint8Array],
          signMessage: [AsyncFunction],
          signTransaction: [AsyncFunction],
          signAllTransactions: [AsyncFunction]
        },
        {
          publicKey: 'CMgRpE51ybhExUxe11Y5CpgaCPTw79QFYaJsPhbfFiPG',
          secretKey: [Uint8Array],
          signMessage: [AsyncFunction],
          signTransaction: [AsyncFunction],
          signAllTransactions: [AsyncFunction]
        },
        [length]: 2
      ]
    },
    {
      instruction: {
        keys: [
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [Object],
          [Object], [length]: 11
        ],
        programId: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
        data: Uint8Array(116) [
          163,
          52,
          200,
          231,
          140,
          3,
          69,
          186,
          188,
          59,
          57,
          58,
          60,
          212,
          238,
          183,
          222,
          2,
          166,
          77,
          37,
          62,
          96,
          253,
          94,
          221,
          119,
          219,
          192,
          100,
          154,
          95,
          35,
          16,
          220,
          189,
          31,
          13,
          4,
          103,
          142,
          247,
          206,
          15,
          239,
          168,
          181,
          129,
          184,
          161,
          228,
          36,
          51,
          144,
          233,
          237,
          51,
          103,
          55,
          4,
          93,
          89,
          137,
          92,
          112,
          127,
          109,
          167,
          124,
          116,
          83,
          137,
          246,
          203,
          247,
          167,
          122,
          253,
          78,
          161,
          245,
          117,
          112,
          177,
          231,
          175,
          225,
          71,
          197,
          19,
          82,
          76,
          153,
          203,
          245,
          172,
          250,
          159,
          220,
          225,
          ... 16 more items,
          [BYTES_PER_ELEMENT]: 1,
          [length]: 116,
          [byteLength]: 116,
          [byteOffset]: 0,
          [buffer]: ArrayBuffer { byteLength: 116 }
        ]
      },
      signers: [ [length]: 0 ],
      bytesCreatedOnChain: 0
    },
    [length]: 2
  ],
  options: {}
}
referenceKeypair.publicKey => CMgRpE51ybhExUxe11Y5CpgaCPTw79QFYaJsPhbfFiPG
-------------------------------------------
assetId => FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz
assetWithProof => {
  leafOwner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  leafDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  merkleTree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
  root: Uint8Array(32) [
    188,  59,  57,  58,  60, 212, 238, 183,
    222,   2, 166,  77,  37,  62,  96, 253,
     94, 221, 119, 219, 192, 100, 154,  95,
     35,  16, 220, 189,  31,  13,   4, 103
  ],
  dataHash: Uint8Array(32) [
    142, 247, 206,  15, 239, 168, 181, 129,
    184, 161, 228,  36,  51, 144, 233, 237,
     51, 103,  55,   4,  93,  89, 137,  92,
    112, 127, 109, 167, 124, 116,  83, 137
  ],
  creatorHash: Uint8Array(32) [
    246, 203, 247, 167, 122, 253,  78,
    161, 245, 117, 112, 177, 231, 175,
    225,  71, 197,  19,  82,  76, 153,
    203, 245, 172, 250, 159, 220, 225,
     82, 161, 115,  73
  ],
  nonce: 7,
  index: 7,
  proof: [
    '7rBEim3X2HsjcBpKzWK5vqVzkRKA4XkhbGchm7JHNXXb',
    'HUFPNtYoM3b8r1ty54S8BRmFMCbkni4oyDqH1sQuHwhZ',
    'AXmXpUFx1SsEEYTJT1FvihogRxzHALVhQsdXAoHLherw'
  ],
  metadata: {
    name: 'cNFT in a Collection',
    symbol: '',
    uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
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
    id: 'FWiZYQHfASrwZ2YeActdVi4VPX8KM8mAeuKg7VcMUcTz',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    authorities: [ [Object] ],
    compression: {
      eligible: false,
      compressed: true,
      data_hash: 'Ad645MeFx94jeh8xAdp7u8bnRfHa9RGaZZrWK5j5qcCY',
      creator_hash: 'HcPge8XiNdMdQe3Z2kCVtTQD8S81NfXK9mJMu9B5kGqN',
      asset_hash: '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
      tree: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT',
      seq: 8,
      leaf_id: 7
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
    root: 'Dfn2SNMN1jfVTDpXrgY3QhQvst1G3ZyPupbvimqt4BHx',
    proof: [
      '7rBEim3X2HsjcBpKzWK5vqVzkRKA4XkhbGchm7JHNXXb',
      'HUFPNtYoM3b8r1ty54S8BRmFMCbkni4oyDqH1sQuHwhZ',
      'AXmXpUFx1SsEEYTJT1FvihogRxzHALVhQsdXAoHLherw'
    ],
    node_index: 15,
    leaf: '2wjrJV3TYCbtwKDC1JaVf1PEnsfKK362k6Zsso7re6tM',
    tree_id: 'B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT'
  }
}
currentLeafOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
newLeafOwner => 55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK
signature => 4B4bYvMMHKa9PUBSk2ViLJcCDNwM4oVPXgzjK8q5MJXF2iH8URcev3bHaqnqUQn1EwzSjTUjKeHG8vhZy6ecuh46
*/
