import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Trsf } from "../target/types/trsf";
import { assert, expect } from 'chai';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, TOKEN_PROGRAM_ID, getMint, getAccount } from '@solana/spl-token';
import { program } from "@project-serum/anchor/dist/cjs/spl/associated-token";

describe("token", () => {
  const provider = anchor.AnchorProvider.local();
  const program = anchor.workspace.Trsf as Program<Trsf>;
  const connection = program.provider.connection;

  let mint = null;
  let fromToken = null;
  let toToken = null;

  const fromWallet = Keypair.generate();
  const toWallet = Keypair.generate();

  it("Airdrop", async() => {
    // --- Airdrop ---
    const fromWalletAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

    let latestBlockHash = await connection.getLatestBlockhash();

    // Wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromWalletAirdropSignature,
    });
    // --- End Airdrop ---

    // --- Airdrop ---
    const toWalletAirdropSignature = await connection.requestAirdrop(toWallet.publicKey, LAMPORTS_PER_SOL);

    latestBlockHash = await connection.getLatestBlockhash();

    // Wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: toWalletAirdropSignature,
    });
    // --- End Airdrop ---
  });

  it("Initializes test state", async () => {
    // Create new token mint
    mint = await createMint(
      connection, // connection
      provider.wallet.payer, // payer
      provider.wallet.publicKey, // mintAuthority
      null, // freezeAuthority
      9 // decimals
    );

    // Get the token account of the fromWallet address, and if it does not exist, create it
    fromToken = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        provider.wallet.payer, // payer
        mint, // mint
        fromWallet.publicKey // owner.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    toToken = await getOrCreateAssociatedTokenAccount(
        connection,
        provider.wallet.payer, // payer
        mint,
        toWallet.publicKey // owner.publicKey
    );

    const fromTokenAccountInfo = await getAccount(connection, fromToken.address);
    const toTokenAccountInfo = await getAccount(connection, toToken.address);
    const mintInfo = await getMint(connection, mint);
    console.log('\n--- Initializes ----------------------------');
    console.log('provider.wallet.publicKey  =>', provider.wallet.publicKey.toString());
    console.log('fromToken          =>', fromToken.address.toString());
    console.log('fromToken owner    =>', fromToken.owner.toString());
    console.log('toToken            =>', toToken.address.toString());
    console.log('toToken owner      =>', toToken.owner.toString());
    console.log('mint address       =>', mint.toString());
    console.log('mint authority     =>', mintInfo.mintAuthority.toString());
    console.log('fromToken balance  =>', fromTokenAccountInfo.amount);
    console.log('toToken balance    =>', toTokenAccountInfo.amount);
  });

  it("Mints a token", async () => {
    await program.methods
      .proxyMintTo(new anchor.BN(1000))
      .accounts({
        authority: provider.wallet.publicKey,
        mint: mint,
        to: fromToken.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    const accountInfo = await getAccount(connection, fromToken.address);
    assert.equal(accountInfo.amount, BigInt(1000));

    const fromTokenAccountInfo = await getAccount(connection, fromToken.address);
    const toTokenAccountInfo = await getAccount(connection, toToken.address);
    console.log('\n--- Mints ----------------------------');
    console.log('fromToken balance  =>', fromTokenAccountInfo.amount);
    console.log('toToken balance    =>', toTokenAccountInfo.amount);
  });

  it("Transfers a token", async () => {
    await program.methods
      .proxyTransfer(new anchor.BN(400))
      .accounts({
        // authority: provider.wallet.publicKey,
        authority: fromWallet.publicKey,
        from: fromToken.address,
        to: toToken.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([fromWallet])
      .rpc()

    const fromTokenAccountInfo = await getAccount(connection, fromToken.address);
    const toTokenAccountInfo = await getAccount(connection, toToken.address);
    assert.equal(fromTokenAccountInfo.amount, BigInt(600))
    assert.equal(toTokenAccountInfo.amount, BigInt(400))

    console.log('\n--- Transfers ----------------------------');
    console.log('fromToken balance  =>', fromTokenAccountInfo.amount);
    console.log('toToken balance    =>', toTokenAccountInfo.amount);
  });

  it("Burns a token", async () => {
    await program.methods
      .proxyBurn(new anchor.BN(399))
      .accounts({
        authority: toWallet.publicKey,
        mint: mint,
        from: toToken.address,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([toWallet])
      .rpc()

    const fromTokenAccountInfo = await getAccount(connection, fromToken.address);
    const toTokenAccountInfo = await getAccount(connection, toToken.address);
    assert.equal(toTokenAccountInfo.amount, BigInt(1));

    console.log('\n--- Burns ----------------------------');
    console.log('fromToken balance  =>', fromTokenAccountInfo.amount);
    console.log('toToken balance    =>', toTokenAccountInfo.amount);
  });

  it("Set new mint authority", async () => {
    const newMintAuthority = anchor.web3.Keypair.generate();

    await program.methods
      .proxySetAuthority(
        { mintTokens: {} },
        newMintAuthority.publicKey
      )
      .accounts({
          accountOrMint: mint,
          currentAuthority: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()

    const mintInfo = await getMint(connection, mint);
    assert.equal(mintInfo.mintAuthority.toString(), newMintAuthority.publicKey.toString());
  });
});

/*
% anchor test
  token
    ✔ Airdrop (814ms)

--- Initializes ----------------------------
provider.wallet.publicKey  => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
fromToken          => ARkv5g64vqVVyhpQ9iMrQKeehAYnMF3b3gb2G8jNiRjG
fromToken owner    => 7iYyvc8Kf1119V3ntzbPsPTTyotdfxDjYR3J6QUkaPEz
toToken            => CfL2C7chxmSXFxft8NizKnojnPpwcqxEcZgb16Bht3bT
toToken owner      => EMSSW6ypAW1pfYMcNHPNo92nhMSW5Km5syRi579YCaRm
mint address       => EZAMMhneVHy5c29EFWnMUg6DfFjMwSQusQwU1fsn5TsN
mint authority     => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
fromToken balance  => 0n
toToken balance    => 0n
    ✔ Initializes test state (1402ms)

--- Mints ----------------------------
fromToken balance  => 1000n
toToken balance    => 0n
    ✔ Mints a token (457ms)

--- Transfers ----------------------------
fromToken balance  => 600n
toToken balance    => 400n
    ✔ Transfers a token (449ms)

--- Burns ----------------------------
fromToken balance  => 600n
toToken balance    => 1n
    ✔ Burns a token (463ms)
    ✔ Set new mint authority (460ms)


  6 passing (4s)

✨  Done in 10.40s.
*/