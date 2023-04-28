// Ref: https://docs.metaplex.com/programs/candy-machine/managing-candy-machines
import * as fs from 'fs';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create } from "@metaplex-foundation/mpl-candy-machine";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  some,
  base58PublicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";

const main = async () => {
  const endopoint = 'https://api.devnet.solana.com';
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));

  const umi = createUmi(endopoint, 'confirmed')
    .use(mplCandyMachine());

  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#keypairs
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(myKeypair));

  // If build frontend using Wallet Adapter, use following.
  // 
  // import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
  // const wallet = useWallet();
  // const umi = createUmi(endpoint)
  //   .use(walletAdapterIdentity(wallet))
  //   .use(mplCandyMachine())

  // Create the Collection NFT.
  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "My Collection NFT",
    uri: "https://example.com/path/to/some/json/metadata.json",
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);

  // Create the Candy Machine.
  const candyMachine = generateSigner(umi);
  const createInstructions = await create(umi, {
    candyMachine,
    collectionMint: collectionMint.publicKey,
    collectionUpdateAuthority,
    tokenStandard: TokenStandard.NonFungible,
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    itemsAvailable: 1, // Increase SOL cost per items. Check the cost on Devnet before launch.
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        percentageShare: 100,
      },
    ],
    configLineSettings: some({
      prefixName: "",
      nameLength: 32,
      prefixUri: "",
      uriLength: 200,
      isSequential: false,
    }),
  });
  await transactionBuilder().add(createInstructions).sendAndConfirm(umi);

  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#public-keys
  console.log('collectionUpdateAuthority =>', base58PublicKey(collectionUpdateAuthority.publicKey));
  console.log('collectionMint =>', base58PublicKey(collectionMint.publicKey));
  console.log('candyMachine =>', base58PublicKey(candyMachine.publicKey));
  console.log('Solaneyees(Wait a sec) =>', 'https://www.solaneyes.com/address/' + base58PublicKey(candyMachine.publicKey));
}

main();

/*
% ts-node <THIS FILE>

collectionUpdateAuthority => B26oApMPxxWr8RrhXjpMbQ4YFHKdpcsQY7yTCvG1gsfr
collectionMint => 12CKxpMGdCKcjeUsJji7ShAqbL7knHKj6xqrBZjLuNy9
candyMachine => 7aMtLBih2zHrTnX6Jj8Gmbw3ZEknqob2WPPWCnJWqNBS
Solaneyees(Wait a sec) => https://www.solaneyes.com/address/7aMtLBih2zHrTnX6Jj8Gmbw3ZEknqob2WPPWCnJWqNBS
*/