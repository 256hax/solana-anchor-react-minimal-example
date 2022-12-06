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
  //  Create Verify Collection Instruction
  // -----------------------------------------------------------------
  // Ref: https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html#createVerifyCollectionInstruction
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

  // Ref:
  //  Verifying NFTs in Collections: https://docs.metaplex.com/programs/token-metadata/certified-collections#verifying-nfts-in-collections
  //  API References: https://metaplex-foundation.github.io/js/classes/js.NftClient.html#verifyCollection
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
uri => https://arweave.net/AmOcnk2_T0Z_8yHtk29J9Fb42ZDMUMAa5pwTHZLrtdU
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: {
    name: 'Collection NFT Metadata',
    description: 'Collection description',
    image: 'https://placekitten.com/200/300'
  },
  jsonLoaded: true,
  name: 'Collection NFT',
  symbol: 'paper',
  uri: 'https://arweave.net/AmOcnk2_T0Z_8yHtk29J9Fb42ZDMUMAa5pwTHZLrtdU',
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
    _bn: <BN: 4ac986dfcfe4ee38faa79dd399ccf3cb47705d2cd4b48eb0567d80a4245df9df>
  },
  metadataAddress: Pda {
    _bn: <BN: f52fa2c90fc4c4c5ee19d064d592f1ee38e02b2fd49a6c8b54e0ec7b40c38ade>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 4ac986dfcfe4ee38faa79dd399ccf3cb47705d2cd4b48eb0567d80a4245df9df>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: d8c68246aba464c3e36eb49f28bcca42bc87c10e850947f2dade6ca45ce8d093>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: d8c68246aba464c3e36eb49f28bcca42bc87c10e850947f2dade6ca45ce8d093>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'paper', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: 844e5a76de09376f118ccb0d88f38a18b4b2ea6c621d637c49762460cae81fbe>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 4ac986dfcfe4ee38faa79dd399ccf3cb47705d2cd4b48eb0567d80a4245df9df>
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
      _bn: <BN: d8c68246aba464c3e36eb49f28bcca42bc87c10e850947f2dade6ca45ce8d093>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => 62wQFymZsn1s5hZrgZX8rGBWmWUibTNAqMu9X7HGo7iW
metadataAddress => HW71th2Vp849MexBqFJe1WobwgeShmn2WGQd1A2uJSCM
edition.address => FbCdFTERmPbqx673c9s1KcfaH1X31XxoYVjtgvMmmoAr

--- Regular(Normal) NFT ---------------------------------------------------
uri => https://arweave.net/7keuJVrwU_pqBrfmmlA_R2RabdKCzcWzcMaeuRRItrE
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
  uri: 'https://arweave.net/7keuJVrwU_pqBrfmmlA_R2RabdKCzcWzcMaeuRRItrE',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [],
  tokenStandard: 0,
  collection: {
    verified: false,
    key: PublicKey {
      _bn: <BN: 4ac986dfcfe4ee38faa79dd399ccf3cb47705d2cd4b48eb0567d80a4245df9df>
    },
    address: PublicKey {
      _bn: <BN: 4ac986dfcfe4ee38faa79dd399ccf3cb47705d2cd4b48eb0567d80a4245df9df>
    }
  },
  collectionDetails: null,
  uses: null,
  address: PublicKey {
    _bn: <BN: 134b0473c36efe462a8725a57f29c71cb39439b4b48795b20e2b5bb22722790c>
  },
  metadataAddress: Pda {
    _bn: <BN: 2e15fbe993d759c0bde8dbff4ca985783315e0a18e7a149d1cff0052a845b504>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: 134b0473c36efe462a8725a57f29c71cb39439b4b48795b20e2b5bb22722790c>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 191d68972b497ee8c5e1c416402d123a36392b4ceffc04617b0c5044dace0e1e>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 191d68972b497ee8c5e1c416402d123a36392b4ceffc04617b0c5044dace0e1e>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'paper', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda {
      _bn: <BN: f0d38d4f342d7e4fe0d6e504ff0a791c46953a8276e2b03032a6e28e6b44d4ea>,
      bump: 254
    },
    isAssociatedToken: true,
    mintAddress: PublicKey {
      _bn: <BN: 134b0473c36efe462a8725a57f29c71cb39439b4b48795b20e2b5bb22722790c>
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
      _bn: <BN: 191d68972b497ee8c5e1c416402d123a36392b4ceffc04617b0c5044dace0e1e>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => 2JK6LYxTHx9SgEmc4KnAZBWKR8mP8yeiuTDtdqCVBXMV
*/