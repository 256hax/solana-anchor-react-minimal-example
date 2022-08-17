import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Guess } from "../target/types/guess";
import { Connection, clusterApiUrl, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { assert, expect } from 'chai';

import { initializeWallets } from '../app/modules/initializeWallets';
import { createNfts } from '../app/modules/createNfts';
import { mintNfts } from '../app/modules/mintNfts';
import { setAnswer } from '../app/modules/setAnswer';

// --- [Localnet(Mock)] ---
import { initializeWallets as mockInitializeWallets } from '../app/modules/mock/initializeWallets';
import { createNfts as mockCreateNfts } from '../app/modules/mock/createNfts';
import { mintNfts as mockMintNfts } from '../app/modules/mock/mintNfts';
import { createPda as mockCreatePda } from '../app/modules/mock/createPda';
import { updateToOriginalOwner as mockUpdateToOriginalOwner } from '../app/modules/mock/updateToOriginalOwner';
import { setAuthorityEscrow as mockSetAuthorityEscrow } from '../app/modules/mock/setAuthorityEscrow';
import { revealNft as mockRevealNft } from '../app/modules/mock/revealNft';


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
  // let hackerWallet: Keypair; // TODO

  let nftQ: PublicKey;
  let nft1: PublicKey;
  let nft2: PublicKey;
  let nftQMetadata: any;

  const pdaSeed = 'user-answers';

  it("Initialize wallets", async () => {
    [taker1, taker2] = await initializeWallets(connection);

    // [Localnet(Mock)]
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

    // [Localnet(Mock)]
    const [uriQ, _nftQ, uri1, _nft1, uri2, _nft2] = await mockCreateNfts(connection, payer);
    nftQ = new PublicKey(_nftQ);
    nft1 = new PublicKey(_nft1);
    nft2 = new PublicKey(_nft2);

    assert(nftQ != null);
    assert(nft1 != null);
    assert(nft2 != null);

    console.log('Mint AddressQ =>', nftQ.toString());
    console.log('Mint Address1 =>', nft1.toString());
    console.log('Mint Address2 =>', nft2.toString());
  });


  //--------------------------------------------------
  // Actions for NFT by taker
  //--------------------------------------------------
  it("Mint NFTs by payer/takers", async () => {
    // // [Devnet] Stub
    // nft1 = new PublicKey('6rR9KWvY17aQXv1c1TveYrUHPqy53hKE3ZoKXh8QLTwF');
    // nft2 = new PublicKey('DAJRyGCbjR2Tv8BP8WVqfRTm8TA891ZpjbFb8gkehiW2');

    // // [Devnet]
    // const signatureNft1 = await mintNfts(connection, payer, taker1.publicKey, nft1);
    // const signatureNft2 = await mintNfts(connection, payer, taker2.publicKey, nft2);

    // [Localnet(Mock)]
    const signatureNftQ = await mockMintNfts(connection, payer, payer.publicKey, nftQ);
    const signatureNft1 = await mockMintNfts(connection, payer, taker1.publicKey, nft1);
    const signatureNft2 = await mockMintNfts(connection, payer, taker2.publicKey, nft2);

    assert(signatureNftQ != null);
    assert(signatureNft1 != null);
    assert(signatureNft2 != null);

    console.log('signatureNftQ =>', signatureNftQ);
    console.log('signatureNft1 =>', signatureNft1);
    console.log('signatureNft2 =>', signatureNft2);
  });

  it("Create PDA for answer by takers", async () => {
    const [signatureTaker1, fetchUserAnswersTaker1, tokenAccountTaker1] = await mockCreatePda(
      connection,
      program,
      taker1,
      nft1,
      pdaSeed,
    );
    const [signatureTaker2, fetchUserAnswersTaker2, tokenAccountTaker2] = await mockCreatePda(
      connection,
      program,
      taker2,
      nft2,
      pdaSeed,
    );

    assert.equal(
      fetchUserAnswersTaker1.tokenAccount.toString(),
      tokenAccountTaker1.address.toString(),
    );

    console.log('signatureTaker1 =>', signatureTaker1);
    console.log('AnswersPdaTaker1.answer =>', fetchUserAnswersTaker1.answer);
    console.log('signatureTaker2 =>', signatureTaker2);
    console.log('AnswersPdaTaker2.answer =>', fetchUserAnswersTaker2.answer);
  });

  it("Update NFT to original owner by payer", async () => {
    const nft = await mockUpdateToOriginalOwner(
      connection,
      taker1.publicKey,
      nft1,
      payer,
    );
  });

  it("Set Authority for Token Account(NFT) by takers", async () => {
    const [signatureTaker1, tokenAccountInfoTaker1] = await mockSetAuthorityEscrow(
      connection,
      program,
      taker1,
      nft1,
      payer.publicKey,
      pdaSeed,
    );
    const [signatureTaker2, tokenAccountInfoTaker2] = await mockSetAuthorityEscrow(
      connection,
      program,
      taker2,
      nft2,
      payer.publicKey,
      pdaSeed,
    );

    assert.equal(
      tokenAccountInfoTaker1.owner.toString(),
      payer.publicKey.toString(),
    );

    console.log('signatureTaker1 =>', signatureTaker1);
    console.log('tokenAccountInfoTaker1.owner =>', tokenAccountInfoTaker1.owner.toString());
    console.log('signatureTaker2 =>', signatureTaker2);
    console.log('tokenAccountInfoTaker2.owner =>', tokenAccountInfoTaker2.owner.toString());
  });


  // //--------------------------------------------------
  // // Announcement by payer
  // //--------------------------------------------------
  // it("Reveal correct an NFT by payer", async () => {
  //   const [signature, nftQName, nftQPrize] = mockRevealNft();

  //   assert.equal(nftQName, 'Number 1');
  //   assert.equal(nftQPrize, 0.01);

  //   console.log('signature =>', signature);
  // });
  
  // it("Calculate and security check", async () => {
  // });
  
  // it("Transfer reward to winner by program", async () => {
  // });


  // //--------------------------------------------------
  // // Close by payer
  // //--------------------------------------------------
  // it("Burn all of taker's NFT", async () => {
  // });

  // it("Close PDA", async () => {
  // });
});