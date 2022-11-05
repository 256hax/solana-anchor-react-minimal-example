// Ref: https://github.com/metaplex-foundation/js#findallbymintlist
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  // const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());

  // Collection NFT
  const mintA = new PublicKey("HPVTZ4XhFtcFaTRvN4EY9W4NVnfGcC3rsUxYyqFwv7x1");
  // Standard NFT
  const mintB = new PublicKey("HUkkvZ7tPniETALWppyNXCJ5hzEguWFtji8tPGvy1WKu");

  const [nftA, nftB] = await metaplex
    .nfts()
    .findAllByMintList({ mints: [mintA, mintB] });
 
  console.log('nftA =>', nftA);
  console.log('nftB =>', nftB);
};

main();

/*
% ts-node <THIS FILE>
nftA => {
  model: 'metadata',
  address: Pda {
    _bn: <BN: 70f1ccdc4ae8366410ff19ce02b4dd10d6ce8a23f6486672c30e0b139514c484>,
    bump: 255
  },
  mintAddress: PublicKey {
    _bn: <BN: f37df22acd57287869c0030ef9bc16085213ecd2999b10ed3c3691e03b7c6eb6>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: null,
  jsonLoaded: false,
  name: 'Art Collection',
  symbol: 'ART',
  uri: 'https://arweave.net/pW5_R-CCFW3MaXX5iUqwMk6O3ZWQR_k8s0fpUyr9xWg',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 0,
  editionNonce: 253,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: { version: 'V1', size: <BN: 1> },
  uses: null
}
nftB => {
  model: 'metadata',
  address: Pda {
    _bn: <BN: 4ee4c16e16e4052353d7c244ca859859ec709b459c8b285f80cd87ae4e0295a>,
    bump: 249
  },
  mintAddress: PublicKey {
    _bn: <BN: f4d726322024e7e44a585fbaeea019d827775cafc4bc8b6dca7f3c0b4afec8bc>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: null,
  jsonLoaded: false,
  name: 'Sunflowers',
  symbol: 'ART',
  uri: 'https://arweave.net/dB6XvvlJh-ka9cn7fqYbSbAYNOZHx2hpYTeQxhj3ScA',
  isMutable: true,
  primarySaleHappened: true,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [
    { address: [PublicKey], verified: true, share: 0 },
    { address: [PublicKey], verified: false, share: 100 }
  ],
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: ce832bd60a3b31d17c5b2230d496c5b3bf42ec85d1c44dae5c6c853a25e9ff86>
    },
    address: PublicKey {
      _bn: <BN: ce832bd60a3b31d17c5b2230d496c5b3bf42ec85d1c44dae5c6c853a25e9ff86>
    }
  },
  collectionDetails: null,
  uses: null
}
*/