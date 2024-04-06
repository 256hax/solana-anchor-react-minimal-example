// Docs: https://developers.metaplex.com/token-metadata/mint#creating-accounts

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  keypairIdentity,
  generateSigner,
  percentAmount,
} from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';

const createAccounts = async () => {
  // -------------------------------------
  //  Setup
  // -------------------------------------
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
  umi.use(mplTokenMetadata());

  // -------------------------------------
  //  Creating Accounts
  // -------------------------------------
  // If you need to upload JSON Metadata, use "umi.uploader.uploadJson".
  const mint = generateSigner(umi);
  const authority = createSignerFromKeypair(umi, payerKeypair);

  const createResult = await createV1(umi, {
    mint,
    authority,
    name: 'My NFT',
    uri: 'https://arweave.net/3zvlWQiRX3cIPy9Jvy37tESwvZEFDkJEOHV6zzF8qnk',
    sellerFeeBasisPoints: percentAmount(5.5),
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi)

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('mint =>', mint.publicKey.toString());
  console.log('authority =>', authority.publicKey.toString());
  console.log('signature =>', bs58.encode(createResult.signature));
};

createAccounts();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
mint => 3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf
authority => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
signature => X5jqzdsUwGgDngn1ULnaS4WbQ7BJwZSG5KeoyHfK8XbVbWK1Azn22krJMAAKbXWxKokGovLkkjJAgx3RRVaKRZ5
*/