// Ref: https://github.com/metaplex-foundation/js#findallbyowner
import {
  Metaplex,
  guestIdentity,
  bundlrStorage,
  toBigNumber
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  PublicKey
} from '@solana/web3.js';

const main = async () => {
  // const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const connection = new Connection(clusterApiUrl('devnet'));

  const metaplex = Metaplex.make(connection)
    // Ref: https://github.com/metaplex-foundation/js#guestidentity
    .use(guestIdentity())
    .use(bundlrStorage());

  // const owenerPublicKey = new PublicKey("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd"); // Mainnet
  const owenerPublicKey = new PublicKey('55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK'); // Devnet
  const myNfts = await metaplex
    .nfts()
    .findAllByOwner({ owner: owenerPublicKey });

  console.log(myNfts);

  // [Full logs]
  // console.log(util.inspect(myNfts, { maxArrayLength: null }));

  // [Mint Address List]
  // myNfts.map((nft:any) => {  
  //   console.log(nft.mintAddress.toString());
  // });

  // [Retrieve all NFTs by specifying the collection and owner]
  // const targetUpdateAuthorityAddress: string = 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg';
  // const targetVerifiedCollectionAddress: string = '5TSnNMr6Q36qjU6fZfArTNkquv7XsFXDK5osnT8ygUSr';
  // let getNfts: any[] = [];

  // myNfts.forEach((m: any) => {
  //   if (
  //     m.updateAuthorityAddress.toString() === targetUpdateAuthorityAddress
  //     && m.collection?.address.toString() === targetVerifiedCollectionAddress
  //     && m.collection?.verified === true
  //   ) {
  //     getNfts.push(m);
  //   }
  // });

  // console.log('Target Update Authority Address =>', targetUpdateAuthorityAddress);
  // console.log('Target Verified Collection Address =>', targetVerifiedCollectionAddress);
  // console.log('Get NFTs =>', getNfts);
};

main();

/*
Note:
  If you got following error in Mainnet-beta, you need to use Custom RPC(e.g. QuicNode) I think.
  "Server responded with 429 Too Many Requests.  Retrying after 500ms delay...".
*/

/*
% ts-node <THIS FILE>
[
  {
    model: 'metadata',
    address: Pda [PublicKey(F34k94Csbgo1RRsTKjwnr6eor7Mr4EZCgppPE8R3HoaS)] {
      _bn: <BN: d08b02fdd525fe2a126aed6f7f86b05c4baca3fac8de8cc86e37412b9795fbeb>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(5TSnNMr6Q36qjU6fZfArTNkquv7XsFXDK5osnT8ygUSr)] {
      _bn: <BN: 423500332bfcaf9eddfd6c9407413073e9cb815528ee843bcda004ae7b48709f>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Parts of Scannner',
    symbol: 'N',
    uri: 'https://arweave.net/5V4Q3gWiXOWI8mIk1lOI653IMY8Eaq30Tw8nnmSS7ZA',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(5TSnNMr6Q36qjU6fZfArTNkquv7XsFXDK5osnT8ygUSr)]],
      address: [PublicKey [PublicKey(5TSnNMr6Q36qjU6fZfArTNkquv7XsFXDK5osnT8ygUSr)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(8sykMvsagwYibj8XakRUyuUZfMdb81MAwT5qrNA32Yy2)] {
      _bn: <BN: 7511037ee377db49197a788ffbb411eab21ffab1dbcf2047bca0f2016d1d60b5>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(3V3sKMKTvoJ5riMfaEFaUEjoXVVUoMT9Pxprg8SqCike)] {
      _bn: <BN: 24e6e0fac424c5bc7470e13497b2c635bd566c8506509fab217c851bf3cb3c3f>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Character Samurai(39,996)',
    symbol: '',
    uri: 'https://arweave.net/lnODovDjfeKJUP-amtn7UIGKKwKcbZBYrZdNkcHP2H4',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]],
      address: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(6hcybKisqa3Ezpo4BtEdmukDTSP6rATmMHEBz4xFhk1Z)] {
      _bn: <BN: 54b258497c21ce0d5222568e662a95bf93a16f90b91a7fc75e7f3373db924cec>,
      bump: 252
    },
    mintAddress: PublicKey [PublicKey(4yzXzn2StsBWHXYZgiZDPqhJGZFpTWfhNXLEAggdxdMe)] {
      _bn: <BN: 3b2ca3f520fb0bad0eb42898208b1b498205792973fbbf64f47571dc39752b35>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'KUMA',
    symbol: 'K',
    uri: 'https://arweave.net/WHc7jtBxh0Junht3wK3jhL21OHFWEiMjGL0opC019Z4',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(AR9oRpDHsLW4tkb2fgMthaoZGQj9bnKMAoNZ9k9Yuy1K)]],
      address: [PublicKey [PublicKey(AR9oRpDHsLW4tkb2fgMthaoZGQj9bnKMAoNZ9k9Yuy1K)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(FUGHVFRRbmv3M9n7vyv5YT5MbnrmdNjz1jXwFikU3mor)] {
      _bn: <BN: d6ff94ae130d39316768404967e79c2957d18d4ebe46949fa530d266a86930ed>,
      bump: 253
    },
    mintAddress: PublicKey [PublicKey(9jcNGNqFFnrTwgtKF7Dz5QPwjVV2Er3CLT3UoxCapkmQ)] {
      _bn: <BN: 81c7e0ea8fb2c937554c2bb3d0de17f68c00c67b412980019de28da6b0b7e323>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'KUMA',
    symbol: 'K',
    uri: 'https://arweave.net/k9gQ2DAcn1a-T3mb_sAKO6ZcsQKocNfBbFG-eQU--i8',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(AR9oRpDHsLW4tkb2fgMthaoZGQj9bnKMAoNZ9k9Yuy1K)]],
      address: [PublicKey [PublicKey(AR9oRpDHsLW4tkb2fgMthaoZGQj9bnKMAoNZ9k9Yuy1K)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(A3XToM9q2eq4fv3YdJpNed3nqcFR6RjF6ZKQp2yJGcku)] {
      _bn: <BN: 865ec99a2e04022d0245c92d354329d77574fa2d61e4467897cfdb4fedce1e06>,
      bump: 253
    },
    mintAddress: PublicKey [PublicKey(6KFr9k6CQYy7sAiejTTgaNKdGzkmoFk8Jf1dzLD611Rr)] {
      _bn: <BN: 4ef7ad5f325e653e6031e969bf6a76c622d8a812e1f0861915fe810c27af2bb1>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Irasutoya',
    symbol: 'IR',
    uri: 'https://testnet.redstone.tools/cLFj9qLySh1Mllb25-u6QRCuxzBhFij1Ye4Pc2C9dro',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(6RzyrsdB2W2L5hWDzdDhuSFXyzCqRujarx7xS3pCwsUC)] {
      _bn: <BN: 50b1eec0f95dda2eab47a26114c9608838a0b040fd976bbac1148f58d37d3db1>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(FBGhXeBcVbn9FD9sP71fG2Ynv6A5mJSK38TLSDGjYQHV)] {
      _bn: <BN: d2a52cfb3997c1676831123e2b53c3db91638cab78b7d03db9efd653c1209a50>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(7SUHhrxZFqHAGafDXQpLUkzefTedibaw2o7Ka3ThvB8E)] {
      _bn: <BN: 5fac7f165a30635ce7cb0f654ca3829115ea68b953d4d150b9e365edd23be113>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(m1pzeB8URuFR9VDTw3dpqjkJyjoDEXhv5diPw5G2XgB)] {
      _bn: <BN: b467dc177911f5c719dbcd249f7a8b329b6aac34cffee342f3a744dc7958930>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 251,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(AaGQVuzTUJYntL8NiASY8DCVdRjajG43UCtyda6Rg8Ap)] {
      _bn: <BN: 8e3ec4876fc127ba4d7459e3ca07ff32ec71db3d3a3761921e698863f06f322d>,
      bump: 254
    },
    mintAddress: PublicKey [PublicKey(CJ2EqdKNhiBAXzeRL5ujHk5G8jZJabjU3kzGkGUCv3jL)] {
      _bn: <BN: a7ccd496c3c199b45f9037db0d7462a4524fadbc0b7c8efa713a5c8677a94bf7>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Parts of Scannner - Mario',
    symbol: 'N',
    uri: 'https://arweave.net/Jh0N8ERexGqnO-sPSfJ8UfUV-oAjMbkh7AJ1AndhqdM',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(BHBxFsZbSCRQdfCxkN17SDsQ2W4yf3YBRcMm9cRUtneW)]],
      address: [PublicKey [PublicKey(BHBxFsZbSCRQdfCxkN17SDsQ2W4yf3YBRcMm9cRUtneW)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(z5iSiFV7ufyT5NQRMWaNfPYBbyuhuFKbyUD7WJArE9W)] {
      _bn: <BN: e9f6fd654f0cc51fc5fcd21ccdc8a3673e81439c577d6e66587eb2fd2f001d9>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(6DzWNETNvsSHiFX9dQCafinu4Qu2NkFWP3ibMT7pYq9A)] {
      _bn: <BN: 4d9e6d4b92aee0111265325023955b8aa156710f965564737a6debd2c4a673a1>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(C4xMe1uP5BvGS1cGBLSp8MhoLfQ2LrRpfzsgp4K6ngFs)] {
      _bn: <BN: a473e3c06a8129a58b3255ec7d4dec8d4704632c3e2078a195573e7f611062b2>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(7sKKD5T6r4ppvvtQufiHHscAti6CHYzMgvxqi4vND6j9)] {
      _bn: <BN: 6609dea0fce918aa5e4e32f6b285a7c16f95302a46081a7638b2919fec2b24d0>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(4kk7Vvfc14W2Gmo33E5m6nUHrJmCHJG9yapiV4ZTtyp8)] {
      _bn: <BN: 37c7c852f728600f0779b64e2f910706a1dbbc7c5d72b3347df5feee259553e5>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(JAZVNcCdZ14hk8xKEzQxBXw6ykURCaNYnLsRbYomKwPd)] {
      _bn: <BN: ff09a402954ef2d5b51acf7503d517e219ef0a34ce2de773d89818ab2825f9c8>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Kawaii Maid',
    symbol: '',
    uri: 'https://arweave.net/wL_hX2I5C-7ekIpH8TQuHSDfd8-zERY0e8sNBaSLltI',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(HvjVQqQzuSD2Wzn5GcxSA3rY7qfXyFfVNveanKjwyeW3)] {
      _bn: <BN: fb7ed12eec0de35338e2f58f9ad14023c2ca9dddf718f2a3ac5ffc772ed53b28>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(ExgE18a4CC5R26jTPLMncVXJgYnKdjg6UDwhFXkSXuia)] {
      _bn: <BN: cf6b39b7ba9051a46420a692215ae0adfc8d3c4d7a17b00553ae4851bdffb85b>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(5AFyFSeDpHGqGRJYB9tGWwKHfYefLgereSXTgyzBpmek)] {
      _bn: <BN: 3dcde6c28514cffaad6dbb75a550b5d14c6a527e4f17cab152d6119e3ede24d5>,
      bump: 251
    },
    mintAddress: PublicKey [PublicKey(8ucyYKjdreLdda9HMo3GMLgaoF2k2QwqbS1MyHbfZ3iR)] {
      _bn: <BN: 757caffb0f409027658ec8e287c2324145d195e255ba9d5290fb1a8f256ad04a>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(3ryKqwWu1xAy12W4DEZb19wFfbW2o5E8FA2Dngywws39)] {
      _bn: <BN: 2a84852f8e37343561360105f803f3fb965eff7d2121382591ea8797ebebe894>,
      bump: 250
    },
    mintAddress: PublicKey [PublicKey(EjvPTPwFVcgpFsPrb1B7CwFxUfUiPhxRsGFkkfh56t5H)] {
      _bn: <BN: cc26b0672d629ad2a85e9328ef81d7425a944208967542da441aa17a50c1eb2c>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Character Samurai(39,996)',
    symbol: '',
    uri: 'https://arweave.net/lnODovDjfeKJUP-amtn7UIGKKwKcbZBYrZdNkcHP2H4',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]],
      address: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(8PfcRa6YnSPnhoEwYRY4CRd4C49aUZPsVW3pbakR3Evj)] {
      _bn: <BN: 6dd03e5ca0a52316ed4863e67fd025a933d48da008965ffd64d4e82d75c250f0>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(Ghiortivvz4jEReh1NZmqteY3YCnPMrZGYrY4LNy4qd7)] {
      _bn: <BN: e94dcf03118ce2c6fafc00cb47ba61220d8fe2ff420810133bc89324cc093246>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Character Samurai(39,996)',
    symbol: '',
    uri: 'https://arweave.net/lnODovDjfeKJUP-amtn7UIGKKwKcbZBYrZdNkcHP2H4',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 253,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]],
      address: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(2w44znQp3WZ3xZEZGqzT983yaVGPbRgZskrWeJzEXM1o)] {
      _bn: <BN: 1cb48548420db550f5374b161b03b320b63c6904c137ee1ec4bfc5f26b0593de>,
      bump: 254
    },
    mintAddress: PublicKey [PublicKey(Eu8zfdtk91WR7hFF2BdLoZSc6hqSaxBwfiXu9zbDyNof)] {
      _bn: <BN: ce832bd60a3b31d17c5b2230d496c5b3bf42ec85d1c44dae5c6c853a25e9ff86>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Art Collection',
    symbol: 'ART',
    uri: 'https://arweave.net/Sd5sTNAWw7Drc70WMW1oJTacrqqPf4ln6H9z3xUHVsk',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: { version: 'V1', size: <BN: 2> },
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(H3EyrUtFQgw8L3qVeXVZWRahLxT9JDmCNHnaw5st5bDD)] {
      _bn: <BN: ee4df5be1895c1be43bb2c14ce7e59e37559141ee78beead991e538540c8989c>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(3WLdc3P5HwbFGYHwNvmMny4Ztv6zziLMpC62XpncmZPR)] {
      _bn: <BN: 253b6a0e257247f197e00926f7bf33f9328fbf3fc609ad472642d4f1b0ad0684>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Character Samurai(39,996)',
    symbol: '',
    uri: 'https://arweave.net/lnODovDjfeKJUP-amtn7UIGKKwKcbZBYrZdNkcHP2H4',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]],
      address: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(FoaS4pntzcoc4XjgvhiSfB8P7R25KtDYL3jfkjzKfjX3)] {
      _bn: <BN: dbf222d504a6ecda887c46d5a1abcba163a48fa6735455546d5dc12c5de8b066>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(GyDyeUBXs5MFnXEzw7rqZG7MwMqs3seXwX4p3RwuYn5g)] {
      _bn: <BN: ed46808016d87c7728f122c47f753fa4896d8806a89c35b4b3535b404d44223b>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Parts of Scannner - Mario',
    symbol: 'N',
    uri: 'https://arweave.net/WzzrLLTf-wuvZ47Zv-ET9q_SaJiMCCjMJytm1wNIIXU',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(BHBxFsZbSCRQdfCxkN17SDsQ2W4yf3YBRcMm9cRUtneW)]],
      address: [PublicKey [PublicKey(BHBxFsZbSCRQdfCxkN17SDsQ2W4yf3YBRcMm9cRUtneW)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(5g6z7FE2XfzCGpNF9Mvd6RHRp4puVhkxMTPBr5873H5b)] {
      _bn: <BN: 45732a848fa179852f374247f5d20dac043e854dfcf4ba5fee13aff4bc1d66da>,
      bump: 253
    },
    mintAddress: PublicKey [PublicKey(9cveJeDEjBJX7F395tKDFYYnwAwQwsJzuzsb26kPBSSi)] {
      _bn: <BN: 80117a6f40a945d8bbf471ac48fcb169a3076603e62b4ea34d22eff7b44ce8e7>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Character Samurai(39,996)',
    symbol: '',
    uri: 'https://arweave.net/lnODovDjfeKJUP-amtn7UIGKKwKcbZBYrZdNkcHP2H4',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]],
      address: [PublicKey [PublicKey(76ZL5SvipPkQgquCGHDKEQoQTw59mMWoCi6U2jkwFB1Z)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(HBLVmrYAmnizWXsxVBY4sraCC9T6CVpBdAEcXdEyYZ8j)] {
      _bn: <BN: f060d7dce0ff80fb81bb6afb6c099be4efd6239a9bec16a1fbc6ccc81b51fab8>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(4f1AHiXhaD1QkhbrwsLp5nVpr66B5RJmAJes8kYbqg4T)] {
      _bn: <BN: 364f500652c23550b8ff7528c78750e6e24ea5346accac012a6b6d5a2f2e3984>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Dummy NFT',
    symbol: '',
    uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(63z1C65NW3K76v18PmvdsLbsmUvdEqNYuJocjL7E5qSg)] {
      _bn: <BN: 4b0e0cd22e3b9da0d967321899b09f1d30e58776325a19a56a82606f0536c381>,
      bump: 253
    },
    mintAddress: PublicKey [PublicKey(HKvMihe54KAw94vHLXJCwnFxjEnGrHQfjmHAytCT8i1R)] {
      _bn: <BN: f293c6ce9dc84a9d0bb52ac980cbc44868e80915e90167a729ab404467a00734>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: '#1',
    symbol: '',
    uri: 'https://arweave.net/QAS5i-_5m_cIyIqSEZ6s0Cy1owvxeKPjmp4ksQ3GMbo',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(G4ohZNCM6DxTv2cLQx7BDfKCoVgx3JxmTPa9nsGj9yNG)] {
      _bn: <BN: dfd8d96fd2fd0ecc17e1d8b0be4d05e33575f8db1e2738c0fd0f3a2a32dbf9f1>,
      bump: 254
    },
    mintAddress: PublicKey [PublicKey(9XwWUfvMN6NQyoqTceZHSSeLsRaGLqtcb3Wo85oy5Cus)] {
      _bn: <BN: 7eca8d65847368e90126ff2a2cc17feced9355b06e026eb5bc505fa3d9ef2de6>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Regular NFT',
    symbol: 'paper',
    uri: 'https://arweave.net/NuqNsTAwVGZ0RjHNj_UwfQfqtofqK4eItmEn6vljFBU',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [],
    tokenStandard: 0,
    collection: {
      verified: false,
      key: [PublicKey [PublicKey(GvkSVzXPaVzVxZd3u7jiqWr1goeq7AczJmwya1cX7suB)]],
      address: [PublicKey [PublicKey(GvkSVzXPaVzVxZd3u7jiqWr1goeq7AczJmwya1cX7suB)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(2NAgatGXFnDs2K1svUV4ozH153FAw2B4rvJ7bk61L29b)] {
      _bn: <BN: 1447d4f9f5e22965c24df53e956946b9f181901afe7a2d700bccc6c2127ae9ee>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(BHBxFsZbSCRQdfCxkN17SDsQ2W4yf3YBRcMm9cRUtneW)] {
      _bn: <BN: 98ba8be4f5767902f91e3fe8573f1eaf0fae2edeaddd55d78b2d81d717dce43b>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Scanners of Scannner',
    symbol: 'N',
    uri: 'https://arweave.net/gKPCrWs11K7Q2AFuxvX8bNNmvTO7MifR29xI4wiG_4Q',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(7724SBJvoua4KtNcuERhFojtQzUkJYZDCdpkLpUAT3ru)] {
      _bn: <BN: 5ab0cdd71bdf4606caafe973c33c69b2aa60da6e9cd09a17731ae018174b3156>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(7buajqHTLrsujHZSLyq72V6BPgXKPkHMgVAiF5zAnJGL)] {
      _bn: <BN: 621752c92e42e607343d5aafb8dcee83ee771be1c1d5df136dd0c77b1b3fe915>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Kawaii Maid',
    symbol: '',
    uri: 'https://arweave.net/wL_hX2I5C-7ekIpH8TQuHSDfd8-zERY0e8sNBaSLltI',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(tFjpKRagcu1B6DvXkrJMHSAbajiHEPgECWoroijHhvv)] {
      _bn: <BN: d21492a62e7416c9a13bc1abec3d1937853b272ccab17a84d0ff07ca2467d97>,
      bump: 255
    },
    mintAddress: PublicKey [PublicKey(FPtidE7CZrWbq2TeyYBZZGgBrBrctLSibVWsBky9v8xP)] {
      _bn: <BN: d5e0df433327f4cfa06c3b71859ef90793f6bfd5b520c7ab92646b4e8e626010>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Scanner',
    symbol: '',
    uri: 'http://localhost:3000/metadata/scanner/953789a4-ce1b-440a-a973-718fd529bd11.json',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: {
      verified: true,
      key: [PublicKey [PublicKey(2m62iaoxCViXDyFFZxueQP65rFvctrE9q2EQtKtyDH4s)]],
      address: [PublicKey [PublicKey(2m62iaoxCViXDyFFZxueQP65rFvctrE9q2EQtKtyDH4s)]]
    },
    collectionDetails: null,
    uses: null,
    programmableConfig: null
  },
  {
    model: 'metadata',
    address: Pda [PublicKey(HW71th2Vp849MexBqFJe1WobwgeShmn2WGQd1A2uJSCM)] {
      _bn: <BN: f52fa2c90fc4c4c5ee19d064d592f1ee38e02b2fd49a6c8b54e0ec7b40c38ade>,
      bump: 254
    },
    mintAddress: PublicKey [PublicKey(62wQFymZsn1s5hZrgZX8rGBWmWUibTNAqMu9X7HGo7iW)] {
      _bn: <BN: 4ac986dfcfe4ee38faa79dd399ccf3cb47705d2cd4b48eb0567d80a4245df9df>
    },
    updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Collection NFT',
    symbol: 'paper',
    uri: 'https://arweave.net/AmOcnk2_T0Z_8yHtk29J9Fb42ZDMUMAa5pwTHZLrtdU',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [],
    tokenStandard: 0,
    collection: null,
    collectionDetails: { version: 'V1', size: <BN: 1> },
    uses: null,
    programmableConfig: null
  }
]
*/