// Docs: https://developers.metaplex.com/bubblegum/mint-cnfts#minting-without-a-collection

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, none, publicKey } from '@metaplex-foundation/umi';
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum';

const mintWithoutCollection = async () => {
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
  // Replace to your Merkle Tree.
  const merkleTree = publicKey('B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT');

  const result = await mintV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    metadata: {
      name: 'My Compressed NFT',
      uri: 'https://madlads.s3.us-west-2.amazonaws.com/json/5057.json',
      sellerFeeBasisPoints: 500, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('signature =>', bs58.encode(result.signature));
};

mintWithoutCollection();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT
signature => 3kLJpUnWGuWeNVmQu3NzZGYJt78sETk9pvymSM5gMMq1wna7MKxoWVEwqLtB76N1eP121D1JQxR53yCPwD9wkSe5
*/
