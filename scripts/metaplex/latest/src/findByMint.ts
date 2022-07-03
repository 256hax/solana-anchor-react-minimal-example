// Ref: https://github.com/metaplex-foundation/js#findbymint
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const mint = new PublicKey("BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1");

  const nft = await metaplex.nfts().findByMint(mint);
  const imageUrl = nft.metadata.image;
  // const supply = nft.originalEdition.supply;
  // const maxSupply = nft.originalEdition.maxSupply;

  console.log('imageUrl =>', imageUrl);
  console.log('\n----------------------------------------------------------------');
  console.log('nft =>', nft);
};

main();

/*
% ts-node findByMint.ts
imageUrl => https://arweave.net/qo8ztaPtogwKDNmvMNpv_npI-TygP4JtLAKaNqGs6nY?ext=png

----------------------------------------------------------------
nft => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: c3c5e6a1b194a824b031f37ffa888b97e6446c216ea9100afa90ac6178375473>,
      bump: 255
    },
    exists: true,
    data: Metadata {
      key: 4,
      updateAuthority: [PublicKey],
      mint: [PublicKey],
      data: [Object],
      primarySaleHappened: true,
      isMutable: true,
      editionNonce: 254,
      tokenStandard: 0,
      collection: [Object],
      uses: null,
      collectionDetails: null
    },
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 323
  },
  metadataTask: Task {
    status: 'successful',
    result: {
      name: 'OddKey Spawnoki - Genesis',
      symbol: 'ODKY',
      description: 'The Spawnoki Genesis NFT is a limited giveaway mint. They are the first NFT to come from legendary partners Steve Aoki and Todd McFarlane to make way for the launch of their marketplace: https://oddkey.com/',
      seller_fee_basis_points: 1000,
      image: 'https://arweave.net/qo8ztaPtogwKDNmvMNpv_npI-TygP4JtLAKaNqGs6nY?ext=png',
      animation_url: 'https://arweave.net/HBqyr2Pnamm6k5or9ts5umU6UelJxJ0h33FI-nD9ESM?ext=mp4',
      external_url: 'https://oddkey.com/',
      properties: [Object],
      collection: '99oRvHGHmUZz9XDZyZBmtzQ3LR3eVbcpiDPCPpvyzXaF',
      uses: null,
      attributes: [Array]
    },
    error: undefined,
    callback: [Function (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  editionTask: Task {
    status: 'successful',
    result: {
      publicKey: [Pda],
      exists: true,
      data: [MasterEditionV2],
      executable: false,
      lamports: 2853600,
      owner: [PublicKey],
      rentEpoch: 323
    },
    error: undefined,
    callback: [AsyncFunction (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  updateAuthority: PublicKey {
    _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
  },
  mint: PublicKey {
    _bn: <BN: 3bada9465610efb26cbca09c52a21c877e4fb184aef430a80b38325871dde77a>
  },
  name: 'OddKey - Spawnoki #2124',
  symbol: 'ODKY',
  uri: 'https://arweave.net/W-20MpV-N1l6e_vxWxjmGfFnGkiiUDn7GJAsgYmJ6fU',
  sellerFeeBasisPoints: 1000,
  creators: [
    { address: [PublicKey], verified: true, share: 0 },
    { address: [PublicKey], verified: false, share: 100 }
  ],
  primarySaleHappened: true,
  isMutable: true,
  editionNonce: 254,
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: 791ea3d957bdbb99cec0c7163965ee07424a2b655434aaa6acc3192d1693b608>
    }
  },
  uses: null
}
*/