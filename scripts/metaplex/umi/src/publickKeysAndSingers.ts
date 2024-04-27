// Lib
import * as bs58 from 'bs58';

// Metaplex
import {
  keypairIdentity,
  generateSigner,
  publicKey,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const main = () => {
  // Set Endpoint.
  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Create Keypair from UInt8Array of Secret Key.
  const payerSecretKey =
    '[42,10,22,97,116,115,107,57,226,247,40,179,216,11,216,9,110,233,110,240,85,78,144,173,253,79,75,12,175,216,43,214,245,164,74,111,54,131,150,17,113,31,4,20,159,81,221,64,109,212,188,82,203,134,242,13,210,177,22,8,166,44,126,233]';
  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  console.log('payerKeypair =>', payerKeypair);

  // Create Signer from Base58 of Secret Key.
  const payerSecretKeyBase58 = 'qkT6L2d7CY3TP1idkij8UNhzwcfQJfdjvU8NMu4FKHokkPrTeXfhooeeqUsQr5rL8rhZrcroMr4T2CFxanvezgQ'
  const payerKeypairBase58 =
    umi.eddsa.createKeypairFromSecretKey(bs58.decode(payerSecretKeyBase58));
  const payerSigner = createSignerFromKeypair(umi, payerKeypairBase58);

  console.log('payerSigner =>', payerSigner);
};

main();
