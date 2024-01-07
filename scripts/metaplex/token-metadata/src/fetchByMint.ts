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
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';

const fetchByMint = async () => {
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
  const mint = publicKey('3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf');

  const asset = await fetchDigitalAsset(umi, mint)

  console.log('mint =>', mint.toString());
  console.log('asset =>', asset);
};

fetchByMint();

/*
% ts-node src/<THIS_FILE>

mint => 3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf
asset => {
  publicKey: '3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf',
  mint: {
    publicKey: '3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf',
    header: {
      executable: false,
      owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      lamports: [Object],
      rentEpoch: 18446744073709552000,
      exists: true
    },
    mintAuthority: {
      __option: 'Some',
      value: 'FUDMnjvN1mdzMEnu2Pqw7yEjtvL4nSmrGuCHRUg9PbwN'
    },
    supply: 1n,
    decimals: 0,
    isInitialized: true,
    freezeAuthority: {
      __option: 'Some',
      value: 'FUDMnjvN1mdzMEnu2Pqw7yEjtvL4nSmrGuCHRUg9PbwN'
    }
  },
  metadata: {
    publicKey: '42GYPHk6TueXCPeTvMZv7c3iW14tS3dtJsqb8RLbCxsL',
    header: {
      executable: false,
      owner: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
      lamports: [Object],
      rentEpoch: 18446744073709552000,
      exists: true
    },
    key: 4,
    updateAuthority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    mint: '3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf',
    name: 'My NFT',
    symbol: '',
    uri: 'https://arweave.net/3zvlWQiRX3cIPy9Jvy37tESwvZEFDkJEOHV6zzF8qnk',
    sellerFeeBasisPoints: 550,
    creators: { __option: 'Some', value: [Array] },
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: { __option: 'Some', value: 254 },
    tokenStandard: { __option: 'Some', value: 0 },
    collection: { __option: 'None' },
    uses: { __option: 'None' },
    collectionDetails: { __option: 'None' },
    programmableConfig: { __option: 'None' }
  },
  edition: {
    isOriginal: true,
    publicKey: 'FUDMnjvN1mdzMEnu2Pqw7yEjtvL4nSmrGuCHRUg9PbwN',
    header: {
      executable: false,
      owner: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
      lamports: [Object],
      rentEpoch: 18446744073709552000,
      exists: true
    },
    key: 6,
    supply: 0n,
    maxSupply: { __option: 'Some', value: 0n }
  }
}
*/