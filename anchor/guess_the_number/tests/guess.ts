import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Guess } from "../target/types/guess";
import { Connection, clusterApiUrl, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { assert, expect } from 'chai';
import { initializeWallets } from '../app/modules/initializeWallets';
import { createNfts } from '../app/modules/createNfts';

describe("Guess the number", () => {
  // --- Anchor Settings ---
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.Guess as Program<Guess>;

  let payerWallet: Keypair;
  let taker1Wallet: Keypair;
  let taker2Wallet: Keypair;
  // let hackerWallet: Keypair; TODO

  let metaplex;

  it("Initialize wallets", async () => {
    [payerWallet, taker1Wallet, taker2Wallet] = await initializeWallets(connection);

    const rewardWalletBalance = await connection.getBalance(payerWallet.publicKey);
    const taker1WalletBalance = await connection.getBalance(taker1Wallet.publicKey);
    const taker2WalletBalance = await connection.getBalance(taker2Wallet.publicKey);

    assert.equal(rewardWalletBalance, LAMPORTS_PER_SOL);
    assert.equal(taker1WalletBalance, LAMPORTS_PER_SOL);
    assert.equal(taker2WalletBalance, LAMPORTS_PER_SOL);

    console.log('\n--------------------------------------------------');
    console.log('rewardWallet =>', payerWallet.publicKey.toString());
    console.log('taker1Wallet =>', taker1Wallet.publicKey.toString());
    console.log('taker2Wallet =>', taker2Wallet.publicKey.toString());
  });

  // describe("Set NFTs by payer", () => {
  //   // --- Metaplex Settings ---
  //   const connectionMetaplex = new Connection(clusterApiUrl("devnet"));
  //   metaplex = Metaplex.make(connectionMetaplex)
  //     .use(keypairIdentity(payerWallet))
  //     // .use(bundlrStorage({
  //     //     address: 'https://devnet.bundlr.network',
  //     //     providerUrl: 'https://api.devnet.solana.com',
  //     //     timeout: 60000,
  //     // }));
  //     .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  //   it("Create NFTs", async () => {
  //     const [uri1, nft1, uri2, nft2] = await createNfts(metaplex);

  //     console.log('\n--------------------------------------------------');
  //     console.log('uri1 =>', uri1);
  //     // console.log('nft1 =>', nft1);
  //     console.log('Mint Address1 =>', nft1.mintAddress.toString());
  //     console.log('uri2 =>', uri2);
  //     // console.log('nft2 =>', nft2);
  //     console.log('Mint Address2 =>', nft2.mintAddress.toString());
  //   });

  //   it("Set reward", async () => {
  //     // TODO: Lock reward
  //   });
  // });
 
  describe("Actions for NFT by taker", () => {
    it("Mint NFTs by taker", async () => {
      // metaplex js mintTo
    });

    it("Set an answer by takers", async () => {
      // Change set authority from taker to payer
    });
  });

  describe("Announcement", () => {
    it("Reveal correct(an NFT) by payer", async () => {
    });
    
    it("Calculate and security check", async () => {
      // - Find correct answer using Metaplex JS(findByMint)
      // - Security check using Metaplex JS(owerner == payerWallet)
    });
    
    it("Transfer reward to winner by program", async () => {
      // using Rust
    });
  });

  describe("Close by payer", () => {
    it("Burn taker's NFT", async () => {
    });

    it("Return authority to taker's NFT", async () => {
      // If need it
    });
  });
});