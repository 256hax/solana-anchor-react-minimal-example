// Ref: https://github.com/metaplex-foundation/js#findallbycreator
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const creatorPublicKey = new PublicKey("Dq89Qd6D37GWPQqoqNNwtk1tZuny4DbRfdymHV2W1Y2q");
  const myNfts = await metaplex.nfts().findAllByOwner(creatorPublicKey);
  // const myNfts = await metaplex.nfts().findAllByCreator(creatorPublicKey, 1); // Equivalent to the previous line.
  // const myNfts = await metaplex.nfts().findAllByCreator(creatorPublicKey, 2); // Now matching the second creator field.

  console.log(myNfts);
};

main();

/*
% ts-node findAllByCreator.ts
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
      _bn: <BN: e125f02024b2aa3199a2d14643fb05229e0305ab3e8983a690800b41cf708ec6>
    },
    mint: PublicKey {
      _bn: <BN: 402246167217f52d37c7a43a3fe06f3e974d7d4b7407cc55c55dd15110f0e8e8>
    },
    name: 'Official Solana NFT',
    symbol: 'NFT',
    uri: 'https://www.01820109289102.com/nft.txt',
    sellerFeeBasisPoints: 0,
    creators: null,
    primarySaleHappened: false,
    isMutable: true,
    editionNonce: 253,
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
      _bn: <BN: b8f62a93029d61c5ff792beeadc03aa9e6fbe3cf2afab3c788f7c92ca37827f4>
    },
    name: 'Oddkey Test Collection #2',
    symbol: 'OKT01',
    uri: 'https://arweave.net/V1pC20jyLLfV9nIWasgnWWhQwKw48Ayp3dWXsjZYDfQ',
    sellerFeeBasisPoints: 1000,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 255,
    tokenStandard: 0,
    collection: { verified: true, key: [PublicKey] },
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
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    mint: PublicKey {
      _bn: <BN: c770f325ddcfbad201cb3980c61d1ee136266093ced9693f5eb9e101abe9b707>
    },
    name: 'Oddkey Test Collection #1',
    symbol: 'OKT01',
    uri: 'https://arweave.net/V1pC20jyLLfV9nIWasgnWWhQwKw48Ayp3dWXsjZYDfQ',
    sellerFeeBasisPoints: 1000,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 253,
    tokenStandard: 0,
    collection: { verified: true, key: [PublicKey] },
    uses: null
  }
]
*/