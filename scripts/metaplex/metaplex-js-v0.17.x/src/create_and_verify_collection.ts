// Ref: https://github.com/metaplex-foundation/js#create
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { createVerifyCollectionInstruction, SetAndVerifyCollectionStruct, setAndVerifySizedCollectionItemInstructionDiscriminator, VerifyCollectionInstructionAccounts, VerifyCollectionStruct } from "@metaplex-foundation/mpl-token-metadata";
import * as fs from 'fs';
import sleep from 'sleep';

const main = async () => {
  const connection = new Connection(clusterApiUrl("devnet"));

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('src/assets/id.json', 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);
  // const wallet = Keypair.generate();


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


  // -----------------------------------------------------------------
  //  Collection NFT
  // -----------------------------------------------------------------
  const { uri: collectionUri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Collection NFT Metadata",
      description: "Collection description",
      image: "https://placekitten.com/200/300",
   })

  // Ref:
  //   The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  //   Type alias CreateNftInput: https://metaplex-foundation.github.io/js/types/js.CreateNftInput.html
  const { nft: collectionNft } = await metaplex
    .nfts()
    .create({
      uri: collectionUri,
      name: "Collection NFT",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(0),
      symbol: "paper",
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet,
      isCollection: true,
      creators: [],
    });

  sleep.sleep(2); // for many requests. wait X sec


  // -----------------------------------------------------------------
  //  Regular(Normal) NFT
  // -----------------------------------------------------------------
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Regular NFT Metadata",
      description: "Regular description",
      image: "https://placekitten.com/200/300",
      symbol: "paper",
   });

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: "Regular NFT",
      symbol: "paper",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      // maxSupply: toBigNumber(1),
      maxSupply: toBigNumber(0),
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet,
      creators: [],
      collection: collectionNft.address,
    });

  sleep.sleep(2); // for many requests. wait X sec


  // -----------------------------------------------------------------
  //  Verify Collection
  // -----------------------------------------------------------------
  // // Ref: https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html#createVerifyCollectionInstruction
  // const transaction = new Transaction();
  // transaction.add(
  //   createVerifyCollectionInstruction({
  //     metadata: nft.metadataAddress, // metadata Metadata account
  //     collectionAuthority: wallet.publicKey, // collectionAuthority Collection Update authority
  //     payer: wallet.publicKey, // payer
  //     collectionMint: collectionNft.address, // collectionMint Mint of the Collection
  //     collection: collectionNft.metadataAddress, // collection Metadata Account of the Collection
  //     collectionMasterEditionAccount: collectionNft.edition.address, // collectionMasterEditionAccount MasterEdition2 Account of the Collection Token
  //   })
  // );
  // connection.sendTransaction(transaction, [wallet]);

  await metaplex
    .nfts()
    .verifyCollection({
      mintAddress: nft.address,
      collectionMintAddress: collectionNft.address
    })

  console.log('\n--- Common ---------------------------------------------------');
  console.log('wallet.publicKey =>', wallet.publicKey.toString());
  
  console.log('\n--- Collection NFT ---------------------------------------------------');
  console.log('uri =>', collectionUri);
  console.log('nft =>', collectionNft);
  console.log('mintAddress =>', collectionNft.address.toString());
  console.log('metadataAddress =>', collectionNft.metadataAddress.toString());
  console.log('edition.address =>', collectionNft.edition.address.toString());

  console.log('\n--- Regular(Normal) NFT ---------------------------------------------------');
  console.log('uri =>', uri);
  console.log('nft =>', nft);
  console.log('mintAddress =>', nft.address.toString());
};

main();

/*
% ts-node src/<THIS FILE>
--- Common ---------------------------------------------------
wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg

--- Collection NFT ---------------------------------------------------
uri => https://arweave.net/-BD4E4Oln266WkExgYOsihfDxu8ER3wU3ShNg0Gwzi4
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: {
    name: 'Collection NFT Metadata',
    description: 'Collection description',
    image: 'https://placekitten.com/100/500'
  },
  jsonLoaded: true,
  name: 'Collection NFT',
  symbol: 'paper',
  uri: 'https://arweave.net/-BD4E4Oln266WkExgYOsihfDxu8ER3wU3ShNg0Gwzi4',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [],
  tokenStandard: 0,
  collection: null,
  collectionDetails: { version: 'V1', size: <BN: 0> },
  uses: null,
  address: PublicKey {
    _bn: <BN: 6787d2d1ec4c612ed15222296e0024e0028f71d0893638e229b87f85d644085b>
  },
  metadataAddress: Pda {
    _bn: <BN: f596f1a56b5cb4f5f484fb39ffa0340cffffbb3a35181e3b99f5c5f480926d32>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 6787d2d1ec4c612ed15222296e0024e0028f71d0893638e229b87f85d644085b>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 8ac9c49bc1ced7b22918cc484bbe081a9897efbbb8cc14e1d647ead467fdd489>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 8ac9c49bc1ced7b22918cc484bbe081a9897efbbb8cc14e1d647ead467fdd489>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'paper', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: f1360132410369d99257d15a90e3a0bb8a5fc532c71b301d5243d8964d8ee55e>,
      bump: 252
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 6787d2d1ec4c612ed15222296e0024e0028f71d0893638e229b87f85d644085b>
    },
    ownerAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
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
      _bn: <BN: 8ac9c49bc1ced7b22918cc484bbe081a9897efbbb8cc14e1d647ead467fdd489>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => 7y97ioeLu46bFJcYdMtpmj7JPr9h7a6qNT66Kur8AtWe
metadataAddress => HXgP8Tpznd9gbWuA1is4WWTVvDYmRvAkAvgXBEGRJq8M
edition.address => ALmi18R9kf5D1vN19AfGjnwvkS6w4UJJwaafWLKTJXj6

--- Regular(Normal) NFT ---------------------------------------------------
uri => https://arweave.net/EkpVVRxQ7qA27FbPUkxb3vPJeJhoDOE09V2RZtsdEgk
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: {
    name: 'Regular NFT Metadata',
    description: 'Regular description',
    image: 'https://placekitten.com/200/300',
    symbol: 'paper'
  },
  jsonLoaded: true,
  name: 'Regular NFT',
  symbol: 'paper',
  uri: 'https://arweave.net/EkpVVRxQ7qA27FbPUkxb3vPJeJhoDOE09V2RZtsdEgk',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [],
  tokenStandard: 0,
  collection: {
    verified: false,
    key: PublicKey {
      _bn: <BN: 6787d2d1ec4c612ed15222296e0024e0028f71d0893638e229b87f85d644085b>
    },
    address: PublicKey {
      _bn: <BN: 6787d2d1ec4c612ed15222296e0024e0028f71d0893638e229b87f85d644085b>
    }
  },
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: e8b75ded08f32a0b8cd4786e5331529618dbdb1112199733278d698001ccbbe7>
  },
  metadataAddress: Pda {
    _bn: <BN: 55d10aacfa56bad65ca2fc855d627899ca04fea746ceab6126c60f5f567de4e0>,
    bump: 248
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: e8b75ded08f32a0b8cd4786e5331529618dbdb1112199733278d698001ccbbe7>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 3fc3b3a55e25a731218e6a8569530a439768494a00e977fee6c9a58d2d12931d>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 3fc3b3a55e25a731218e6a8569530a439768494a00e977fee6c9a58d2d12931d>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'paper', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: fc6b6bc6fe05ba56ae0d886a73713762a6e9a5c3a92ee2ad6db4497be5187261>,
      bump: 255
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: e8b75ded08f32a0b8cd4786e5331529618dbdb1112199733278d698001ccbbe7>
    },
    ownerAddress: PublicKey {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
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
      _bn: <BN: 3fc3b3a55e25a731218e6a8569530a439768494a00e977fee6c9a58d2d12931d>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => GfRksrE4V2vrZ9GQznkDArEpbbe7SL9jeZqRNnjdqdEe
*/