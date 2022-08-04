// Ref: https://github.com/metaplex-foundation/js#create
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toBigNumber } from "@metaplex-foundation/js";
import { createVerifyCollectionInstruction, SetAndVerifyCollectionStruct, setAndVerifySizedCollectionItemInstructionDiscriminator, VerifyCollectionInstructionAccounts, VerifyCollectionStruct } from "@metaplex-foundation/mpl-token-metadata";
import * as fs from 'fs';

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


  // --- Collection NFT ---
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
      creators: [{
        address: wallet.publicKey,
        verified: true,
        share: 100,
      }],
    })
    .run();


  // --- Regular(Normal) NFT ---
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


  // --- Verify Collection ---
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