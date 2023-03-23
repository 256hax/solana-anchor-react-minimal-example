// Ref: https://github.com/metaplex-foundation/js#create
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  mockStorage,
  toBigNumber,
  OperationOptions,
} from '@metaplex-foundation/js';
import * as fs from 'fs';
import { sleep } from 'sleep';

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);

  const operationOptions: OperationOptions = {
    commitment: 'finalized',
  };

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  // const airdropSignature = await connection.requestAirdrop(
  //   wallet.publicKey,
  //   LAMPORTS_PER_SOL,
  // );

  // const latestBlockHash = await connection.getLatestBlockhash();

  // await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature: airdropSignature,
  // });

  // sleep(5); // Wait for airdrop confirmation.

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  if (balance >= LAMPORTS_PER_SOL) {
    console.log('wallet balance =>', balance);
  } else {
    throw Error('Failed to airdrop. Adjust sleep time, use custom RPC or your wallet.');
  }

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
  // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  // ------------------------------------
  //  Collection NFT
  // ------------------------------------
  const { uri: collectionUri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Collection NFT Metadata",
      description: "Collection description",
      image: "https://placekitten.com/200/300",
    });

  // Ref:
  //   The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  //   Type alias CreateNftInput: https://metaplex-foundation.github.io/js/types/js.CreateNftInput.html
  const { nft: collectionNft } = await metaplex
    .nfts()
    .create(
      {
        uri: collectionUri,
        name: 'Collection NFT',
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        maxSupply: toBigNumber(0),
        symbol: 'paper',
        tokenOwner: wallet.publicKey,
        updateAuthority: wallet,
        isCollection: true,
        creators: [],
      },
      operationOptions
    );

  sleep(3); // Avoid for many requests.

  // ------------------------------------
  //  Normal NFT
  // ------------------------------------
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Normarl NFT Metadata",
      description: "Normal description",
      image: "https://placekitten.com/200/300",
      symbol: "paper",
    });

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create(
      {
        uri: uri,
        name: "Normarl NFT",
        symbol: "paper",
        sellerFeeBasisPoints: 500, // Represents 5.00%.
        // maxSupply: toBigNumber(1),
        maxSupply: toBigNumber(0),
        tokenOwner: wallet.publicKey,
        updateAuthority: wallet,
        creators: [],
        collection: collectionNft.address,
      },
      operationOptions
    );

  sleep(3); // Avoid for many requests.

  // ------------------------------------
  //  Create Verify Collection Instruction
  // ------------------------------------
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
    });

  console.log('\n--- Common ---------------------------------------------------');
  console.log('wallet.publicKey =>', wallet.publicKey.toString());

  console.log('\n--- Collection NFT ---------------------------------------------------');
  console.log('uri =>', collectionUri);
  console.log('nft =>', collectionNft);
  console.log('mintAddress =>', collectionNft.address.toString());
  console.log('metadataAddress =>', collectionNft.metadataAddress.toString());
  console.log('edition.address =>', collectionNft.edition.address.toString());

  console.log('\n--- Normal NFT ---------------------------------------------------');
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
uri => https://arweave.net/fZPbwCpCPDgMTOAf6hI15JI5Y6X9NIT5Zn7p0QVzp-Y
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
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
  uri: 'https://arweave.net/fZPbwCpCPDgMTOAf6hI15JI5Y6X9NIT5Zn7p0QVzp-Y',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [],
  tokenStandard: 0,
  collection: null,
  collectionDetails: { version: 'V1', size: <BN: 0> },
  uses: null,
  programmableConfig: null,
  address: PublicKey [PublicKey(6KLTpNHgtH6vGLcP1CXqMh2ZDBkvgXKAjnH4TMTMQMpU)] {
    _bn: <BN: 4efce535c49b502ce54522477bd0a062fb229a5548361230fa50eea07cb387a9>
  },
  metadataAddress: Pda [PublicKey(Ckeiezx6UrXBK9mRrgCRf4AWLvhDdPXeHc1wXEz3eUZ3)] {
    _bn: <BN: ae9f2dd7efc5daf523be63fb0dc79b1cc39c8c1956369c01af5082d860353ad6>,
    bump: 252
  },
  mint: {
    model: 'mint',
    address: PublicKey [PublicKey(6KLTpNHgtH6vGLcP1CXqMh2ZDBkvgXKAjnH4TMTMQMpU)] {
      _bn: <BN: 4efce535c49b502ce54522477bd0a062fb229a5548361230fa50eea07cb387a9>
    },
    mintAuthorityAddress: PublicKey [PublicKey(5AzrHQ3YvLwKLc2c9GZhniQJ3S4gS4w2H8VF6rm8iGXC)] {
      _bn: <BN: 3dfe62c74d20bd7e2acf95edaa6c8c25f15a9a768954b5bced4353a173c0a80b>
    },
    freezeAuthorityAddress: PublicKey [PublicKey(5AzrHQ3YvLwKLc2c9GZhniQJ3S4gS4w2H8VF6rm8iGXC)] {
      _bn: <BN: 3dfe62c74d20bd7e2acf95edaa6c8c25f15a9a768954b5bced4353a173c0a80b>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'paper', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda [PublicKey(3kFaxUYCDfFDXaFv278tRoSjZFquXmBAVYXj8HvYDpFt)] {
      _bn: <BN: 28cbd72919780bb79d768a47f53bc00768410f4b2509fcc5380a79af9b00056b>,
      bump: 250
    },
    isAssociatedToken: true,
    mintAddress: PublicKey [PublicKey(6KLTpNHgtH6vGLcP1CXqMh2ZDBkvgXKAjnH4TMTMQMpU)] {
      _bn: <BN: 4efce535c49b502ce54522477bd0a062fb229a5548361230fa50eea07cb387a9>
    },
    ownerAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
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
    address: Pda [PublicKey(5AzrHQ3YvLwKLc2c9GZhniQJ3S4gS4w2H8VF6rm8iGXC)] {
      _bn: <BN: 3dfe62c74d20bd7e2acf95edaa6c8c25f15a9a768954b5bced4353a173c0a80b>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => 6KLTpNHgtH6vGLcP1CXqMh2ZDBkvgXKAjnH4TMTMQMpU
metadataAddress => Ckeiezx6UrXBK9mRrgCRf4AWLvhDdPXeHc1wXEz3eUZ3
edition.address => 5AzrHQ3YvLwKLc2c9GZhniQJ3S4gS4w2H8VF6rm8iGXC

--- Normal NFT ---------------------------------------------------
uri => https://arweave.net/6faRR7Xv01xjkA9JHV4gviGJDsrEM4g_dYTR_cXdNC8
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: {
    name: 'Normarl NFT Metadata',
    description: 'Normal description',
    image: 'https://placekitten.com/200/300',
    symbol: 'paper'
  },
  jsonLoaded: true,
  name: 'Normarl NFT',
  symbol: 'paper',
  uri: 'https://arweave.net/6faRR7Xv01xjkA9JHV4gviGJDsrEM4g_dYTR_cXdNC8',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 254,
  creators: [],
  tokenStandard: 0,
  collection: {
    verified: false,
    key: PublicKey [PublicKey(6KLTpNHgtH6vGLcP1CXqMh2ZDBkvgXKAjnH4TMTMQMpU)] {
      _bn: <BN: 4efce535c49b502ce54522477bd0a062fb229a5548361230fa50eea07cb387a9>
    },
    address: PublicKey [PublicKey(6KLTpNHgtH6vGLcP1CXqMh2ZDBkvgXKAjnH4TMTMQMpU)] {
      _bn: <BN: 4efce535c49b502ce54522477bd0a062fb229a5548361230fa50eea07cb387a9>
    }
  },
  collectionDetails: null,
  uses: null,
  programmableConfig: null,
  address: PublicKey [PublicKey(62gxjhEaB17EVNKU6UcR27XCqovsXTYfxWaGtpdzTYBs)] {
    _bn: <BN: 4ab9330f3043c068e784e002d15bf22cb38d09a7c5c6fedba4abf8c5c45aa732>
  },
  metadataAddress: Pda [PublicKey(AgE7Xgfjh1d46TUHKZfwEkSmoyo1xe7vEpfsmxaHRszb)] {
    _bn: <BN: 8fc5a90ac7bbf9badc2fc8d922cb9a1ca3de9a825e57d1f6132530a4bb34d434>,
    bump: 252
  },
  mint: {
    model: 'mint',
    address: PublicKey [PublicKey(62gxjhEaB17EVNKU6UcR27XCqovsXTYfxWaGtpdzTYBs)] {
      _bn: <BN: 4ab9330f3043c068e784e002d15bf22cb38d09a7c5c6fedba4abf8c5c45aa732>
    },
    mintAuthorityAddress: PublicKey [PublicKey(FGWG4qLeDMrxtad5F6uW3JUVMUvyfAvWuFU88iZE8tmL)] {
      _bn: <BN: d3fc69c8e129e28012e8691b60c789140851bfbeb942495d8e2e90ce030e53df>
    },
    freezeAuthorityAddress: PublicKey [PublicKey(FGWG4qLeDMrxtad5F6uW3JUVMUvyfAvWuFU88iZE8tmL)] {
      _bn: <BN: d3fc69c8e129e28012e8691b60c789140851bfbeb942495d8e2e90ce030e53df>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'paper', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda [PublicKey(ADrdNvn7yqKTSR1HqB2NNtuoduazwS1GuQvd6hTLaP52)] {
      _bn: <BN: 890444057f488522b116691946cb10e505eb41a09e53c1b30744c941f654ec19>,
      bump: 255
    },
    isAssociatedToken: true,
    mintAddress: PublicKey [PublicKey(62gxjhEaB17EVNKU6UcR27XCqovsXTYfxWaGtpdzTYBs)] {
      _bn: <BN: 4ab9330f3043c068e784e002d15bf22cb38d09a7c5c6fedba4abf8c5c45aa732>
    },
    ownerAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
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
    address: Pda [PublicKey(FGWG4qLeDMrxtad5F6uW3JUVMUvyfAvWuFU88iZE8tmL)] {
      _bn: <BN: d3fc69c8e129e28012e8691b60c789140851bfbeb942495d8e2e90ce030e53df>,
      bump: 254
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => 62gxjhEaB17EVNKU6UcR27XCqovsXTYfxWaGtpdzTYBs
*/