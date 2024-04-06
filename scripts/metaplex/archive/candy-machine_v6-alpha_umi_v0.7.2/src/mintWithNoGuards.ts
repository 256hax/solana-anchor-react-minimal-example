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
  console.log('myKeypair.publicKey =>', base58PublicKey(myKeypair.publicKey.bytes));
  console.log('candyMachine =>', base58PublicKey(candyMachine.publicKey));
  console.log('collectionMint =>', base58PublicKey(collectionMint.publicKey));
  console.log('collectionUpdateAuthority =>', base58PublicKey(collectionUpdateAuthority.publicKey));
  console.log('nftMint =>', base58PublicKey(nftMint.publicKey));
  console.log('minter =>', base58PublicKey(minter.publicKey));
  console.log('-------------------------------------------------------');
  console.log('Solaneyees(Wait a sec) =>', 'https://www.solaneyes.com/address/' + base58PublicKey(candyMachine.publicKey));
}

main();

/*
% ts-node <THIS FILE>
candyMachineAccount => {
  publicKey: {
    bytes: Uint8Array(32) [
      188, 222, 164, 251,  39,  48,   8,  95,
      177, 186, 221,  74, 243, 199,  97, 246,
       84,  42, 148, 164, 101, 214, 216,  64,
       84, 107, 236, 100,  20,  24, 142,  34
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
       58, 192,  11, 209, 177, 152, 118, 127,
       22, 191,  47, 229,  83,  90,  80, 171,
      232, 245, 190, 192, 140, 232, 180,  71,
       93,  43,  53, 136,  22, 175,  87, 130
    ]
  },
  collectionMint: {
    bytes: Uint8Array(32) [
       68, 115,  44, 187, 213,  88,  62, 142,
      114, 147,  51,  22, 184, 125,  54, 168,
        7, 193, 197, 217,  30, 202, 252, 197,
       72, 111, 164,  15,  47, 126, 227,  76
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
candyMachine => DiGZCF13yNh9ZEwmvhr8eCWxocPyEGSbqn5VAj6NRFXo
collectionMint => 5cCauW9FMwbp5VzhkTACtCfsNSJhJiMo1SGghvJaLhST
collectionUpdateAuthority => DoERzMYNca6GwDna3QZUtqkvqS1jwEGKmTm2Z9mNQFNu
nftMint => 9r4BFdJUHH5R4rZamfqWEnvPQXBbwZkKUQuJr5yu5zXm
minter => 9RrmA1x8raL3Sma3LWBFZFDiqJuTkHbok29GqUinwcCV
-------------------------------------------------------
Solaneyees(Wait a sec) => https://www.solaneyes.com/address/DiGZCF13yNh9ZEwmvhr8eCWxocPyEGSbqn5VAj6NRFXo
*/