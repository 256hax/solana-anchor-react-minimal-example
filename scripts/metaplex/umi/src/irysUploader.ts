// Lib
import * as dotenv from 'dotenv';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { keypairIdentity } from '@metaplex-foundation/umi';

const mintWithoutCollection = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  //  Minting without a Collection
  // ----------------------------------------------------
  // Docs: https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
  umi.use(irysUploader());
  const uri = await umi.uploader.uploadJson({
    name: 'My NFT #1',
    description: 'My description',
    image: 'https://placekitten.com/100/200',
  });

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('uri =>', uri);
};

mintWithoutCollection();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
leafOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT
signature => ULhLEDaE1N3o46KzVEpCvzahbWD3uXuoiEWUe7N7shm1e9NCgyfojTCCNWcqAa6k9sUhJa558nRWX6WeHYEriz5
*/