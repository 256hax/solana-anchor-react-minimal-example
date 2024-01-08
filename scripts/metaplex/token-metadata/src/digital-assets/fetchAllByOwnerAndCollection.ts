// Docs: https://developers.metaplex.com/token-metadata/fetch#fetch-all-by-owner

// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  fetchAllDigitalAssetByOwner,
} from '@metaplex-foundation/mpl-token-metadata';

const fetchAllByOwnerAndCollection = async () => {
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
  //  Fetch All By Owner
  // -------------------------------------
  const owner = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');

  const assets = await fetchAllDigitalAssetByOwner(umi, owner);

  // -------------------------------------
  //  Filtering Collection for Standard NFT
  // -------------------------------------
  const collectionMint = '76692Y4kfkXWs8DSL4A1u38t13hezVt79b3WZYWKXXu6';

  assets.map((a: any) => {
    if(a.metadata.collection.value?.key === collectionMint) {
      console.log('Owner has collection =>');
      console.log('Mint Address =>', a.mint.publicKey.toString());
      console.log('Collection =>', a.metadata.collection);
    }
  });
};

fetchAllByOwnerAndCollection();

/*
% ts-node src/<THIS_FILE>

~~~ snip ~~~
 {
    publicKey: '8SLmz4wc2yaB1AS6MTRSFQhMReSC36DakH4PcKNGDiRe',
    mint: {
      publicKey: '8SLmz4wc2yaB1AS6MTRSFQhMReSC36DakH4PcKNGDiRe',
      header: [Object],
      mintAuthority: [Object],
      supply: 1n,
      decimals: 0,
      isInitialized: true,
      freezeAuthority: [Object]
    },
    metadata: {
      publicKey: '4S4RusHzxBB3XLaTYTSfyfufn5YWArTYGoEBFxAkddFM',
      header: [Object],
      key: 4,
      updateAuthority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      mint: '8SLmz4wc2yaB1AS6MTRSFQhMReSC36DakH4PcKNGDiRe',
      name: 'Collection KUMA NFT',
      symbol: 'K',
      uri: 'https://arweave.net/PKhQIsUSWE_9fYol_uWDSm2DroKWUAtlH_bJAP5mVXc',
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
      publicKey: 'GxDZbMewww7offF1F7CHM8pVL9aAuwcm1CVZts3bFoyD',
      header: [Object],
      key: 6,
      supply: 0n,
      maxSupply: [Object]
    }
  },
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
Owner has collection =>
Mint Address => 5M584kS4SUepVNAijLioMi6ZxpYeY814nCAZYDxCTTKk
Collection => {
  __option: 'Some',
  value: {
    verified: true,
    key: '76692Y4kfkXWs8DSL4A1u38t13hezVt79b3WZYWKXXu6'
  }
}
Owner has collection =>
Mint Address => 7wSgkn2TazD9RVSxcvdTv3PeFVx4g3gDsiYJrLgoHpvW
Collection => {
  __option: 'Some',
  value: {
    verified: true,
    key: '76692Y4kfkXWs8DSL4A1u38t13hezVt79b3WZYWKXXu6'
  }
}
*/
