// Docs: https://developers.metaplex.com/bubblegum/mint-cnfts#minting-to-a-collection

// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum';

const mintToCollection = async () => {
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
  // Replace to your Merkle Tree.
  const merkleTree = publicKey('B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT');
  // Replace to your Collection NFT.
  const collectionMint = publicKey(
    'CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx'
  );
  const collectionUpdateAuthority = createSignerFromKeypair(umi, payerKeypair);

  const result = await mintToCollectionV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    collectionMint,
    collectionAuthority: collectionUpdateAuthority,
    metadata: {
      name: 'cNFT in a Collection',
      uri: 'https://nftstorage.link/ipfs/bafkreidk3rfovtx4uehivgp7tmruoiaqkypproymlfzzpgeyayqcbfakma',
      sellerFeeBasisPoints: 500, // 5%
      collection: { key: collectionMint, verified: false },
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('leafOwner =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('collectionMint =>', collectionMint.toString());
  console.log('signature =>', bs58.encode(result.signature));
};

mintToCollection();

/*
% ts-node src/<THIS_FILE>

payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
leafOwner => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
merkleTree => B9bq2sirvRtgDfZdaTqPso3h6ghfWjXfx77CHdWKHEqT
collectionMint => CNKbk92ugTzDnqZNNttXGWbNmCmHptxctz8BuJYYp9Tx
signature => rYvxSB7hke1pbux1d3SB6RisicL9rTdqNdKyonbDJyqBAYXdMBiWcuQcNqUhW2PaZrtK2AJNk9cEKZgLimKpRDt
*/
