// Ref: https://github.com/metaplex-foundation/js#findallbyowner
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const owenerPublicKey = new PublicKey("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd");
  const myNfts = await metaplex.nfts().findAllByOwner(owenerPublicKey);

  console.log(myNfts);
};

main();

/*
% ts-node findAllByOwner.ts
[
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 322
    },
    metadataTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [Function (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    editionTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [AsyncFunction (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    updateAuthority: PublicKey {
      _bn: <BN: 251ff03bd3649204bc3aa32ccc5af07dd3f2dc34a6e5065b767f310c957d6310>
    },
    mint: PublicKey {
      _bn: <BN: 6e83c8e27340d18b14c5eeef6c2fc9169668bc0a8dd36d5cb71529d2294d6b7d>
    },
    name: 'OddKey Collection 2',
    symbol: 'ODKY2',
    uri: 'https://dvbojlobrcw4xiyu5o24huqcxdv6kmczjbiwg2ym4xh5aybtibyq.arweave.net/HULkrcGIrcujFOu1w9ICuOvlMFlIUWNrDOXP0GAzQHE',
    sellerFeeBasisPoints: 0,
    creators: [ [Object], [Object] ],
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 255,
    tokenStandard: null,
    collection: null,
    uses: null
  },
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 323
    },
    metadataTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [Function (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    editionTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [AsyncFunction (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    updateAuthority: PublicKey {
      _bn: <BN: e125f02024b2aa3199a2d14643fb05229e0305ab3e8983a690800b41cf708ec6>
    },
    mint: PublicKey {
      _bn: <BN: 2c9cbcf93e8bf7020235cac6ce1b191c473f4a52e10b16b5bb67c3d0d14bbcf1>
    },
    name: 'Official Solana NFT',
    symbol: 'NFT',
    uri: 'https://www.01820109289102.com/nft.txt',
    sellerFeeBasisPoints: 0,
    creators: null,
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 255,
    tokenStandard: null,
    collection: null,
    uses: null
  },
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 323
    },
    metadataTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [Function (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    editionTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [AsyncFunction (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    updateAuthority: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    mint: PublicKey {
      _bn: <BN: 791ea3d957bdbb99cec0c7163965ee07424a2b655434aaa6acc3192d1693b608>
    },
    name: 'OddKey Spawnoki - Genesis',
    symbol: 'ODKY',
    uri: 'https://arweave.net/V1pC20jyLLfV9nIWasgnWWhQwKw48Ayp3dWXsjZYDfQ',
    sellerFeeBasisPoints: 1000,
    creators: [ [Object], [Object] ],
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 253,
    tokenStandard: 0,
    collection: null,
    uses: null
  },
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 323
    },
    metadataTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [Function (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    editionTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [AsyncFunction (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    updateAuthority: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    mint: PublicKey {
      _bn: <BN: 630db066653cfd4543c2430813a718d7bbe4f0fa6fc770009ed8f9e6b9da7f6a>
    },
    name: 'Spawn #301 Tribute Cover',
    symbol: 'TM02',
    uri: 'https://arweave.net/ZtYu8R7UBYTnXXhaMaHwTTi-iYe9TO6j0jOgMcuJeTo',
    sellerFeeBasisPoints: 1000,
    creators: [ [Object], [Object], [Object] ],
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 255,
    tokenStandard: 0,
    collection: null,
    uses: null
  },
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 322
    },
    metadataTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [Function (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    editionTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [AsyncFunction (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    updateAuthority: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    mint: PublicKey {
      _bn: <BN: e3ac3c3fe8de8d61ef5bccdd185bf5acbb93f490209e9c42ddf98f60cd439ef6>
    },
    name: 'OddKey Test Collection',
    symbol: 'ODKYT',
    uri: 'https://arweave.net/CSDg44h609_C37vjaJP6y1U4TpICM9Z4-K0CldUZvnU',
    sellerFeeBasisPoints: 1000,
    creators: [ [Object], [Object] ],
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 254,
    tokenStandard: 0,
    collection: null,
    uses: null
  },
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 323
    },
    metadataTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [Function (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    editionTask: Task {
      status: 'pending',
      result: undefined,
      error: undefined,
      callback: [AsyncFunction (anonymous)],
      children: [],
      context: {},
      eventEmitter: [EventEmitter]
    },
    updateAuthority: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    mint: PublicKey {
      _bn: <BN: 6d7224c3b9cf0f2e640f339216fdf96cd10accd12e3e35901e1c8c94c3db9590>
    },
    name: 'Spawn #301 Record Breaker Cover',
    symbol: 'TM01',
    uri: 'https://arweave.net/-8SzhOSkaSVK5GbWdE-lTOXySBVE8pT8PnAkcTUSdVw',
    sellerFeeBasisPoints: 1000,
    creators: [ [Object], [Object], [Object] ],
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 255,
    tokenStandard: 0,
    collection: null,
    uses: null
  }
]
*/