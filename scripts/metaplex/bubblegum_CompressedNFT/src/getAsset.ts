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
  //  Get an Asset
  // -------------------------------------
  const assetId = publicKey('9pk95RtqaXwSVwWwL9LDMBTQvPCBd6eWmVPyvTXoaFqH');
  const asset = await umi.rpc.getAsset(assetId);

  console.log('assetId =>', assetId);
  console.log('asset =>', asset);
};

getAsset();

/*
% ts-node src/<THIS_FILE>

assetId => 9pk95RtqaXwSVwWwL9LDMBTQvPCBd6eWmVPyvTXoaFqH
asset => {
  interface: 'V1_NFT',
  id: '9pk95RtqaXwSVwWwL9LDMBTQvPCBd6eWmVPyvTXoaFqH',
  content: {
    '$schema': 'https://schema.metaplex.com/nft1.0.json',
    json_uri: 'https://arweave.net/qFzHoX231iMuyFZxzzTYwklMBdKLvQqiP5aGVlseMzs',
    files: [],
    metadata: { name: 'BloodBuns', symbol: '' },
    links: {}
  },
  authorities: [
    {
      address: '5qa7bJeeUkytBNU7GbfTUbXJ53696LhytTnNpXZximvm',
      scopes: [Array]
    }
  ],
  compression: {
    eligible: false,
    compressed: true,
    data_hash: '8w2NHvX3Epjmx83ViBhBNEZgV9RmFfXUBKxeAcUQu6dN',
    creator_hash: 'B6UAGTTGqvPZEQAuc1rUMdi2ukR2Vj77jjcjF9RQFjw4',
    asset_hash: '31U584EuPS4urtQXHtD8fqCtS3MrY2yhJaVtSg5Gza4H',
    tree: 'DQpWLLs7Feakyij7hYJtTRf6XkheMy9b5KUHdYW1CvG4',
    seq: 76359,
    leaf_id: 73641
  },
  grouping: [
    {
      group_key: 'collection',
      group_value: 'DUCKGVmCjdK7czWnebui2rtuKkmqZEJyYSAtVvrZdcN'
    }
  ],
  royalty: {
    royalty_model: 'creators',
    target: null,
    percent: 0.081,
    basis_points: 810,
    primary_sale_happened: false,
    locked: false
  },
  creators: [
    {
      address: 'DUCKk2HvktNFDCJRiTKo4Rus4VjuSBT4sK4Pe7t4gxa9',
      share: 0,
      verified: true
    },
    {
      address: 'WoMbXFtdfH8crq2Zi7bQhfGx2Gv8EN4saP13gcdUGog',
      share: 18,
      verified: false
    },
    {
      address: 'GjVewZRPb6pTPdJxZxTmBXTea5Db2Kd9b3TuB5us45cB',
      share: 82,
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
