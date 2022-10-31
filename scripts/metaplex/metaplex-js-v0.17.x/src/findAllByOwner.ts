// Ref: https://github.com/metaplex-foundation/js#findallbyowner
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
// import util from 'util';

const main = async() => {
  // const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());

  // const owenerPublicKey = new PublicKey("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd"); // mainnet
  const owenerPublicKey = new PublicKey("HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg"); // devnet
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
    address: Pda {
      _bn: <BN: 8a7f38289150e0dc96e56f2d72ada9fc9673be53be4145d707d4788153b7665a>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: b2992f421c6f71ea407984f53169418f094d47f6d7d018dc742e12ef00006335>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'OddKey - Spawnoki #1',
    symbol: 'ODDKEY',
    uri: 'https://arweave.net/2__klPsVDrTKL4GzFFJV00yVR04ZyT1HbVmYAYiA7mc',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 1000,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: 763e50573097a5f46483a5d7fa45cfd5541a6b167638213997f48df9e1a4f5fd>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: ee7518bfad97d794f65268a81bfda4373689cd1bf1a3b705e023530b2177654e>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'OddKey - Spawnoki #1',
    symbol: 'ODDKEY',
    uri: 'https://arweave.net/2__klPsVDrTKL4GzFFJV00yVR04ZyT1HbVmYAYiA7mc',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 1000,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: b336e55ddca2f09584b1bfcdbbe6b1dd75887e177a9fd541375b3cc186598a1b>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: 7be3692dc3ec0a0c63d38cdf6ea2f583d523a3efe4a7f23ccf229c47901d062f>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'OddKey Spawnoki - Genesis',
    symbol: 'ODKY',
    uri: 'https://arweave.net/IJ6wGFZ7X2VkGqWIPX94eUdAFKTwS6SA8xz7XuIi7l8',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 1000,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: 7724ecaf6fe8e9739077650a8eda1a6abbb1fdf1aae3d5c110dd5ef0368ddb4f>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: aabd41b9f36a619fa7832c7c24f53de2191b68e6ac4bb888a76d7c1d14661733>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'Spawn #301 Tribute Cover',
    symbol: 'OK01',
    uri: 'https://arweave.net/ds0S5IpAfVSjzwrk7XGU6GTi30jgrsF4UpQE0tOnbYI',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 1000,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: c309ec8184591980d8731b651750eecc034021d2a284468b145abddbdb1841ad>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: e4f61865cf5fc0604515a56cba73fad1e8039e0d97042e27c6c3cdd2b1826bd9>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'Collection NFT',
    symbol: 'OKT01',
    uri: '',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: 7701fe4d075b43ec572fb63b8d635cbc4cf496dd7f1127b3a6c43b30f6fab96a>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 4b06a2f542064782b19c432c7df7fcf13fb0859982a2b0ff50dcc7bae6357b0d>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'Collection NFT',
    symbol: 'TM02',
    uri: '',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 255,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: f051b70ba874d66cabdc46982619f5595a9cde211b9779c8a614750a3f167797>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: f0ed17662adc001013dfb5f47851d693fa31cbba3b8d80d4a671099bef3a6fab>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    json: null,
    jsonLoaded: false,
    name: 'Collection NFT',
    symbol: 'TM02',
    uri: '',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 254,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  }
]
*/

/*
% ts-node <THIS FILE>
[
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: b333a420bd281289419d5127272961b89a68177801bfc8a0c85068dfc41b282c>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: e461286b4fba04e090b21496275e7199e8d42194b18d596cffc8e4e4ea271859>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Relguar NFT',
    symbol: 'paper',
    uri: 'https://arweave.net/2UPSQ5mtDE_3URIMhu7pqJx-J5PTiSlwOKNGadtvlk0',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 252,
    creators: [ [Object] ],
    tokenStandard: 0,
    collection: { verified: false, key: [PublicKey], address: [PublicKey] },
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: a95929682845a74769127a854da97fb52a60b2d8c76d8a57c57f88852ecb7d3>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: e58e03d4d3ef6c7cc8a8a135ffe8be806345aa58e4231b834de26556b5984f4d>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Regular NFT',
    symbol: 'paper',
    uri: 'https://arweave.net/cVX2NRJkUG5CozVP3o54cLcwS86tte8ICFAmPMt0YrY',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 500,
    editionNonce: 254,
    creators: [],
    tokenStandard: 0,
    collection: { verified: true, key: [PublicKey], address: [PublicKey] },
    collectionDetails: null,
    uses: null
  }
]
*/