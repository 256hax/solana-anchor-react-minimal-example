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
} from "@metaplex-foundation/mpl-essentials";

// Token
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

// Umi
import {
  generateSigner,
  keypairIdentity,
  base58PublicKey,
  transactionBuilder,
  percentAmount,
  some,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { nftStorageUploader } from "@metaplex-foundation/umi-uploader-nft-storage";

const main = async () => {
  const endopoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endopoint, 'confirmed')
    .use(mplCandyMachine());

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));
  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#keypairs
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(myKeypair));

  // If you build frontend using Wallet Adapter, use following.
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
  umi.use(nftStorageUploader());
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
  //  Candy Guards
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
  // Inseting Items.
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
  // First Minting.
  const nftMint = generateSigner(umi);
  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
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
  console.log('myKeypair.publicKey =>', base58PublicKey(myKeypair.publicKey.bytes));
  console.log('candyMachine =>', base58PublicKey(candyMachine.publicKey));
  console.log('collectionMint =>', base58PublicKey(collectionMint.publicKey));
  console.log('collectionUpdateAuthority =>', base58PublicKey(collectionUpdateAuthority.publicKey));
  console.log('nftMint =>', base58PublicKey(nftMint.publicKey));
  console.log('-------------------------------------------------------');
  console.log('Solaneyees(Wait a sec) =>', 'https://www.solaneyes.com/address/' + base58PublicKey(candyMachine.publicKey));
}

main();

/*
% ts-node <THIS FILE>
candyMachineAccount => {
  publicKey: {
    bytes: Uint8Array(32) [
       35, 218,  58, 192, 203,  97, 153,  70,
      138,  38, 192,  79, 248,   2,  20, 102,
      192, 127, 148,  95, 172, 216, 164, 123,
      153, 195,  27, 227,  84, 121, 245,  67
    ]
  },
  header: {
    executable: false,
    owner: { bytes: [Uint8Array] },
    lamports: { basisPoints: 11825040n, identifier: 'SOL', decimals: 9 },
    rentEpoch: 0,
    exists: true
  },
  discriminator: [
    51, 173, 177, 113,
    25, 241, 109, 189
  ],
  version: 1,
  tokenStandard: 0,
  features: [ 0, 0, 0, 0, 0, 0 ],
  authority: {
    bytes: Uint8Array(32) [
      245, 164,  74, 111,  54, 131, 150,  17,
      113,  31,   4,  20, 159,  81, 221,  64,
      109, 212, 188,  82, 203, 134, 242,  13,
      210, 177,  22,   8, 166,  44, 126, 233
    ]
  },
  mintAuthority: {
    bytes: Uint8Array(32) [
       49, 238,  57,  87, 136, 231, 163, 213,
       29, 237, 220,  30, 138,  98, 187, 169,
      127,   1, 219, 104, 171, 104, 154, 156,
       26, 137, 158,  63, 180, 232,   9,  32
    ]
  },
  collectionMint: {
    bytes: Uint8Array(32) [
      197,  79, 144, 101,  98,  23, 106,  62,
       61,  16,  15, 163,   7, 252,  23,  15,
       83,  36, 120,  98, 177, 241, 106,  95,
       10, 132, 117, 200,  82, 235,  81, 240
    ]
  },
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
candyMachine => 3QxGpNLvqeCnu4hEdZGG1ha8kW5V23higDoQ6dZNb8hQ
collectionMint => EHDgde6VpCHo2YBh6mUegJZG4VWCXghH6HJkF265Pu3V
collectionUpdateAuthority => 5jxu3XbxFSy9nGGDu7xHx4tM8xc8uafJRbv7ZvRC6B55
nftMint => 5K7QcsdDx9NecNvtRT7ta5xo3Xj6ojkZutNkWtgQq3Mj
-------------------------------------------------------
Solaneyees(Wait a sec) => https://www.solaneyes.com/address/3QxGpNLvqeCnu4hEdZGG1ha8kW5V23higDoQ6dZNb8hQ
*/