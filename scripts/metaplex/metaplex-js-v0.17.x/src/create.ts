// Ref: https://github.com/metaplex-foundation/js#create
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toBigNumber,
  mockStorage,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const wallet = Keypair.generate();

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  let airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);

  // ------------------------------------
  //  Make Metaplex
  // ------------------------------------
  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // ------------------------------------
  //  Mint NFT
  // ------------------------------------
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: 'My NFT Metadata',
      description: 'My description',
      image: 'https://placekitten.com/200/300',
      attributes: [
        {
          trait_type: 'Genre',
          value: 'Cat'
        }
      ]
    });

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: 'My NFT',
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
    });

  console.log('nft.address =>', nft.address.toString());
  console.log('uri =>', uri);
  console.log('nft =>', nft);

  // ------------------------------------
  //  Use Mock
  // ------------------------------------
  // const metaplex = Metaplex.make(connection)
  //   .use(keypairIdentity(wallet))
  //   .use(mockStorage());
  // 
  // const { uri } = await metaplex
  //   .nfts()
  //   .uploadMetadata({
  //     name: "My NFT Metadata",
  //     description: "My description",
  //     image: "https://placekitten.com/200/300",
  //   });
  // 
  // const fakeNft = await metaplex.storage().download(uri);
  // console.log('fakeNft =>', fakeNft.buffer.toString());
};

main();

/*
% ts-node <THIS FILE>
nft.address => 2kgzy1p7eRRDynwsJoT2b31AhKmUSyC6Q5DB4JbHkWZS
uri => https://arweave.net/M_OepASbf0aG4Z2ez4qH2ImeGiGZpNw5_8OyAw8tfyA
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 59175ac24de79c6ba456b892a7edc10f5d8d0c2d64a7a921e507ec822ec391d5>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300',
    attributes: [ [Object] ]
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/M_OepASbf0aG4Z2ez4qH2ImeGiGZpNw5_8OyAw8tfyA',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 1a0ce3a22b084f10cc593000ef97cd606c7fa4b01f3d0c715b2bb12403b7dd25>
  },
  metadataAddress: Pda {
    _bn: <BN: b0094a7cdafbbb8f741cd5bb6c6e08f97e6d663611d28b1d1ffa033c77d51e3b>,
    bump: 253
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 1a0ce3a22b084f10cc593000ef97cd606c7fa4b01f3d0c715b2bb12403b7dd25>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: e3888afb8774aaf9a13e5f3831b14426bf383fe6c4b47d2dad67b8c937c6a219>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: e3888afb8774aaf9a13e5f3831b14426bf383fe6c4b47d2dad67b8c937c6a219>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: d9063b0c17b169982542c105a07f3e6f45c1fa9e953930f1cfc699b08c621594>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 1a0ce3a22b084f10cc593000ef97cd606c7fa4b01f3d0c715b2bb12403b7dd25>
    },
    ownerAddress: PublicKey {
      _bn: <BN: 59175ac24de79c6ba456b892a7edc10f5d8d0c2d64a7a921e507ec822ec391d5>
    },
    amount: { basisPoints: <BN: 1>, currency: [Object] },
    closeAuthorityAddress: null,
    delegateAddress: null,
    delegateAmount: { basisPoints: <BN: 0>, currency: [Object] },
    state: 1
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: e3888afb8774aaf9a13e5f3831b14426bf383fe6c4b47d2dad67b8c937c6a219>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
*/