// Docs: https://docs.metaplex.com/programs/candy-machine/candy-guards
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
  sol,
  dateTime,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const main = async () => {
  const endopoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endopoint, 'confirmed')
    .use(mplCandyMachine());

  // CAUTION: Use Env file instead of below file for Production.
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));
  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#keypairs
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(myKeypair));

  // -------------------------------------
  //  Create Collection NFT
  // -------------------------------------
  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);
  // Ref: https://mpl-token-metadata-js-docs.vercel.app/functions/createNft.html
  await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "My Collection NFT",
    uri: "https://arweave.net/yfVoS8kmFiM_XjfZOETgdCfrByKDyheSJ20nyam8_ag",
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
    itemsAvailable: 3,
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
    guards: {
      botTax: some({ lamports: sol(0.00321), lastInstruction: true }), // Configurable tax to charge invalid transactions.
      startDate: some({ date: dateTime("2023-04-04T16:00:00Z") }), // Determines the start date of the mint.
      mintLimit: some({ id: 1, limit: 1 }), // Specifies a limit on the number of mints per wallet.
      solPayment: some({ lamports: sol(0.00123), destination: umi.identity.publicKey }), // Set the price of the mint in SOL.
      // All other guards are disabled...
    },
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
  // This example temporarily uses minter as Umi's payer.
  // const minter = generateSigner(umi);
  const nftMint = generateSigner(umi);
  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        // minter, // default to Umi's identity and payer
        nftMint,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
        mintArgs: {
          mintLimit: some({ id: 1 }),
          solPayment: some({ destination: umi.identity.publicKey }),
        },
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
  console.log('collectionUpdateAuthority =>', collectionUpdateAuthority.publicKey.toString());
  console.log('collectionMint =>', collectionMint.publicKey.toString());
  console.log('candyMachine =>', candyMachine.publicKey.toString());
  console.log('nftMint =>', nftMint.publicKey.toString());
  console.log('-------------------------------------------------------');
  console.log('Solaneyees(Wait a sec) =>', 'https://www.solaneyes.com/address/' + candyMachine.publicKey.toString());
}

main();

/*
% ts-node <THIS FILE>

candyMachineAccount => {
  publicKey: {
    bytes: Uint8Array(32) [
      169,  55, 126, 174, 226, 134,  20,
      230,  37, 192,  40,  66, 207, 239,
      180,  18, 122, 169, 255, 137, 247,
       67, 104, 167, 209,  83,  39, 220,
       94, 170, 165, 116
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
       29,  59, 202, 152,  33, 227,   2, 139,
      174, 117,  38, 183, 114, 105, 205, 221,
      128,  81, 206, 207, 169,  83,  93, 230,
      238, 170,  93, 183,  61, 113,  52, 194
    ]
  },
  collectionMint: {
    bytes: Uint8Array(32) [
      239, 161, 221, 67, 152,  21,  53,  35,
       46, 202,   8, 54,  86, 152,  10, 230,
      203,  70,  60, 87,  73, 184, 224, 132,
      106,   9, 151, 40, 123, 193, 195, 238
    ]
  },
  itemsRedeemed: 1n,
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
      minted: false,
      name: 'My NFT #1',
      uri: 'https://arweave.net/2V5Mx2dwnyrwlpHYPVshiyj_WtU7qIlPZzKs6nIwqw4'
    },
    {
      index: 1,
      minted: false,
      name: 'My NFT #2',
      uri: 'https://arweave.net/2dyAzm_p5kz8GYYLAzKj41KQL3vYT_kWyomJ3mTpBcA'
    },
    {
      index: 2,
      minted: true,
      name: 'My NFT #3',
      uri: 'https://arweave.net/tD5TVplWyzqYvM9feLbIKGqkuTzf0AIO0nLc4NDiiPk'
    }
  ],
  itemsLoaded: 3,
  ruleSet: { __option: 'None' }
}
-------------------------------------------------------
myKeypair.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
collectionUpdateAuthority => FbvzSEEt8hHUdMyNWXQn9cSAdAfPc5H8mgyZnWmFc6Ce
collectionMint => H8RbR9G9WZTpqCyRSgzzNU7mjVbC59wnNhWqKQTDtA9b
candyMachine => CPYytbKQDSBbmDRofPxgiJDNDrFr7qrgvtD4KzXuGpFM
nftMint => 4FQ2FEzDhCQfWrZdUPayw7BcF3sfbpjc1jC6J86jpVRp
-------------------------------------------------------
Solaneyees(Wait a sec) => https://www.solaneyes.com/address/CPYytbKQDSBbmDRofPxgiJDNDrFr7qrgvtD4KzXuGpFM
*/