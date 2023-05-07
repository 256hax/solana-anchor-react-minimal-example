// Docs: https://docs.metaplex.com/programs/candy-machine/available-guards/allow-list
// Test Code: https://github.com/metaplex-foundation/mpl-candy-machine/blob/main/clients/js/test/defaultGuards/allowList.test.ts

// Lib
import * as fs from 'fs';

// Candy Machine
import {
  mplCandyMachine,
  addConfigLines,
  create,
  mintV2,
  fetchCandyMachine,
  getMerkleRoot,
  route,
  getMerkleProof,
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
  sol,
  dateTime,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const main = async () => {
  const endopoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endopoint, 'confirmed')
    .use(mplCandyMachine());

  // Allow Address: HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
  // CAUTION: Use Env file instead of below file for Production.
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));

  // Disallow Address: BLPTf7GaD29J7q2rkEf1ZA3JpoYyZh6Wk6rywecme8BF
  // const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id-dummy.json', 'utf8')));

  // Ref: https://github.com/metaplex-foundation/umi/blob/main/docs/publickeys-signers.md#keypairs
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(myKeypair));

  // -------------------------------------
  //  Allow List
  // -------------------------------------
  // Given the identity is part of an allow list.
  const allowList = [
    // base58PublicKey(umi.identity),
    'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
  ];
  const merkleRoot = getMerkleRoot(allowList);

  // -------------------------------------
  //  Create Collection NFT
  // -------------------------------------
  const collectionUpdateAuthority = generateSigner(umi);
  const collectionMint = generateSigner(umi);
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
    guards: {
      allowList: some({ merkleRoot }),
    },
  });
  await transactionBuilder().add(createInstructions).sendAndConfirm(umi);

  // -------------------------------------
  //  Insert Items
  // -------------------------------------
  await addConfigLines(umi, {
    candyMachine: candyMachine.publicKey,
    index: 0,
    configLines: [
      { name: "My NFT #1", uri: "https://arweave.net/2V5Mx2dwnyrwlpHYPVshiyj_WtU7qIlPZzKs6nIwqw4" },
      { name: "My NFT #2", uri: "https://arweave.net/2dyAzm_p5kz8GYYLAzKj41KQL3vYT_kWyomJ3mTpBcA" },
      { name: "My NFT #3", uri: "https://arweave.net/tD5TVplWyzqYvM9feLbIKGqkuTzf0AIO0nLc4NDiiPk" },
    ],
  }).sendAndConfirm(umi);

  // When we verify the payer first by providing a valid merkle proof.
  // Merkle Root/Proof: https://docs.metaplex.com/programs/candy-machine/available-guards/allow-list#route-instruction
  await transactionBuilder()
    .add(
      route(umi, {
        candyMachine: candyMachine.publicKey,
        guard: 'allowList',
        routeArgs: {
          path: 'proof',
          merkleRoot,
          merkleProof: getMerkleProof(allowList, base58PublicKey(umi.identity)),
        },
      })
    )
    .sendAndConfirm(umi);

  // -------------------------------------
  //  Mint NFT
  // -------------------------------------
  const minter = generateSigner(umi);
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
        mintArgs: {
          allowList: some({ merkleRoot }),
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
  console.log('myKeypair.publicKey =>', base58PublicKey(myKeypair.publicKey.bytes));
  console.log('collectionUpdateAuthority =>', base58PublicKey(collectionUpdateAuthority.publicKey));
  console.log('collectionMint =>', base58PublicKey(collectionMint.publicKey));
  console.log('candyMachine =>', base58PublicKey(candyMachine.publicKey));
  console.log('nftMint =>', base58PublicKey(nftMint.publicKey));
  console.log('merkleRoot Hash =>', base58PublicKey(merkleRoot));
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
       22, 201,  39,   2,  79,   5, 194, 140,
      130, 227, 242, 159,  31,   7,  37,  34,
      236,   9, 201, 216, 166, 116, 191, 209,
      143,  47, 147, 219, 166, 175, 250, 203
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
       77, 180,  30,  22, 116, 178,  18, 44,
      128, 165, 147, 119,  52,  93,  67, 54,
      252, 240, 104, 214,  41, 245, 140, 99,
       96, 152, 192,   9, 157, 241, 209, 16
    ]
  },
  collectionMint: {
    bytes: Uint8Array(32) [
       67, 250,  34,   4,  97, 244, 194,  60,
       52,  22, 196, 255, 245,  85, 144,  38,
      195, 208, 189,  81, 116, 249,  82, 251,
      118,  69, 161,  60, 255,  19, 216, 185
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
      minted: true,
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
collectionUpdateAuthority => 8atnEHeHvwqN6aSLeoJcAtPFkopea1yL4rRuemuNBqbU
collectionMint => 5aMY1BVd32cNyyspBYY6XsDJbVjaRKURXaYPiTqwvfpL
candyMachine => 2XwsS7bwCxm194kkmo9SyQzGA19h5dT8QAJbk2EJBE7U
nftMint => A9ULJ9v8k2sF71ykyPueSrRFuWLs3BURaicyLWzzkTKT
merkleRoot Hash => 7v89Y2RQKzC1h7aVMdofJRGEhBx4bpTcKLrXf8SUyK5E
-------------------------------------------------------
Solaneyees(Wait a sec) => https://www.solaneyes.com/address/2XwsS7bwCxm194kkmo9SyQzGA19h5dT8QAJbk2EJBE7U
*/