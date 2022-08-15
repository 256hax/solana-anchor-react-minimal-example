import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Guess } from "../target/types/guess";
import { Connection, clusterApiUrl, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { assert, expect } from 'chai';
import { initializeWallets } from '../app/modules/initializeWallets';
import { createNfts } from '../app/modules/createNfts';
import { mintNfts } from '../app/modules/mintNfts';

import { initializeWallets as mockInitializeWallets } from '../app/modules/mock/initializeWallets';
import { createNfts as mockCreateNfts } from '../app/modules/mock/createNfts';
import { mintNfts as mockMintNfts } from '../app/modules/mock/mintNfts';

describe("Guess the number", () => {
  // --- Anchor Settings ---
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.Guess as Program<Guess>;
  let metaplex;

  let payer: Keypair = provider.wallet.payer;
  let taker1: Keypair; // BBCkTVFxZbLPar5YpjqBzymPkcZvT7RMuDK59bbaPTd4
  let taker2: Keypair; // DD83TEq47JeMKKrJqQWzabVmYkQfsof8CHsybQtGJvpo
  // let hackerWallet: Keypair; TODO

  let nft1: PublicKey;
  let nft2: PublicKey;

  it("Initialize wallets", async () => {
    [taker1, taker2] = await initializeWallets(connection);

    // [Localnet]
    await mockInitializeWallets(connection, taker1, taker2);

    const payerBalance = await connection.getBalance(payer.publicKey);
    const taker1Balance = await connection.getBalance(taker1.publicKey);
    const taker2Balance = await connection.getBalance(taker2.publicKey);

    assert.isAtLeast(payerBalance, LAMPORTS_PER_SOL);
    assert.isAtLeast(taker1Balance, LAMPORTS_PER_SOL);
    assert.isAtLeast(taker2Balance, LAMPORTS_PER_SOL);

    console.log('payer =>', payer.publicKey.toString());
    console.log('taker1 =>', taker1.publicKey.toString());
    console.log('taker2 =>', taker2.publicKey.toString());
  });
  


  //--------------------------------------------------
  // Set NFTs by payer
  //--------------------------------------------------
  
  it("Create NFTs", async () => {
    // // [Devnet]
    // // --- Metaplex Settings ---
    // const connectionMetaplex = new Connection(clusterApiUrl("devnet"));
    // metaplex = Metaplex.make(connectionMetaplex)
    //   .use(keypairIdentity(payer))
    //   // .use(bundlrStorage({
    //   //     address: 'https://devnet.bundlr.network',
    //   //     providerUrl: 'https://api.devnet.solana.com',
    //   //     timeout: 60000,
    //   // }));
    //   .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

    // const [uri1, _nft1, uri2, _nft2] = await createNfts(metaplex);
    // nft1 = _nft1.address;
    // nft2 = _nft2.address;

    // [Localnet]
    const [uri1, _nft1, uri2, _nft2] = await mockCreateNfts(connection, payer);
    nft1 = new PublicKey(_nft1);
    nft2 = new PublicKey(_nft2);

    console.log('uri1 =>', uri1);
    console.log('Mint Address1 =>', nft1.toString());
    console.log('uri2 =>', uri2);
    console.log('Mint Address2 =>', nft2.toString());
  });

  // it("Set reward", async () => {
  //   // TODO: Set and lock reward in Rust
  // });
 


  //--------------------------------------------------
  // Actions for NFT by taker
  //--------------------------------------------------

  it("Mint NFTs by taker", async () => {
    // // [Devnet] Stub
    // nft1 = new PublicKey('6rR9KWvY17aQXv1c1TveYrUHPqy53hKE3ZoKXh8QLTwF');
    // nft2 = new PublicKey('DAJRyGCbjR2Tv8BP8WVqfRTm8TA891ZpjbFb8gkehiW2');

    // // [Devnet]
    // const signatureNft1 = await mintNfts(connection, payer, taker1.publicKey, nft1);
    // const signatureNft2 = await mintNfts(connection, payer, taker2.publicKey, nft2);

    // [Localnet]
    const signatureNft1 = await mockMintNfts(connection, payer, taker1.publicKey, nft1);
    const signatureNft2 = await mockMintNfts(connection, payer, taker2.publicKey, nft2);
    
    console.log('signatureNft1 =>', signatureNft1);
    console.log('signatureNft2 =>', signatureNft2);
  });

  it("Set an answer by takers", async () => {
    // Change set authority from taker to payer (JS)
  });



  //--------------------------------------------------
  // Announcement by payer
  //--------------------------------------------------

  // it("Reveal correct an NFT by payer", async () => {
  // });
  
  it("Calculate and security check", async () => {
    // - Find correct answer using Metaplex JS(findByMint)
    // - Security check using Metaplex JS(owerner == payer)
  });
  
  it("Transfer reward to winner by program", async () => {
    // using Rust
  });



  //--------------------------------------------------
  // Close by payer
  //--------------------------------------------------

  it("Burn all of taker's NFT", async () => {
  });

  it("Close PDA", async () => {
  });
});