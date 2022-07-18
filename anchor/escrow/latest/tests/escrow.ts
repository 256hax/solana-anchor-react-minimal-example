import * as anchor from "@project-serum/anchor";
import { Program, BN, IdlAccounts } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, createAccount, mintTo, getAccount } from "@solana/spl-token";
import { assert } from "chai";
import { Escrow } from "../target/types/escrow";

type EscrowAccount = IdlAccounts<Escrow>["escrowAccount"];

describe("escrow", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.Escrow as Program<Escrow>;

  let mintA = null;
  let mintB = null;
  let initializerTokenAccountAPubkey: PublicKey = null;
  let initializerTokenAccountBPubkey: PublicKey = null;
  let takerTokenAccountAPubkey: PublicKey = null;
  let takerTokenAccountBPubkey: PublicKey = null;
  let pda: PublicKey = null;

  const initializerAmount = 500;
  const takerAmount = 1000;

  const escrowAccount = Keypair.generate();
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();
  const taker = Keypair.generate();

  it("Initialize escrow state", async () => {
    // Generate a new wallet keypair and airdrop SOL
    const payerAirdropSignature = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
    const latestBlockHash = await connection.getLatestBlockhash();

    // Wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: payerAirdropSignature,
    });

    mintA = await createMint(
      connection, // connection
      payer, // payer
      mintAuthority.publicKey, // mintAuthority
      null, // freezeAuthority
      9 // decimals
    );

    mintB = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      null,
      9
    );

    // Get the token account of the Wallet address, and if it does not exist, create it
    const initializerTokenAccountA = await getOrCreateAssociatedTokenAccount(
      connection, // connection
      payer, // payer
      mintA, // mint
      provider.wallet.publicKey // owner
    );

    const initializerTokenAccountB = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintB,
      provider.wallet.publicKey
    );

    const takerTokenAccountA = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintA,
      // provider.wallet.publicKey
      taker.publicKey
    );

    const takerTokenAccountB = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintB,
      // provider.wallet.publicKey
      taker.publicKey
    );

    initializerTokenAccountAPubkey = initializerTokenAccountA.address;
    initializerTokenAccountBPubkey = initializerTokenAccountB.address;
    takerTokenAccountAPubkey = takerTokenAccountA.address;
    takerTokenAccountBPubkey = takerTokenAccountB.address;

    // Mint new token to the TokenAccount account we just created
    const mintATx = await mintTo(
      connection, // connection
      payer, // payer
      mintA, // mint
      initializerTokenAccountAPubkey, // destination
      mintAuthority, // authority
      initializerAmount, // amount
      [] // signer(s)
    );

    const mintBTx = await mintTo(
      connection,
      payer,
      mintB,
      takerTokenAccountBPubkey,
      mintAuthority,
      takerAmount,
      []
    );

    const _initializerTokenAccountA = await getAccount(
      connection,
      initializerTokenAccountAPubkey
    );
    const _initializerTokenAccountB = await getAccount(
      connection,
      initializerTokenAccountBPubkey
    );
    const _takerTokenAccountA = await getAccount(
      connection,
      takerTokenAccountAPubkey
    );
    const _takerTokenAccountB = await getAccount(
      connection,
      takerTokenAccountBPubkey
    );

    assert.strictEqual(
      Number(_initializerTokenAccountA.amount),
      initializerAmount
    );

    assert.strictEqual(
      Number(_takerTokenAccountB.amount),
      takerAmount
    );

    console.log('\n-------------------------------------------------------------------------');
    console.log('programId                        =>', program.programId.toString());
    console.log('initializerTokenAccountAPubkey   =>', initializerTokenAccountAPubkey.toString());
    console.log('initializerTokenAccountBPubkey   =>', initializerTokenAccountBPubkey.toString());
    console.log('takerTokenAccountAPubkey         =>', takerTokenAccountAPubkey.toString());
    console.log('takerTokenAccountBPubkey         =>', takerTokenAccountBPubkey.toString());
    console.log('_initializerTokenAccountA.amount =>', _initializerTokenAccountA.amount);
    console.log('_initializerTokenAccountB.amount =>', _initializerTokenAccountB.amount);
    console.log('_takerTokenAccountA.amount       =>', _takerTokenAccountA.amount);
    console.log('_takerTokenAccountB.amount       =>', _takerTokenAccountB.amount);
    console.log('-------------------------------------------------------------------------');
  });

  it("Initialize escrow", async () => {
    await program.methods
      .initializeEscrow(
        new BN(initializerAmount),
        new BN(takerAmount)
      )
      .accounts({
        initializer: provider.wallet.publicKey,
        initializerDepositTokenAccount: initializerTokenAccountAPubkey,
        initializerReceiveTokenAccount: initializerTokenAccountBPubkey,
        escrowAccount: escrowAccount.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([escrowAccount])
      .rpc()
    
    // Get the PDA that is assigned authority to token account.
    const [_pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow"))],
      program.programId
    );

    pda = _pda;

    const _initializerTokenAccountA = await getAccount(
      connection,
      initializerTokenAccountAPubkey
    );
    const _initializerTokenAccountB = await getAccount(
      connection,
      initializerTokenAccountBPubkey
    );
    const _takerTokenAccountA = await getAccount(
      connection,
      takerTokenAccountAPubkey
    );
    const _takerTokenAccountB = await getAccount(
      connection,
      takerTokenAccountBPubkey
    );

    const _escrowAccount: EscrowAccount =
      await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    
    // Check that the new owner is the PDA.
    assert.isTrue(_initializerTokenAccountA.owner.equals(pda));

    // Check that the values in the escrow account match what we expect.
    assert.isTrue(
      _escrowAccount.initializerKey.equals(provider.wallet.publicKey)
    );
    assert.strictEqual(
      _escrowAccount.initializerAmount.toNumber(),
      initializerAmount
    );
    assert.strictEqual(_escrowAccount.takerAmount.toNumber(), takerAmount);
    assert.isTrue(
      _escrowAccount.initializerDepositTokenAccount.equals(
        initializerTokenAccountAPubkey
      )
    );
    assert.isTrue(
      _escrowAccount.initializerReceiveTokenAccount.equals(
        initializerTokenAccountBPubkey
      )
    );

    console.log('\n-------------------------------------------------------------------------');
    console.log('pda                              =>', pda.toString());
    console.log('_initializerTokenAccountA.owner  =>', _initializerTokenAccountA.owner.toString());
    console.log('_escrowAccount.initializerKey    =>', _escrowAccount.initializerKey.toString());
    console.log('_escrowAccount.initializerAmount =>', _escrowAccount.initializerAmount.toNumber());
    console.log('_escrowAccount.takerAmount       =>', _escrowAccount.takerAmount.toNumber());
    console.log('_initializerTokenAccountA.amount =>', _initializerTokenAccountA.amount);
    console.log('_initializerTokenAccountB.amount =>', _initializerTokenAccountB.amount);
    console.log('_takerTokenAccountA.amount       =>', _takerTokenAccountA.amount);
    console.log('_takerTokenAccountB.amount       =>', _takerTokenAccountB.amount);
    console.log('-------------------------------------------------------------------------');
  });

  it("Exchange escrow", async () => {
    await program.methods
      .exchange()
      .accounts({
        taker: taker.publicKey,
        takerDepositTokenAccount: takerTokenAccountBPubkey,
        takerReceiveTokenAccount: takerTokenAccountAPubkey,
        pdaDepositTokenAccount: initializerTokenAccountAPubkey,
        initializerReceiveTokenAccount: initializerTokenAccountBPubkey,
        initializerMainAccount: provider.wallet.publicKey,
        escrowAccount: escrowAccount.publicKey,
        pdaAccount: pda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([taker])
      .rpc()

    const _initializerTokenAccountA = await getAccount(
      connection,
      initializerTokenAccountAPubkey
    );
    const _initializerTokenAccountB = await getAccount(
      connection,
      initializerTokenAccountBPubkey
    );
    const _takerTokenAccountA = await getAccount(
      connection,
      takerTokenAccountAPubkey
    );
    const _takerTokenAccountB = await getAccount(
      connection,
      takerTokenAccountBPubkey
    );

    console.log('\n-------------------------------------------------------------------------');
    console.log('_initializerTokenAccountA.amount =>', _initializerTokenAccountA.amount);
    console.log('_initializerTokenAccountB.amount =>', _initializerTokenAccountB.amount);
    console.log('_takerTokenAccountA.amount       =>', _takerTokenAccountA.amount);
    console.log('_takerTokenAccountB.amount       =>', _takerTokenAccountB.amount);
    console.log('-------------------------------------------------------------------------');
    
    // Check that the initializer gets back ownership of their token account.
    assert.isTrue(_takerTokenAccountA.owner.equals(taker.publicKey));

    // Check that the values in the escrow account match what we expect.
    assert.strictEqual(Number(_initializerTokenAccountA.amount), 0);
    assert.strictEqual(Number(_initializerTokenAccountB.amount), takerAmount);
    assert.strictEqual(Number(_takerTokenAccountA.amount), initializerAmount);
    assert.strictEqual(Number(_takerTokenAccountB.amount), 0);
  });

  // let newEscrow = Keypair.generate();

  // it("Initialize escrow and cancel escrow", async () => {
  //   // Put back tokens into initializer token A account.
  //   await mintA.mintTo(
  //     initializerTokenAccountA,
  //     mintAuthority.publicKey,
  //     [mintAuthority],
  //     initializerAmount
  //   );

  //   await program.rpc.initializeEscrow(
  //     new BN(initializerAmount),
  //     new BN(takerAmount),
  //     {
  //       accounts: {
  //         initializer: provider.wallet.publicKey,
  //         initializerDepositTokenAccount: initializerTokenAccountA,
  //         initializerReceiveTokenAccount: initializerTokenAccountB,
  //         escrowAccount: newEscrow.publicKey,
  //         systemProgram: SystemProgram.programId,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //       },
  //       signers: [newEscrow],
  //     }
  //   );

  //   let _initializerTokenAccountA = await mintA.getAccountInfo(
  //     initializerTokenAccountA
  //   );

  //   // Check that the new owner is the PDA.
  //   assert.isTrue(_initializerTokenAccountA.owner.equals(pda));

  //   // Cancel the escrow.
  //   await program.rpc.cancelEscrow({
  //     accounts: {
  //       initializer: provider.wallet.publicKey,
  //       pdaDepositTokenAccount: initializerTokenAccountA,
  //       pdaAccount: pda,
  //       escrowAccount: newEscrow.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     },
  //   });

  //   // Check the final owner should be the provider public key.
  //   _initializerTokenAccountA = await mintA.getAccountInfo(
  //     initializerTokenAccountA
  //   );
  //   assert.isTrue(
  //     _initializerTokenAccountA.owner.equals(provider.wallet.publicKey)
  //   );

  //   // Check all the funds are still there.
  //   assert.strictEqual(
  //     _initializerTokenAccountA.amount.toNumber(),
  //     initializerAmount
  //   );
  // });
});

/*
% anchor test

  escrow

-------------------------------------------------------------------------
programId                        => 73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep
initializerTokenAccountAPubkey   => D48DD4vgqeoG1A7kYyrQrjQjYkzZEr6NdbkjZ5imFuPt
initializerTokenAccountBPubkey   => BqLtcyKRErCZct4BPC6HsUcMvXy5uKjYyxtZChQUMNuv
takerTokenAccountAPubkey         => HSrxadbu1RhXavLcHAPjaVxUaz6jdW63mgX4XxxEaUKK
takerTokenAccountBPubkey         => GxDqHcWW1XdFZJRrFExq2aWXEavRkCMfEhWoLQEr6VqX
_initializerTokenAccountA.amount => 500n
_initializerTokenAccountB.amount => 0n
_takerTokenAccountA.amount       => 0n
_takerTokenAccountB.amount       => 1000n
-------------------------------------------------------------------------
    ✔ Initialize escrow state (3805ms)

-------------------------------------------------------------------------
pda                              => Gr7oUdUHYnDRdd3Dhqhnnd334cczAQBGWsJF8Pku8SHu
_initializerTokenAccountA.owner  => Gr7oUdUHYnDRdd3Dhqhnnd334cczAQBGWsJF8Pku8SHu
_escrowAccount.initializerKey    => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
_escrowAccount.initializerAmount => 500
_escrowAccount.takerAmount       => 1000
_initializerTokenAccountA.amount => 500n
_initializerTokenAccountB.amount => 0n
_takerTokenAccountA.amount       => 0n
_takerTokenAccountB.amount       => 1000n
-------------------------------------------------------------------------
    ✔ Initialize escrow (464ms)

-------------------------------------------------------------------------
_initializerTokenAccountA.amount => 0n
_initializerTokenAccountB.amount => 1000n
_takerTokenAccountA.amount       => 500n
_takerTokenAccountB.amount       => 0n
-------------------------------------------------------------------------
    ✔ Exchange escrow (447ms)


  3 passing (5s)

✨  Done in 10.84s.
*/