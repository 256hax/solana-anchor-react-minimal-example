// Docs:
//  https://github.com/metaplex-foundation/umi/blob/main/docs/storage.md
//  https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard

// Lib
import * as dotenv from 'dotenv';
import fs from 'fs';

// Metaplex
import { keypairIdentity, createGenericFile } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

const upload = async () => {
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
  //  Upload JSON Metadata
  // ----------------------------------------------------
  umi.use(irysUploader());

  const fileBuffer = fs.readFileSync('./src/assets/nft-image.png');
  const file = createGenericFile(fileBuffer, 'nft-image.png', {
    contentType: 'image/png',
  });

  const uploadPrice = await umi.uploader.getUploadPrice([file]);
  const [fileUri] = await umi.uploader.upload([file]);

  const uri = await umi.uploader.uploadJson({
    name: 'My NFT #2',
    description: 'My description',
    // image: 'https://placekitten.com/100/200',
    image: fileUri,
    external_url: 'https://example.com/',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
  });

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('uploadPrice =>', uploadPrice);
  console.log('uri =>', uri);
};

upload();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
uploadPrice => { basisPoints: 545453n, identifier: 'SOL', decimals: 9 }
uri => https://arweave.net/rfss5Ug1MWQySOk9gWG0D9LlvROZjQ9_NCyMWKEDm2w
*/
