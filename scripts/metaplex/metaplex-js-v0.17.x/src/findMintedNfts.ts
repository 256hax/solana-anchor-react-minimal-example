// Ref: https://metaplex-foundation.github.io/js/classes/js.CandyMachinesV2Client.html#findMintedNfts
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  // const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());

  const candyMachine = new PublicKey("CQ37suWDLv4YBRSYHsrxAMUqNg62KwCexvuv5r9vNxRk");

  const nfts = await metaplex
    .candyMachinesV2()
    .findMintedNfts({ candyMachine });
 
  // const mintAddress = nfts.map(nft =>
  //   nft.name + ': ' + nft.address.toString()
  // );

  const mintAddress = nfts.map(nft => {
    if(nft.model == 'metadata') {
      return nft.name + ': ' + nft.mintAddress.toString();
    }
  });

  console.log('mintAddress =>', mintAddress);
  console.log('nfts =>', nfts);
};

main();

/*
% ts-node <THIS FILE>

mintAddress => [
  'Scanners of Scannner: AoH4D8ysR17gcCer9FziEbvwUxuhnkr5x1HWwYk2RvXM',
  'Parts of Scannner: F34k94Csbgo1RRsTKjwnr6eor7Mr4EZCgppPE8R3HoaS',
  'Rewards of Scannner: Gt4kTbDcdqP6ejaBVbhWSEuywwZCFCgmLYzYVyJUGjrz'
]
nfts => [
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: 91940daa1773f0b6d75a1e7dfb8a492cb67fedd04fe37a8bcef90f4fd3360fc4>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 9888d651083425569e3b4e554ac9ce06ea63c83610bb2630479f0ff93dd984bc>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Scanners of Scannner',
    symbol: 'N',
    uri: 'https://arweave.net/FR1S5v0pRNWkes2T6lHAgZZfRNVbQf5AjYGozEzTrF8',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
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
      _bn: <BN: d08b02fdd525fe2a126aed6f7f86b05c4baca3fac8de8cc86e37412b9795fbeb>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 423500332bfcaf9eddfd6c9407413073e9cb815528ee843bcda004ae7b48709f>
    },
    updateAuthorityAddress: PublicKey {
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
    collection: null,
    collectionDetails: null,
    uses: null
  },
  {
    model: 'metadata',
    address: Pda {
      _bn: <BN: ebf42a1bcab56af442ce0e03259187f98ad1b84bd0047bea9609f52383090ce3>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: 1aeb2dcbcdf38ac885a744a6854f5afc0dcdc45d51d02804f183caffb5a717f4>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    json: null,
    jsonLoaded: false,
    name: 'Rewards of Scannner',
    symbol: 'N',
    uri: 'https://arweave.net/3FE3C8aM9Z3CxHtW1Fl5REWPBNuoWcXfMsbYamaE4FQ',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 500,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    collectionDetails: null,
    uses: null
  }
]
*/