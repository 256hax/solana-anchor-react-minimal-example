// Ref: https://github.com/metaplex-foundation/js#findallbyowner
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

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

  // // Mint Address List
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
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 45bbaaed37a0049c56bd1664497740a35b0cfd922c9fa5bc45f7f0f1087f938d>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 2c9cbcf93e8bf7020235cac6ce1b191c473f4a52e10b16b5bb67c3d0d14bbcf1>
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
    editionNonce: 255,
    creators: [],
    tokenStandard: null,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 45bbaaed37a0049c56bd1664497740a35b0cfd922c9fa5bc45f7f0f1087f938d>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: e6d9c7cce9f2d25eb268f835740474e060cc752c9458d4cbafdd5f5a2d2fc4cc>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: e3ac3c3fe8de8d61ef5bccdd185bf5acbb93f490209e9c42ddf98f60cd439ef6>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    name: 'OddKey Test Collection',
    symbol: 'ODKYT',
    uri: 'https://arweave.net/CSDg44h609_C37vjaJP6y1U4TpICM9Z4-K0CldUZvnU',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 1000,
    editionNonce: 254,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: e6d9c7cce9f2d25eb268f835740474e060cc752c9458d4cbafdd5f5a2d2fc4cc>,
      bump: 254
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 9a4ef4a2871fed2a5acece1c06fd60bcf59f3f17650b5f285bfdd616c7d98df6>,
      bump: 254
    },
    mintAddress: PublicKey {
      _bn: <BN: 630db066653cfd4543c2430813a718d7bbe4f0fa6fc770009ed8f9e6b9da7f6a>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    name: 'Spawn #301 Tribute Cover',
    symbol: 'TM02',
    uri: 'https://arweave.net/ZtYu8R7UBYTnXXhaMaHwTTi-iYe9TO6j0jOgMcuJeTo',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 1000,
    editionNonce: 255,
    creators: [ [Object], [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 9a4ef4a2871fed2a5acece1c06fd60bcf59f3f17650b5f285bfdd616c7d98df6>,
      bump: 254
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: ccc9c7d1325df2c2dda51d2b54d079b6486fed72d769699dc8fad351a9669f89>,
      bump: 255
    },
    mintAddress: PublicKey {
      _bn: <BN: 6d7224c3b9cf0f2e640f339216fdf96cd10accd12e3e35901e1c8c94c3db9590>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    name: 'Spawn #301 Record Breaker Cover',
    symbol: 'TM01',
    uri: 'https://arweave.net/-8SzhOSkaSVK5GbWdE-lTOXySBVE8pT8PnAkcTUSdVw',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 1000,
    editionNonce: 255,
    creators: [ [Object], [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: ccc9c7d1325df2c2dda51d2b54d079b6486fed72d769699dc8fad351a9669f89>,
      bump: 255
    }
  },
  {
    model: 'nft',
    lazy: true,
    address: Pda {
      _bn: <BN: 4404b7d2057be9ff749fbfe288c4e36c33ab2265713c7efe5a2514934d570090>,
      bump: 252
    },
    mintAddress: PublicKey {
      _bn: <BN: 791ea3d957bdbb99cec0c7163965ee07424a2b655434aaa6acc3192d1693b608>
    },
    updateAuthorityAddress: PublicKey {
      _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
    },
    name: 'OddKey Spawnoki - Genesis',
    symbol: 'ODKY',
    uri: 'https://arweave.net/V1pC20jyLLfV9nIWasgnWWhQwKw48Ayp3dWXsjZYDfQ',
    isMutable: true,
    primarySaleHappened: false,
    sellerFeeBasisPoints: 1000,
    editionNonce: 253,
    creators: [ [Object], [Object] ],
    tokenStandard: 0,
    collection: null,
    uses: null,
    metadataAddress: Pda {
      _bn: <BN: 4404b7d2057be9ff749fbfe288c4e36c33ab2265713c7efe5a2514934d570090>,
      bump: 252
    }
  },
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
  }
]
*/