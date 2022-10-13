// Ref: https://github.com/metaplex-foundation/js#printnewedition
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async () => {
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
  // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "My NFT Metadata",
      description: "My description",
      image: "https://placekitten.com/200/300",
    })

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: "My NFT",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(2),
    })

  // Ref:
  //  printNewEdition: https://github.com/metaplex-foundation/js#printnewedition
  //  Account Structure: https://docs.metaplex.com/programs/token-metadata/#printing-editions
  const { nft: printedNft } = await metaplex
    .nfts()
    .printNewEdition({ originalMint: nft.address })

  // Ref: useNft: https://github.com/metaplex-foundation/js#usenft
  // const { nft: usedNft } = await mx.nfts().use(nft).run(); // Use once.
  // const { nft: usedNft } = await mx.nfts().use(nft, { numberOfUses: 3 }).run(); // Use three times.

  console.log('\n--- Master Edition(Original NFT) ------------------------------------');
  console.log('uri =>', uri);
  console.log('nft =>', nft);
  console.log('masterNft Address =>', nft.address.toString());

  console.log('\n--- Edition(Printed NFT) ------------------------------------');
  console.log('printedNft =>', printedNft);
  console.log('printedNft Address =>', printedNft.address.toString());

  if (printedNft.edition.isOriginal) {
    const totalPrintedNfts = printedNft.edition.supply;
    const maxNftsThatCanBePrinted = printedNft.edition.maxSupply;
  } else {
    const mintAddressOfOriginalNft = printedNft.edition.parent;
    const editionNumber = printedNft.edition.number;
    console.log('mintAddressOfOriginalNft =>', mintAddressOfOriginalNft.toString());
    console.log('editionNumber =>', Number(editionNumber));
  }
};

main();

/*
% ts-node <THIS FILE>
--- Master Edition(Original NFT) ------------------------------------
uri => https://arweave.net/6G6x8-hNUg4InXLklpp9oQLMUxMa6d4zvaqppvhddHg
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 16b6bcf6a3869001667910d678793f09f90285fd2b5053160fa0f01ce0b50f0e>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/6G6x8-hNUg4InXLklpp9oQLMUxMa6d4zvaqppvhddHg',
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
    _bn: <BN: 21b9a3d3d670b43934f9ddc13501c621f683af7f871f7af0ab9dad29885197>
  },
  metadataAddress: Pda {
    _bn: <BN: 1f2e8089c48e7300aa4a2be33ca58c3e63259f04ce47e94716b031946aa416b9>,
    bump: 252
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 21b9a3d3d670b43934f9ddc13501c621f683af7f871f7af0ab9dad29885197>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: de83a43443a4d9d10ea8f5a7d6be8583f221a3c7806322ba512399d0918d8b6f>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: de83a43443a4d9d10ea8f5a7d6be8583f221a3c7806322ba512399d0918d8b6f>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: 35e34103d16f645b5e97b9f0192c08741a8b54996786e5d0e51b216a4e6f0ade>,
      bump: 255
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 21b9a3d3d670b43934f9ddc13501c621f683af7f871f7af0ab9dad29885197>
    },
    ownerAddress: PublicKey {
      _bn: <BN: 16b6bcf6a3869001667910d678793f09f90285fd2b5053160fa0f01ce0b50f0e>
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
      _bn: <BN: de83a43443a4d9d10ea8f5a7d6be8583f221a3c7806322ba512399d0918d8b6f>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 2>
  }
}
masterNft Address => 1Wpx1tkTSXMa1ifTLyJH16vA5ix6k7rMXh63jn9roQa

--- Edition(Printed NFT) ------------------------------------
printedNft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 16b6bcf6a3869001667910d678793f09f90285fd2b5053160fa0f01ce0b50f0e>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/200/300'
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/6G6x8-hNUg4InXLklpp9oQLMUxMa6d4zvaqppvhddHg',
  isMutable: false,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 3,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 62333101889223efb58e91af889e1ce62e8b81efe9e90a84ed5cae3af1729dba>
  },
  metadataAddress: Pda {
    _bn: <BN: a06441902fdf19e2d0310c6fee5e1d939707380f43ae93d21dfccd8010839f4e>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 62333101889223efb58e91af889e1ce62e8b81efe9e90a84ed5cae3af1729dba>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 99c580d27a908ae5d45f2a63b07983fd4ffe19abb85eaa55cd55bf24922dd700>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 99c580d27a908ae5d45f2a63b07983fd4ffe19abb85eaa55cd55bf24922dd700>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: f680de4b6ae45af4b7bfc1103a153f5f178bde7f5ac9f5d4a915f8c1b23a98b4>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 62333101889223efb58e91af889e1ce62e8b81efe9e90a84ed5cae3af1729dba>
    },
    ownerAddress: PublicKey {
      _bn: <BN: 16b6bcf6a3869001667910d678793f09f90285fd2b5053160fa0f01ce0b50f0e>
    },
    amount: { basisPoints: <BN: 1>, currency: [Object] },
    closeAuthorityAddress: null,
    delegateAddress: null,
    delegateAmount: { basisPoints: <BN: 0>, currency: [Object] },
    state: 1
  },
  edition: {
    model: 'nftEdition',
    isOriginal: false,
    address: Pda {
      _bn: <BN: 99c580d27a908ae5d45f2a63b07983fd4ffe19abb85eaa55cd55bf24922dd700>,
      bump: 255
    },
    parent: PublicKey {
      _bn: <BN: de83a43443a4d9d10ea8f5a7d6be8583f221a3c7806322ba512399d0918d8b6f>
    },
    number: <BN: 1>
  }
}
printedNft Address => 7cLEF8yGpjaktJUJjWWX21zZrwECPFjMdfXphyG9YzJd
mintAddressOfOriginalNft => Fybw8SBNQMMRUiCQDyqiJvmiiAqLaj5Zqd8SVhBPkcKQ
editionNumber => 1
*/