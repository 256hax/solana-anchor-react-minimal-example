// Ref: https://github.com/metaplex-foundation/js#create
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // --- Airdrop ---
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
  // --- End Airdrop ---


  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));
    // [Mock]
    // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "My NFT Metadata",
      description: "My description",
      image: "https://placekitten.com/200/300",
    })
    .run();

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: "My NFT",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
    })
    .run();

  // [Mock] Use following if active ".use(mockStorage())".
  // const fakeNft = await metaplex.storage().download(uri);
  // console.log('fakeNft =>', fakeNft.buffer.toString());

  console.log('uri =>', uri);
  console.log('nft =>', nft);
  console.log('nft.address =>', nft.address.toString());
};

main();

/*
% ts-node <THIS FILE>
uri => https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: c87d1d5d37acd7e2ff64508faba4624763cd375ad296e725c72663a3bf3fa17f>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/flsMEEsaVxZJefZRWUQlK7AqciUmveT6T4LgK-WP3-0',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 3aa614d1bbc5cf204aa006a01e4bfed943701dcffe9fae11f59bad6a272fd30a>
  },
  metadataAddress: Pda {
    _bn: <BN: a1980239af35f379d1c3c328c0db9350bdbb57b10522a6b059fe6ea210a1a7bb>,
    bump: 252
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 3aa614d1bbc5cf204aa006a01e4bfed943701dcffe9fae11f59bad6a272fd30a>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 730d6fbd3b27bf64e45320b3edafb40eb1aa235000880cc13ebb7447346b1981>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 730d6fbd3b27bf64e45320b3edafb40eb1aa235000880cc13ebb7447346b1981>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: b8dc7121f27a625ce7254402863655363192df00aa345f24afc407cf1be6200d>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 3aa614d1bbc5cf204aa006a01e4bfed943701dcffe9fae11f59bad6a272fd30a>
    },
    ownerAddress: PublicKey {
      _bn: <BN: c87d1d5d37acd7e2ff64508faba4624763cd375ad296e725c72663a3bf3fa17f>
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
      _bn: <BN: 730d6fbd3b27bf64e45320b3edafb40eb1aa235000880cc13ebb7447346b1981>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
nft.address => 4wwXihNUDQYjfgpo3vwPaBP94tg8vCxe1Q759QtmLLqf
*/