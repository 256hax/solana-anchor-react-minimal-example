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
  const myNfts = await metaplex
      .nfts()
      .findAllByOwner(creatorPublicKey)
      .run();

  console.log(myNfts);
};

main();

/*
% ts-node <THIS FILE>

  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 871030869e0d6323ba972075cba774aba7d1a49558bcb6c357384f2b994bbbe>,
      bump: 251
    },
    mintAddress: PublicKey {
      _bn: <BN: c770f325ddcfbad201cb3980c61d1ee136266093ced9693f5eb9e101abe9b707>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    name: 'Oddkey Test Collection #1',
    symbol: 'OKT01',
    uri: 'https://arweave.net/V1pC20jyLLfV9nIWasgnWWhQwKw48Ayp3dWXsjZYDfQ',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 1000,
    editionNonce: 253,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: { verified: true, key: [PublicKey] },
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 871030869e0d6323ba972075cba774aba7d1a49558bcb6c357384f2b994bbbe>,
      bump: 251
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 2a092f87a93a029f7655d07d0416c845a6fd2c051908c646c5f6c19a512debe3>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: b8f62a93029d61c5ff792beeadc03aa9e6fbe3cf2afab3c788f7c92ca37827f4>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    name: 'Oddkey Test Collection #2',
    symbol: 'OKT01',
    uri: 'https://arweave.net/V1pC20jyLLfV9nIWasgnWWhQwKw48Ayp3dWXsjZYDfQ',
    isMutable: true,
    primarySaleHappened: true,
    sellerFeeBasisPoints: 1000,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: { verified: true, key: [PublicKey] },
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 2a092f87a93a029f7655d07d0416c845a6fd2c051908c646c5f6c19a512debe3>,
      bump: 254
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: e7a30d2d55b5d339e5068ac66855accbbc102375c39746166d4e0a185b927816>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 402246167217f52d37c7a43a3fe06f3e974d7d4b7407cc55c55dd15110f0e8e8>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: e125f02024b2aa3199a2d14643fb05229e0305ab3e8983a690800b41cf708ec6>
    },
    name: '_Official Solana NFT',
    symbol: 'NFT',
    uri: 'https://www.66312712367123.com/nft.txt',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 253,
    creators: [],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: e7a30d2d55b5d339e5068ac66855accbbc102375c39746166d4e0a185b927816>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: fa5605d82c968ad49594bff17f1b097c3f924e088162596069663db9f10fdf1a>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: 6e83c8e27340d18b14c5eeef6c2fc9169668bc0a8dd36d5cb71529d2294d6b7d>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 251ff03bd3649204bc3aa32ccc5af07dd3f2dc34a6e5065b767f310c957d6310>
    },
    name: 'OddKey Collection 2',
    symbol: 'ODKY2',
    uri: 'https://dvbojlobrcw4xiyu5o24huqcxdv6kmczjbiwg2ym4xh5aybtibyq.arweave.net/HULkrcGIrcujFOu1w9ICuOvlMFlIUWNrDOXP0GAzQHE',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 0,
    editionNonce: 255,
    creators: [ [Object], [Object] ],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: fa5605d82c968ad49594bff17f1b097c3f924e088162596069663db9f10fdf1a>,
      bump: 254
    }
  }
]
*/