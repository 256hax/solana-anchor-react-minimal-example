import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Guess } from "../target/types/guess";
import { Connection, clusterApiUrl, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { assert, expect } from 'chai';

import { initializeWallets } from '../app/modules/initializeWallets';
import { createNfts } from '../app/modules/createNfts';
import { mintNfts } from '../app/modules/mintNfts';
import { createPda } from '../app/modules/createPda';
import { updateToOriginalOwner } from '../app/modules/updateToOriginalOwner';
import { setAuthorityEscrow } from '../app/modules/setAuthorityEscrow';

// --- [Localnet(Mock)] ---
import { airdrop as mockAirdrop } from '../app/modules/mock/airdrop';
import { createNfts as mockCreateNfts } from '../app/modules/mock/createNfts';
import { mintNfts as mockMintNfts } from '../app/modules/mock/mintNfts';
import { createPda as mockCreatePda } from '../app/modules/mock/createPda';
import { updateToOriginalOwner as mockUpdateToOriginalOwner } from '../app/modules/mock/updateToOriginalOwner';
import { revealNft as mockRevealNft } from '../app/modules/mock/revealNft';


describe("Guess the number", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.Guess as Program<Guess>;
  let metaplex: Metaplex;

  let payer: Keypair = provider.wallet.payer;
  let taker1: Keypair; // BBCkTVFxZbLPar5YpjqBzymPkcZvT7RMuDK59bbaPTd4
  let taker2: Keypair; // DD83TEq47JeMKKrJqQWzabVmYkQfsof8CHsybQtGJvpo
  // let hacker: Keypair; // TODO

  let nftQ: PublicKey;
  let nft1: PublicKey;
  let nft2: PublicKey;

  const pdaSeed = 'user-answers';

  it("Initialize wallets", async () => {
    const taker1SecretKeyPath = './app/assets/keys/taker1.key.json';
    const taker2SecretKeyPath = './app/assets/keys/taker2.key.json';
    taker1 = await initializeWallets(taker1SecretKeyPath);
    taker2 = await initializeWallets(taker2SecretKeyPath);

    // [Localnet(Mock)]
    // await mockAirdrop(connection, taker1.publicKey);
    // await mockAirdrop(connection, taker2.publicKey);

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
    const connectionMetaplex = new Connection(clusterApiUrl("devnet"));
    metaplex = Metaplex.make(connectionMetaplex)
      .use(keypairIdentity(payer))
      // [Devnet]
      .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: 'https://api.devnet.solana.com',
          timeout: 60000,
      }));
      // [Localnet(Mock)]
      // .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

    const metadataQ = {
      name: 'Q',
      description: 'This is secret Q!',
      filePath: './app/assets/images/question.png',
      fileName: 'question.png'
    };

    const metadata1 = {
      name: 'Number 1',
      description: 'This is 1!',
      filePath: './app/assets/images/number_1.png',
      fileName: 'number_1.png'
    };

    const metadata2 = {
      name: 'Number 2',
      description: 'This is 2!',
      filePath: './app/assets/images/number_2.png',
      fileName: 'number_2.png'
    };


    // [Devnet]
    // nftQ = await createNfts(metaplex, metadataQ);
    nft1 = await createNfts(metaplex, metadata1);
    // nft2 = await createNfts(metaplex, metadata2);

    // [Localnet(Mock)]
    // nftQ = await mockCreateNfts(connection, payer);
    // nft1 = await mockCreateNfts(connection, payer);
    // nft2 = await mockCreateNfts(connection, payer);

    // assert(nftQ != null);
    assert(nft1 != null);
    // assert(nft2 != null);

    // console.log('Mint AddressQ =>', nftQ.toString());
    console.log('Mint Address1 =>', nft1.toString());
    // console.log('Mint Address2 =>', nft2.toString());
  });


  // //--------------------------------------------------
  // // Actions for NFT by taker
  // //--------------------------------------------------
  it("Mint NFTs by payer/takers", async () => {
    // [Devnet] Stub
    // nftQ = new PublicKey('CSfsbjH5ZuXbRwAiJMPvZ64NeCEbKcqS3b3mofQyx9Ti');
    // nft1 = new PublicKey('32C56CDq2M5mKTPcjn67YnSMphocuiWztBsVjWUneH1K');
    // nft2 = new PublicKey('Cw77bJj4Z6ugrgRuEHBvhFMAnAygeEYWGEnZ1CznR4ba');

    // [Devnet]
    // const signatureNftQ = await mintNfts(connection, payer, payer.publicKey, nftQ);
    const signatureNft1 = await mintNfts(connection, payer, taker1.publicKey, nft1);
    // const signatureNft2 = await mintNfts(connection, payer, taker2.publicKey, nft2);

    // [Localnet(Mock)]
    // const signatureNftQ = await mockMintNfts(connection, payer, payer.publicKey, nftQ);
    // const signatureNft1 = await mockMintNfts(connection, payer, taker1.publicKey, nft1);
    // const signatureNft2 = await mockMintNfts(connection, payer, taker2.publicKey, nft2);

    // assert(signatureNftQ != null);
    assert(signatureNft1 != null);
    // assert(signatureNft2 != null);

    // console.log('signatureNftQ =>', signatureNftQ);
    console.log('signatureNft1 =>', signatureNft1);
    // console.log('signatureNft2 =>', signatureNft2);
  });

  it("Create PDA for answer by takers", async () => {
    // [Devnet]
    const [signatureTaker1, fetchUserAnswersTaker1, tokenAccountTaker1] = await createPda(
      metaplex,
      connection,
      program,
      taker1,
      nft1,
      pdaSeed,
    );
    // const [signatureTaker2, fetchUserAnswersTaker2, tokenAccountTaker2] = await createPda(
    //   metaplex,
    //   connection,
    //   program,
    //   taker2,
    //   nft2,
    //   pdaSeed,
    // );

    // [Localnet(Mock)]
    // const [signatureTaker1, fetchUserAnswersTaker1, tokenAccountTaker1] = await mockCreatePda(
    //   connection,
    //   program,
    //   taker1,
    //   nft1,
    //   pdaSeed,
    // );
    // const [signatureTaker2, fetchUserAnswersTaker2, tokenAccountTaker2] = await mockCreatePda(
    //   connection,
    //   program,
    //   taker2,
    //   nft2,
    //   pdaSeed,
    // );

    assert.equal(
      fetchUserAnswersTaker1.tokenAccount.toString(),
      tokenAccountTaker1.address.toString(),
    );

    console.log('signatureTaker1 =>', signatureTaker1);
    console.log('AnswersPdaTaker1.answer =>', fetchUserAnswersTaker1.answer);
    // console.log('signatureTaker2 =>', signatureTaker2);
    // console.log('AnswersPdaTaker2.answer =>', fetchUserAnswersTaker2.answer);
  });

  it("Update NFT to original owner by payer", async () => {
    // [Devnet]
    const taker1OriginalOwner = await updateToOriginalOwner(
      metaplex,
      taker1.publicKey,
      nft1,
    );

    // [Locanet(Mock)]
    // const taker1OriginalOwner = await mockUpdateToOriginalOwner(
    //   taker1.publicKey,
    //   nft1,
    //   payer,
    // );
    // const taker2OriginalOwner = await mockUpdateToOriginalOwner(
    //   taker2.publicKey,
    //   nft2,
    //   payer,
    // );

    assert.equal(taker1OriginalOwner.toString(), taker1.publicKey.toString());
    // assert.equal(taker2OriginalOwner.toString(), taker2.publicKey.toString());
  });

  it("Set Authority for Token Account(NFT) by takers", async () => {
    // [Devnet] and [Locanet(Mock)]
    const [signatureTaker1, tokenAccountInfoTaker1] = await setAuthorityEscrow(
      connection,
      program,
      taker1,
      nft1,
      payer.publicKey,
      pdaSeed,
    );
    // const [signatureTaker2, tokenAccountInfoTaker2] = await setAuthorityEscrow(
    //   connection,
    //   program,
    //   taker2,
    //   nft2,
    //   payer.publicKey,
    //   pdaSeed,
    // );

    assert.equal(
      tokenAccountInfoTaker1.owner.toString(),
      payer.publicKey.toString(),
    );

    console.log('signatureTaker1 =>', signatureTaker1);
    console.log('tokenAccountInfoTaker1.owner =>', tokenAccountInfoTaker1.owner.toString());
    // console.log('signatureTaker2 =>', signatureTaker2);
    // console.log('tokenAccountInfoTaker2.owner =>', tokenAccountInfoTaker2.owner.toString());
  });


  //--------------------------------------------------
  // Announcement by payer
  //--------------------------------------------------
  it("Reveal correct an NFT by payer", async () => {
    // [Localnet(Mock)]
    // const [signature, nftQName, nftQPrize] = mockRevealNft();

    // assert.equal(nftQName, 'Number 1');
    // assert.equal(nftQPrize, 0.01);

    // console.log('signature =>', signature);
  });
  
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