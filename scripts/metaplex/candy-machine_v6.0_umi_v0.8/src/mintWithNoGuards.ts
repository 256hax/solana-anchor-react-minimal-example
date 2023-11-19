// Docs: https://docs.metaplex.com/programs/candy-machine/
// Test Code: https://github.com/metaplex-foundation/mpl-candy-machine/blob/main/clients/js/test/mintV2.test.ts

// Lib
import * as fs from 'fs';

// Candy Machine
import {
  mplCandyMachine,
  addConfigLines,
  create,
  mintV2,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

// Token
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

// Umi
import {
  generateSigner,
  keypairIdentity,
  transactionBuilder,
  percentAmount,
  some,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const main = async () => {
  const endopoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endopoint, 'confirmed')
    .use(mplCandyMachine());

  // CAUTION: Use Env file instead of below file for Production.
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));
  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#keypairs
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(myKeypair));

  // If you need signer, use createSignerFromKeypair.
  // const collectionUpdateAuthority = createSignerFromKeypair(umi, myKeypair);

  // If you build frontend(e.g. Admin Control Panel) using Wallet Adapter, use following.
  // 
  // import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
  // const wallet = useWallet();
  // const umi = createUmi(endopoint, 'confirmed')
  //   .use(walletAdapterIdentity(wallet))
  //   .use(mplCandyMachine())

  // -------------------------------------
  //  Create Collection NFT
  // -------------------------------------
  // Upload the JSON metadata.
  // Ref: https://docs.metaplex.com/programs/candy-machine/inserting-items#uploading-json-metadata
  umi.use(irysUploader());
  const uri = await umi.uploader.uploadJson({
    name: "My NFT #1",
    description: "My description",
    image: 'https://placekitten.com/100/200',
  });

  // Create NFT.
  // Ref: https://mpl-token-metadata-js-docs.vercel.app/functions/createNft.html
  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "My Collection NFT",
    uri,
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);

  // -------------------------------------
  //  Candy Machine
  // -------------------------------------
  // Create a Candy Machine with guards.
  // Ref: https://docs.metaplex.com/programs/candy-machine/candy-machine-settings
  const candyMachine = generateSigner(umi);
  const createInstructions = await create(umi, {
    candyMachine,
    collectionMint: collectionMint.publicKey,
    collectionUpdateAuthority,
    tokenStandard: TokenStandard.NonFungible,
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    itemsAvailable: 3, // Increase SOL cost per items. Check the cost on Devnet before launch.
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
      // isSequential: indicates to whether a sequential index generation should be used during mint or not (recommended to set this value to false).
      isSequential: false,
    }),
  });
  await transactionBuilder().add(createInstructions).sendAndConfirm(umi);

  // -------------------------------------
  //  Insert Items
  // -------------------------------------
  // Ref: https://docs.metaplex.com/programs/candy-machine/inserting-items
  await addConfigLines(umi, {
    candyMachine: candyMachine.publicKey,
    index: 0,
    configLines: [
      { name: "My NFT #1", uri: "https://arweave.net/2V5Mx2dwnyrwlpHYPVshiyj_WtU7qIlPZzKs6nIwqw4" },
      { name: "My NFT #2", uri: "https://arweave.net/2dyAzm_p5kz8GYYLAzKj41KQL3vYT_kWyomJ3mTpBcA" },
      { name: "My NFT #3", uri: "https://arweave.net/tD5TVplWyzqYvM9feLbIKGqkuTzf0AIO0nLc4NDiiPk" },
    ],
  }).sendAndConfirm(umi);

  // -------------------------------------
  //  Mint NFT
  // -------------------------------------
  const minter = generateSigner(umi);

  // First Minting.
  const nftMint = generateSigner(umi);
  
  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        minter,
        nftMint,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
      }),
    )
    .sendAndConfirm(umi);

  // Second Minting.
  const nftMint2 = generateSigner(umi);
  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        minter,
        nftMint: nftMint2,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
      }),
    )
    .sendAndConfirm(umi);

  // -------------------------------------
  //  Fetch Candy Machine
  // -------------------------------------
  const candyMachineAccount = await fetchCandyMachine(
    umi,
    candyMachine.publicKey
  );

  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#public-keys
  console.log('candyMachineAccount =>', candyMachineAccount);
  console.log('-------------------------------------------------------');
  console.log('myKeypair.publicKey =>', myKeypair.publicKey.toString());
  console.log('candyMachine =>', candyMachine.publicKey.toString());
  console.log('collectionMint =>', collectionMint.publicKey.toString());
  console.log('collectionUpdateAuthority =>', collectionUpdateAuthority.publicKey.toString());
  console.log('nftMint =>', nftMint.publicKey.toString());
  console.log('minter =>', minter.publicKey.toString());
  console.log('-------------------------------------------------------');
  console.log('Solaneyees(Wait a sec) =>', 'https://www.solaneyes.com/address/' + candyMachine.publicKey.toString());
}

main();

/*
% ts-node <THIS FILE>
candyMachineAccount => {
  publicKey: '21UnLsotwapD1gnqjRbVwDXCHy6K9vNJxuc6SfLX3ypb',
  header: {
    executable: false,
    owner: 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
    lamports: { basisPoints: 11825040n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 18446744073709552000,
    exists: true
  },
  discriminator: [
    51, 173, 177, 113,
    25, 241, 109, 189
  ],
  version: 1,
  tokenStandard: 0,
  features: [ 0, 0, 0, 0, 0, 0 ],
  authority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  mintAuthority: 'FyjU4xRDGViMBcinpCVN9X95fv41mGpHJbiXxpbx3GEr',
  collectionMint: 'GPAz6MdBkwNBDLTCHsTU4dsrS9XeXDaSkgmN3bg7HX5c',
  itemsRedeemed: 2n,
  data: {
    itemsAvailable: 3n,
    symbol: '',
    sellerFeeBasisPoints: { basisPoints: 999n, identifier: '%', decimals: 2 },
    maxEditionSupply: 0n,
    isMutable: true,
    creators: [ [Object] ],
    configLineSettings: { __option: 'Some', value: [Object] },
    hiddenSettings: { __option: 'None' }
  },
  items: [
    {
      index: 0,
      minted: true,
      name: 'My NFT #1',
      uri: 'https://arweave.net/2V5Mx2dwnyrwlpHYPVshiyj_WtU7qIlPZzKs6nIwqw4'
    },
    {
      index: 1,
      minted: true,
      name: 'My NFT #2',
      uri: 'https://arweave.net/2dyAzm_p5kz8GYYLAzKj41KQL3vYT_kWyomJ3mTpBcA'
    },
    {
      index: 2,
      minted: false,
      name: 'My NFT #3',
      uri: 'https://arweave.net/tD5TVplWyzqYvM9feLbIKGqkuTzf0AIO0nLc4NDiiPk'
    }
  ],
  itemsLoaded: 3,
  ruleSet: { __option: 'None' }
}
-------------------------------------------------------
myKeypair.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
candyMachine => 21UnLsotwapD1gnqjRbVwDXCHy6K9vNJxuc6SfLX3ypb
collectionMint => GPAz6MdBkwNBDLTCHsTU4dsrS9XeXDaSkgmN3bg7HX5c
collectionUpdateAuthority => 7GxxnDC4fNt4DW7Tds1nTZX7UrrCAWLi5gtejfUypFEu
nftMint => FHAYfWA6BbiXkLx5ZA2rKnGkTs6Ni9GJP2SvYoAUkiyB
minter => 12feHfMcxZnTzTgBLiLaD8twRoQn5Xp6DuB9BEbv6rtW
-------------------------------------------------------
Solaneyees(Wait a sec) => https://www.solaneyes.com/address/21UnLsotwapD1gnqjRbVwDXCHy6K9vNJxuc6SfLX3ypb
*/