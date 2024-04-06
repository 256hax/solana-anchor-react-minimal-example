// Docs: https://developers.metaplex.com/token-metadata/fetch#fetch-by-mint-and-owner

// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  fetchAllDigitalAssetWithTokenByOwner,
} from '@metaplex-foundation/mpl-token-metadata';

const fetchAllByOwner = async () => {
  // -------------------------------------
  //  Setup
  // -------------------------------------
  dotenv.config();

  const endpoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endpoint);

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');
  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  // Register Library
  umi.use(mplTokenMetadata());

  // -------------------------------------
  //  Minting Tokens
  // -------------------------------------
  const owner = publicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');

  const assets = await fetchAllDigitalAssetWithTokenByOwner(umi, owner);

  console.log('owner =>', owner.toString());
  console.log('assets =>', assets);
};

fetchAllByOwner();

/*
% ts-node src/<THIS_FILE>

~~~ snip ~~~
  {
    publicKey: 'DLirp4Njaxx57RFTNQkf45qx2Ptu1znqoZdDq9ZNuoyp',
    mint: {
      publicKey: 'DLirp4Njaxx57RFTNQkf45qx2Ptu1znqoZdDq9ZNuoyp',
      header: [Object],
      mintAuthority: [Object],
      supply: 1n,
      decimals: 0,
      isInitialized: true,
      freezeAuthority: [Object]
    },
    metadata: {
      publicKey: 'HrVinS1yztKNBZxLW7x6xXWTPTo2ZMB2cEwKym8cBKxf',
      header: [Object],
      key: 4,
      updateAuthority: '5DAim553XDPjFAWFMc4Ydro9tQpjtGsrNHJNqDG4dU8W',
      mint: 'DLirp4Njaxx57RFTNQkf45qx2Ptu1znqoZdDq9ZNuoyp',
      name: 'My Collection NFT',
      symbol: '',
      uri: 'https://arweave.net/Mm2ttdiZyw7OXaQi9bxp0eoUioNgwr2RsjBtXwVjYrE',
      sellerFeeBasisPoints: 999,
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
      publicKey: 'B4Ea1Mhp8gbYnD4AG9w9dZMZBTQG9RZQjEw3Xd21h8ax',
      header: [Object],
      key: 6,
      supply: 0n,
      maxSupply: [Object]
    },
    token: {
      publicKey: 'AzjTaNW9vPqfKfYig2UWmc3bbszxV7xE8VpVii9zn2C4',
      header: [Object],
      mint: 'DLirp4Njaxx57RFTNQkf45qx2Ptu1znqoZdDq9ZNuoyp',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      amount: 1n,
      delegate: [Object],
      state: 1,
      isNative: [Object],
      delegatedAmount: 0n,
      closeAuthority: [Object]
    },
    tokenRecord: undefined
  },
  {
    publicKey: 'EnYFHvQHJp16HmeJ3fsP8XpNCJbNfgo9BLpNCaAkmvMp',
    mint: {
      publicKey: 'EnYFHvQHJp16HmeJ3fsP8XpNCJbNfgo9BLpNCaAkmvMp',
      header: [Object],
      mintAuthority: [Object],
      supply: 1n,
      decimals: 0,
      isInitialized: true,
      freezeAuthority: [Object]
    },
    metadata: {
      publicKey: '6YKczsmELUVeCbi21r6K8Yu5aDHLWtVNdxPqw3E3Toxh',
      header: [Object],
      key: 4,
      updateAuthority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      mint: 'EnYFHvQHJp16HmeJ3fsP8XpNCJbNfgo9BLpNCaAkmvMp',
      name: 'Character Samurai(39,996)',
      symbol: '',
      uri: 'https://arweave.net/lnODovDjfeKJUP-amtn7UIGKKwKcbZBYrZdNkcHP2H4',
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
      publicKey: 'Bem8o6JPAcGNnroEoEPNz5fXUy8PH6yacyTQzbMXbPjE',
      header: [Object],
      key: 6,
      supply: 0n,
      maxSupply: [Object]
    },
    token: {
      publicKey: 'DkiDTQ9FpxWTwe2XcBMmTtchDb4MYUrbG8qLzCwN1sES',
      header: [Object],
      mint: 'EnYFHvQHJp16HmeJ3fsP8XpNCJbNfgo9BLpNCaAkmvMp',
      owner: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
      amount: 1n,
      delegate: [Object],
      state: 1,
      isNative: [Object],
      delegatedAmount: 0n,
      closeAuthority: [Object]
    },
    tokenRecord: undefined
  },
  ... 1183 more items
]
*/
