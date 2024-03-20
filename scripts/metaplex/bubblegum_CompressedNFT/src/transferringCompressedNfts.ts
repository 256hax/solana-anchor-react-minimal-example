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

  // Public RPC unavailbale DAS on Devnet. Use following RPC:
  //  https://developers.metaplex.com/bubblegum/rpcs
  const endpoint = process.env.HELIUS_API_WITH_URL;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint).use(mplBubblegum());

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');

  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

  umi.use(keypairIdentity(payerKeypair));

  // ----------------------------------------------------
  //  Transferring cNFT
  // ----------------------------------------------------
  const assetId = publicKey('Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq');
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
% ts-node src/<THIS_FILE>

assetId => Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq
assetWithProof => {
  leafOwner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  leafDelegate: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  merkleTree: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
  root: Uint8Array(32) [
    36, 196, 207, 227,  73, 115, 189, 188,
    43, 224, 123, 198, 214,  47, 133, 125,
    25, 123, 189, 252, 244,  50,   0, 206,
    72,  89, 212, 200,  72, 133, 244, 125
  ],
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
  ],
  nonce: 0,
  index: 0,
  proof: [
    '7YvGQcxWnF8hjrCC1caXGK21SC1GTeMAC99rgJBv8Nqc',
    'EJ4F8NVDyAr3xFQqemSUD59gvBZnYNybxUTSEZCRi8Ae',
    '5Z63Yf8nEwmTq36JjuQFncNsHpgsX4QYBwS2jbNULW6N'
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
    id: 'Hu8CCpYg6nWg6maFyKB9Sdgzqdvm6W7EU5142FSTqKPq',
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
      data_hash: 'HnnZFpKwwVHAgtTZkvoqvg4f9KK4ecLQJtmD7yHoU9fo',
      creator_hash: '5MhKaq3eEzsomVp5qU1EST7H9q8R9ndDxWuXeF6wbdgx',
      asset_hash: 'CGs9Sk4LVppJADWjUnHRiNFAH7nQ7NimZwesijkD1Aze',
      tree: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui',
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
    root: '3UXjr197UnuFBsPowPDhbkTZM9giwGYLCmPnx9PDLHKr',
    proof: [
      '7YvGQcxWnF8hjrCC1caXGK21SC1GTeMAC99rgJBv8Nqc',
      'EJ4F8NVDyAr3xFQqemSUD59gvBZnYNybxUTSEZCRi8Ae',
      '5Z63Yf8nEwmTq36JjuQFncNsHpgsX4QYBwS2jbNULW6N'
    ],
    node_index: 8,
    leaf: 'CGs9Sk4LVppJADWjUnHRiNFAH7nQ7NimZwesijkD1Aze',
    tree_id: 'D6cTtVWBFapNQxW4tu4FGbXBz2Bycqyya8gtj8KJqMui'
  }
}
currentLeafOwner => 55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK
newLeafOwner => 55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK
signature => 2UbV4yeBc1vr1yvo7UDrcEXv5w8PEn5Zea4FTgiZAK7ArNBtpgfT6gqbk1VsEumbZhzFGhNcEGx4w4wDSpNhfhf3
*/
