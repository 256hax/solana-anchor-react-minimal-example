// Docs: https://developers.metaplex.com/token-metadata/mint#creating-accounts

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  fetchAllDigitalAssetByOwner
} from '@metaplex-foundation/mpl-token-metadata';

const fetchAllByOwner = async () => {
  // -------------------------------------
  //  Setup
  // -------------------------------------
  dotenv.config();

  const endpoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endpoint).use(mplTokenMetadata());

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');

  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

  umi.use(keypairIdentity(payerKeypair));

  // -------------------------------------
  //  Minting Tokens
  // -------------------------------------
  const owner = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');

  const assets = await fetchAllDigitalAssetByOwner(umi, owner)

  console.log('owner =>', owner.toString());
  console.log('assets =>', assets);

  // -------------------------------------
  //  Search
  // -------------------------------------
  const filteringMint = '3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf';

  assets.map((a: any) => {
    if(a.mint.publicKey.toString() === filteringMint) {
      console.log('Owner has', filteringMint);
    }
  });
};

fetchAllByOwner();

/*
% ts-node src/<THIS_FILE>

~~~ snip ~~~
 {
    publicKey: 'CRMiNXjxkqtew3au63KPrkbQHYhyqjCw7KwiCKyBAhux',
    mint: {
      publicKey: 'CRMiNXjxkqtew3au63KPrkbQHYhyqjCw7KwiCKyBAhux',
      header: [Object],
      mintAuthority: [Object],
      supply: 1n,
      decimals: 0,
      isInitialized: true,
      freezeAuthority: [Object]
    },
    metadata: {
      publicKey: '9KfCee6kjRiJ7KwRRRZwQgSt1MjqhVWHaWGt41fxpiDf',
      header: [Object],
      key: 4,
      updateAuthority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      mint: 'CRMiNXjxkqtew3au63KPrkbQHYhyqjCw7KwiCKyBAhux',
      name: 'test',
      symbol: 't',
      uri: 'https://arweave.net/y-vOi_0Z4CTIJmaIPsLLi4tjvVKAnCsM1SdDfk3on-Y',
      sellerFeeBasisPoints: 500,
      creators: [Object],
      primarySaleHappened: false,
      isMutable: true,
      editionNonce: [Object],
      tokenStandard: [Object],
      collection: [Object],
      uses: [Object],
      collectionDetails: [Object],
      programmableConfig: [Object]
    },
    edition: {
      isOriginal: true,
      publicKey: '8kakLEZNPY8ynuFtdT2uQTnhZLJSnoHqk7QAa5gxdJfb',
      header: [Object],
      key: 6,
      supply: 0n,
      maxSupply: [Object]
    }
  },
  ... 1183 more items
]
Owner has 3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf
*/