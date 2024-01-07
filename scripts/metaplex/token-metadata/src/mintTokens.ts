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
  publicKey,
} from '@metaplex-foundation/umi';
import {
  mplTokenMetadata,
  mintV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';

const mintTokens = async () => {
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
  const authority = createSignerFromKeypair(umi, payerKeypair);
  const tokenOwner = payerKeypair.publicKey;

  const createResult = await mintV1(umi, {
    mint,
    authority,
    amount: 1,
    tokenOwner,
    tokenStandard: TokenStandard.NonFungible,
  }).sendAndConfirm(umi)

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('mint =>', mint.toString());
  console.log('authority =>', authority.publicKey.toString());
  console.log('tokenOwner =>', tokenOwner.toString());
  console.log('signature =>', bs58.encode(createResult.signature));
};

mintTokens();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
mint => 3J1P7DqxfKJWiCQacVJZBeN6jwQMvjoY4DJxFvY2RSWf
authority => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
tokenOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
signature => 2Y71wwKMEgGeVEvzGenLWvwbNXMXJecU6SRjmpcb3pUTyc4QJ1kPuFJj6cFYbFuX2jrmaY2p4HtKWnpqeY7BQLPp
*/