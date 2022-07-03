// Ref: https://github.com/metaplex-foundation/js#findallbycandymachine
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const candyMachinePublicKey = new PublicKey("ELvb8zc75Ko2ay62EDax6ydUBQBLUJtMusVZ56fKsv5y");
  const nfts = await metaplex.nfts().findAllByCandyMachine(candyMachinePublicKey);

  console.log(nfts);
};

main();

/*
% ts-node findAllByCandyMachine.ts
[
  Nft {
    metadataAccount: {
      publicKey: [Pda],
      exists: true,
      data: [Metadata],
      executable: false,
      lamports: 5616720,
      owner: [PublicKey],
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 41de4aaa05c4fb7e235d08fd33be44c6cc1566e418f4c31ee91294cfab0be32d>
    },
    name: 'Number #0007',
    symbol: 'NB',
    uri: 'https://arweave.net/AVpXIoeJ-1djfGK4DZ-Jsl8MdTlEyI-ke_CelT6Mubg',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
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
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: d2bfd88e0f2e2813d8270c0b64de14bc1124e7c91c2cb5a7ee3550f9be101de9>
    },
    name: 'Number #0010',
    symbol: 'NB',
    uri: 'https://arweave.net/aKNmtpJE3ovs7To4SLaNEvqYXzXkd3D4TGW8VX9mut0',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
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
      rentEpoch: 336
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: a983eccf28c4d0af0ff8c0d336661a8d8d392c5249185cd53f68c3525df09e68>
    },
    name: 'Number #0005',
    symbol: 'NB',
    uri: 'https://arweave.net/8_L_fXa4kQX_VmFVB5xr9GTp_TtHyKeNY1hnkn3U2-I',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 254,
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
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 2d2683ed18394b428b533254442264b9104ab9e3c14af2791b9eebef72623c0c>
    },
    name: 'Number #0001',
    symbol: 'NB',
    uri: 'https://arweave.net/2dhq3l8ATJvu4-xRkpCbUMOLTLV64OO6zwwCnPxzzM8',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
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
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 507f902a620ab9417d76125742fafbd510af6eb13a44494e9769ffe041bed24b>
    },
    name: 'Number #0006',
    symbol: 'NB',
    uri: 'https://arweave.net/dN20ja2LUezvHajaOocKDby4Bue7k6E6yYMyX6hikbo',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 254,
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
      rentEpoch: 336
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 4e20bc12711fe397611e7778922804068790ce6f728b2e5a4997c9a22b6c8821>
    },
    name: 'Number #0009',
    symbol: 'NB',
    uri: 'https://arweave.net/7E1aFHvW55HzzegT6qnw9mH8DDlJev3ODJmlIq-KCP8',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 254,
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
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 50e6864ce5baff904e915a3fed0ab558474eac72a2e607c08f2b934d4ccb73ea>
    },
    name: 'Number #0004',
    symbol: 'NB',
    uri: 'https://arweave.net/4S1y2ULQwRDKO8uxy_29L5DfZLbDVFlkCRhEIhOD-tI',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
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
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: e5a0e256a6f7a62f1bbc205d092a5efdd8c2beb411dedc809591c29109394c85>
    },
    name: 'Number #0008',
    symbol: 'NB',
    uri: 'https://arweave.net/m5KBL1oKu2RH6Dp72t3LmHpPRQY33-jC9NBlpMoIoLM',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 254,
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
      rentEpoch: 335
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 78e72433512714e3f1fcc69b65aadb570ec8aaf4f57c8ebc4a30445cc5cd02c2>
    },
    name: 'Number #0002',
    symbol: 'NB',
    uri: 'https://arweave.net/FWzqeE7MBJsKzHhJ20NIhjZX1wxyodC0c_lkSm_gcMI',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
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
      rentEpoch: 336
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
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    mint: PublicKey {
      _bn: <BN: 5a208c837744652ea75f485f8f3da88ff27524ee7ca67fc0eec201332dae91ac>
    },
    name: 'Number #0003',
    symbol: 'NB',
    uri: 'https://arweave.net/S8BhBFjZG5d9osnCqAUrYhukp4rO3x3ER6f5ZRPT8zU',
    sellerFeeBasisPoints: 500,
    creators: [ [Object], [Object] ],
    primarySaleHappened: true,
    isMutable: true,
    editionNonce: 255,
    tokenStandard: null,
    collection: null,
    uses: null
  }
]
*/