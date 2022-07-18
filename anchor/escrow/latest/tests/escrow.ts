import * as anchor from "@project-serum/anchor";
import { Program, BN, IdlAccounts } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount } from "@solana/spl-token";
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
      provider.wallet.publicKey
    );

    const takerTokenAccountB = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintB,
      provider.wallet.publicKey
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
      initializerTokenAccountBPubkey,
      mintAuthority,
      takerAmount,
      []
    );

    const initializerTokenAccountABalance = await connection.getTokenAccountBalance(initializerTokenAccountAPubkey);
    const takerTokenAccountBBalance = await connection.getTokenAccountBalance(takerTokenAccountBPubkey);

    assert.strictEqual(
      Number(initializerTokenAccountABalance.value.amount),
      initializerAmount
    );

    assert.strictEqual(
      Number(takerTokenAccountBBalance.value.amount),
      takerAmount
    );
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

    const _initializerTokenAccountA = await getAccount(connection, initializerTokenAccountAPubkey);

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


    console.log('programId =>', program.programId.toString());
    console.log('initializerTokenAccountAPubkey =>', initializerTokenAccountAPubkey.toString());
    console.log('initializerTokenAccountBPubkey =>', initializerTokenAccountBPubkey.toString());
    console.log('takerTokenAccountAPubkey =>', takerTokenAccountAPubkey.toString());
    console.log('takerTokenAccountBPubkey =>', takerTokenAccountBPubkey.toString());
    console.log('pda =>', pda.toString());
    console.log('_initializerTokenAccountA.owner =>', _initializerTokenAccountA.owner.toString());    
  });

  // it("Exchange escrow", async () => {
  //   await program.rpc.exchange({
  //     accounts: {
  //       taker: provider.wallet.publicKey,
  //       takerDepositTokenAccount: takerTokenAccountB,
  //       takerReceiveTokenAccount: takerTokenAccountA,
  //       pdaDepositTokenAccount: initializerTokenAccountA,
  //       initializerReceiveTokenAccount: initializerTokenAccountB,
  //       initializerMainAccount: provider.wallet.publicKey,
  //       escrowAccount: escrowAccount.publicKey,
  //       pdaAccount: pda,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     },
  //   });

  //   let _takerTokenAccountA = await mintA.getAccountInfo(takerTokenAccountA);
  //   let _takerTokenAccountB = await mintB.getAccountInfo(takerTokenAccountB);
  //   let _initializerTokenAccountA = await mintA.getAccountInfo(
  //     initializerTokenAccountA
  //   );
  //   let _initializerTokenAccountB = await mintB.getAccountInfo(
  //     initializerTokenAccountB
  //   );

  //   // Check that the initializer gets back ownership of their token account.
  //   assert.isTrue(_takerTokenAccountA.owner.equals(provider.wallet.publicKey));

  //   assert.strictEqual(
  //     _takerTokenAccountA.amount.toNumber(),
  //     initializerAmount
  //   );
  //   assert.strictEqual(_initializerTokenAccountA.amount.toNumber(), 0);
  //   assert.strictEqual(
  //     _initializerTokenAccountB.amount.toNumber(),
  //     takerAmount
  //   );
  //   assert.strictEqual(_takerTokenAccountB.amount.toNumber(), 0);
  // });

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