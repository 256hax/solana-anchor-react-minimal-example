// Docs: https://developers.metaplex.com/bubblegum/mint-cnfts#minting-without-a-collection

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, none, publicKey } from '@metaplex-foundation/umi';
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum';

const mintWithoutCollection = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  //  Minting without a Collection
  // ----------------------------------------------------
  // Replace to your Merkle Tree.
  const merkleTree = publicKey('81WgE6NEKLT71YQpySphUE59oicJX3QRmRNZmijNvmzq');

  const result = await mintV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    metadata: {
      name: 'cNFT w/o Collection #2',
      uri: 'https://arweave.net/fuyXdgQul3e-0COSO2XUgTv9JbUIDvF-as86TWHtlgM',
      sellerFeeBasisPoints: 500, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 },
      ],
    },
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('leafOwner =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('signature =>', bs58.encode(result.signature));
};

mintWithoutCollection();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
leafOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT
signature => GRWaP7NutXcrnH9QZwZT5XP5ksU3jUs2pRaREbjx1SFoxMtgPZLkq4SF58MFEmrePaTD1koofhcLJNKbcmSgKjF
*/