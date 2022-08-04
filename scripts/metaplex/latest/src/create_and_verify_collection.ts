// Ref: https://github.com/metaplex-foundation/js#create
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
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


  // Ref:
  //  bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));
  // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).


  //
  // --- Collection NFT ---
  //
  const { uri: collectionUri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Collection NFT Metadata",
      description: "Collection description",
      image: "https://placekitten.com/100/500",
   })
    .run();

  // Ref:
  //  The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft: collectionNft } = await metaplex
    .nfts()
    .create({
      uri: collectionUri,
      name: "Collection NFT",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: 0,
      symbol: "paper",
      payer: wallet,
      owner: wallet.publicKey,
      updateAuthority: wallet,
      collection: null,
      creators: [{
        address: wallet.publicKey,
        verified: true,
        share: 100,
      }],
    })
    .run();

  sleep.sleep(2); // for many requests. wait X sec


  //
  // --- Regular(Normal) NFT ---
  //
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Regular NFT Metadata",
      description: "Regular description",
      image: "https://placekitten.com/200/300",
      symbol: "paper",
   })
    .run();

  // Ref:
  //  The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: "Regular NFT",
      symbol: "paper",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      // maxSupply: toBigNumber(1),
      maxSupply: 0,
      payer: wallet,
      owner: wallet.publicKey,
      updateAuthority: wallet,
      creators: [{
        address: wallet.publicKey,
        verified: true,
        share: 100,
      }],
      collection: {
        verified: false,
        key: collectionNft.mintAddress,
      },
    })
    .run();

  sleep.sleep(2); // for many requests. wait X sec


  //
  // --- Verify Collection ---
  //
  // Ref: https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html#createVerifyCollectionInstruction
  const transaction = new Transaction();
  transaction.add(
    createVerifyCollectionInstruction({
      metadata: nft.metadataAddress, // metadata Metadata account
      collectionAuthority: wallet.publicKey, // collectionAuthority Collection Update authority
      payer: wallet.publicKey, // payer
      collectionMint: collectionNft.mintAddress, // collectionMint Mint of the Collection
      collection: collectionNft.metadataAddress, // collection Metadata Account of the Collection
      collectionMasterEditionAccount: collectionNft.edition.address, // collectionMasterEditionAccount MasterEdition2 Account of the Collection Token
    })
  );
  connection.sendTransaction(transaction, [wallet]);


  console.log('\n--- Common ---------------------------------------------------');
  console.log('wallet.publicKey =>', wallet.publicKey.toString());
  
  console.log('\n--- Collection NFT ---------------------------------------------------');
  console.log('uri =>', collectionUri);
  console.log('nft =>', collectionNft);
  console.log('mintAddress =>', collectionNft.mintAddress.toString());
  console.log('metadataAddress =>', collectionNft.metadataAddress.toString());
  console.log('edition.address =>', collectionNft.edition.address.toString());

  console.log('\n--- Regular(Normal) NFT ---------------------------------------------------');
  console.log('uri =>', uri);
  console.log('nft =>', nft);
  console.log('mintAddress =>', nft.mintAddress.toString());
};

main();

/*
% ts-node src/<THIS FILE>

--- Common ---------------------------------------------------
wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg

--- Collection NFT ---------------------------------------------------
uri => https://arweave.net/pBplShVvsOPe6PTAqaJDQEwq7ygaAC8Xzght5NykaIk
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 217a5bad461c954c62dde01bff65e8392b901d6d73a39cff2af8313fd93bc9e>,
    bump: 255
  },
  mintAddress: PublicKey {
    _bn: <BN: e045e103829085440ccd6d3620d412904a280fddcc7996c08e67009cc536755c>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  name: 'Collection NFT',
  symbol: 'paper',
  uri: 'https://arweave.net/pBplShVvsOPe6PTAqaJDQEwq7ygaAC8Xzght5NykaIk',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: null,
  uses: null,
  json: {
    name: 'Collection NFT Metadata',
    description: 'Collection description',
    image: 'https://placekitten.com/100/500'
  },
  metadataAddress: Pda {
    _bn: <BN: 217a5bad461c954c62dde01bff65e8392b901d6d73a39cff2af8313fd93bc9e>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: e045e103829085440ccd6d3620d412904a280fddcc7996c08e67009cc536755c>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 2c1deb8d8e1cd9ecb8fe75fd9026500249d100fd458ac7d4eca12f6df7bfe2d3>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 2c1deb8d8e1cd9ecb8fe75fd9026500249d100fd458ac7d4eca12f6df7bfe2d3>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 2c1deb8d8e1cd9ecb8fe75fd9026500249d100fd458ac7d4eca12f6df7bfe2d3>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => G6U8HY1QxNeEVkA7ZygjNYCLqPJnwrpJGsFWp9m3tsKh
metadataAddress => 9AjJEPmpzCJUrKTX1FPaF7BX4BZuksYxMYDD92pvi9s
edition.address => 3yDQDKkUUopj73szxqz4jhrdyCXmoxJhcHTsJkFYham8

--- Regular(Normal) NFT ---------------------------------------------------
uri => https://arweave.net/kc_aCcGtzVaNbJcj9Irrg3piCqt6A-s32u_-ghLuJq8
nft => {
  model: 'nft',
  lazy: false,
  address: Pda {
    _bn: <BN: 588d99fc20b1431da316c6f53d8f5564e542d1651595365dbb1c8cf01a88a9a3>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: ffd93d00e4095fcce3af0ef731b4c19c20ead07b6c5dcec9870087bba596ff5>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  name: 'Regular NFT',
  symbol: 'paper',
  uri: 'https://arweave.net/kc_aCcGtzVaNbJcj9Irrg3piCqt6A-s32u_-ghLuJq8',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: {
    verified: false,
    key: PublicKey {
      _bn: <BN: e045e103829085440ccd6d3620d412904a280fddcc7996c08e67009cc536755c>
    }
  },
  uses: null,
  json: {
    name: 'Regular NFT Metadata',
    description: 'Regular description',
    image: 'https://placekitten.com/200/300',
    symbol: 'paper'
  },
  metadataAddress: Pda {
    _bn: <BN: 588d99fc20b1431da316c6f53d8f5564e542d1651595365dbb1c8cf01a88a9a3>,
    bump: 254
  },
  mint: {
    model: 'mint',
    address: PublicKey {
      _bn: <BN: ffd93d00e4095fcce3af0ef731b4c19c20ead07b6c5dcec9870087bba596ff5>
    },
    mintAuthorityAddress: PublicKey {
      _bn: <BN: 4d33620c35b00f53131d0d73a0523e50a5e30dfae1b737df3c8511c05621b5ac>
    },
    freezeAuthorityAddress: PublicKey {
      _bn: <BN: 4d33620c35b00f53131d0d73a0523e50a5e30dfae1b737df3c8511c05621b5ac>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda {
      _bn: <BN: 4d33620c35b00f53131d0d73a0523e50a5e30dfae1b737df3c8511c05621b5ac>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 0>
  }
}
mintAddress => 25RP5LN4MrRiFMxRTYYFagJXbTavLPnfkZNZ2ELdEKec
*/