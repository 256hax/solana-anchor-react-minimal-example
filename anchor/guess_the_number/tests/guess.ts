import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Guess } from "../target/types/guess";
import { Connection, clusterApiUrl, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { assert, expect } from 'chai';
import { initializeWallets } from '../app/modules/initializeWallets';
import { mintNfts } from '../app/modules/mintNfts';

describe("Guess the number", () => {
  // --- Anchor Settings ---
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;
  
  const program = anchor.workspace.Guess as Program<Guess>;

  // --- Metaplex Settings ---
  const payer = provider.wallet.payer;
  // Note: You should airdrop if you don't have balance for Devnet.

  const connectionMetaplex = new Connection(clusterApiUrl("devnet"));
  const metaplex = Metaplex.make(connectionMetaplex)
      .use(keypairIdentity(payer))
      // .use(bundlrStorage({
      //     address: 'https://devnet.bundlr.network',
      //     providerUrl: 'https://api.devnet.solana.com',
      //     timeout: 60000,
      // }));
      .use(mockStorage()); // Use this instead of bundlrStorage if you need mock(dummy url).

  let taker1Wallet;
  let taker2Wallet;
  let rewardWallet;
  
  it("Initialize wallets", async() => {
    [taker1Wallet, taker2Wallet, rewardWallet] = await initializeWallets(connection);

    const taker1WalletBalance = await connection.getBalance(taker1Wallet.publicKey);
    const taker2WalletBalance = await connection.getBalance(taker2Wallet.publicKey);
    const rewardWalletBalance = await connection.getBalance(rewardWallet.publicKey);

    assert.equal(taker1WalletBalance, LAMPORTS_PER_SOL);
    assert.equal(taker2WalletBalance, LAMPORTS_PER_SOL);
    assert.equal(rewardWalletBalance, LAMPORTS_PER_SOL);

    console.log('taker1Wallet =>', taker1Wallet.publicKey.toString());
    console.log('taker2Wallet =>', taker2Wallet.publicKey.toString());
    console.log('rewardWallet =>', rewardWallet.publicKey.toString());
  });

  // it("Mint NFTs by provider", async () => {
  //   const [uri, nft] = await mintNfts(metaplex);

  //   console.log('uri =>', uri);
  //   console.log('nft =>', nft);
  //   console.log('Mint Address =>', nft.mintAddress.toString());
  // });

  describe("Set reward by provider", async () => {
    console.log(taker1Wallet);
    
    it("Initialize accounts", async () => {
    });

    it("Add reward", async () => {
    });
  });

  it("Set an answer by users", async () => {
  });

  it("Reveal correct by provider", async () => {
  });

  it("Transfer reward to winner by program", async () => {
  });
});