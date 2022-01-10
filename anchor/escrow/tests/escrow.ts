import * as anchor from "@project-serum/anchor";
import { Program, BN, IdlAccounts } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { assert } from "chai";
import { Escrow } from "../target/types/escrow";

type EscrowAccount = IdlAccounts<Escrow>["escrowAccount"];

describe("escrow", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Escrow as Program<Escrow>;

  let mintA: Token = null;
  let mintB: Token = null;
  let initializerTokenAccountA: PublicKey = null;
  let initializerTokenAccountB: PublicKey = null;
  let takerTokenAccountA: PublicKey = null;
  let takerTokenAccountB: PublicKey = null;
  let pda: PublicKey = null;

  const takerAmount = 1000;
  const initializerAmount = 500;

  const escrowAccount = Keypair.generate();
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  it("Initialise escrow state", async () => {
    // Airdropping tokens to a payer.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    // --- Create Token ---
    // Ref: https://github.com/solana-labs/solana-program-library/blob/eedcbd860270e43fe56900c29bbdb176ea61e3a3/token/js/client/token.js#L384
    mintA = await Token.createMint(
      provider.connection,      // connection: Connection
      payer,                    // payer: Signer
      mintAuthority.publicKey,  // mintAuthority: PublicKey
      null,                     // freezeAuthority: PublicKey | null
      0,                        // decimals: number
      TOKEN_PROGRAM_ID          // programId: PublicKey,
    );

    mintB = await Token.createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );

    // --- Create and initialize a new account ---
    // Ref: https://github.com/solana-labs/solana-program-library/blob/eedcbd860270e43fe56900c29bbdb176ea61e3a3/token/js/client/token.js#L446
    initializerTokenAccountA  = await mintA.createAccount(provider.wallet.publicKey);
    takerTokenAccountA        = await mintA.createAccount(provider.wallet.publicKey);
    initializerTokenAccountB  = await mintB.createAccount(provider.wallet.publicKey);
    takerTokenAccountB        = await mintB.createAccount(provider.wallet.publicKey);

    // --- Mint New Token ---
    // Ref: https://github.com/solana-labs/solana-program-library/blob/eedcbd860270e43fe56900c29bbdb176ea61e3a3/token/js/client/token.js#L1027
    await mintA.mintTo(
      initializerTokenAccountA, // dest: PublicKey
      mintAuthority.publicKey,  // authority: any
      [mintAuthority],          // multiSigners: Array<Signer>
      initializerAmount         // amount: number | u64
    );

    await mintB.mintTo(
      takerTokenAccountB,
      mintAuthority.publicKey,
      [mintAuthority],
      takerAmount
    );

    let _initializerTokenAccountA = await mintA.getAccountInfo(initializerTokenAccountA);
    let _takerTokenAccountB       = await mintB.getAccountInfo(takerTokenAccountB);

    // Check balance for debug.
    let _initializerTokenAccountB = await mintB.getAccountInfo(initializerTokenAccountB); // For debug
    let _takerTokenAccountA       = await mintA.getAccountInfo(takerTokenAccountA); // For debug

    assert.ok(_initializerTokenAccountA.amount.toNumber() == initializerAmount);
    assert.ok(_takerTokenAccountB.amount.toNumber() == takerAmount);

    console.log("\n----------------------------------------------------------------------");
    console.log("provider.wallet.publicKey          ->", provider.wallet.publicKey.toString());
    console.log("initializerTokenAccountA           ->", initializerTokenAccountA.toString());
    console.log("initializerTokenAccountB           ->", initializerTokenAccountB.toString());
    console.log("takerTokenAccountA                 ->", takerTokenAccountA.toString());
    console.log("takerTokenAccountB                 ->", takerTokenAccountB.toString());
    console.log("------------------------------------------------------------------------");
    console.log("escrowAccount                      ->", escrowAccount.publicKey.toString());
    console.log("payer                              ->", payer.publicKey.toString());
    console.log("mintAuthority                      ->", mintAuthority.publicKey.toString());
    console.log("------------------------------------------------------------------------");
    console.log("_initializerTokenAccountA mint     ->", _initializerTokenAccountA.mint.toString());
    console.log("_initializerTokenAccountA address  ->", _initializerTokenAccountA.address.toString());
    console.log("_initializerTokenAccountA amount   ->", _initializerTokenAccountA.amount.toNumber().toLocaleString());
    console.log("_initializerTokenAccountB amount   ->", _initializerTokenAccountB.amount.toNumber().toLocaleString());
    console.log("_takerTokenAccountB mint           ->", _takerTokenAccountB.mint.toString());
    console.log("_takerTokenAccountB address        ->", _takerTokenAccountB.address.toString());
    console.log("_takerTokenAccountB Amount         ->", _takerTokenAccountB.amount.toNumber().toLocaleString());
    console.log("_takerTokenAccountA Amount         ->", _takerTokenAccountA.amount.toNumber().toLocaleString());
    console.log("----------------------------------------------------------------------\n");
  });

  it("Initialize escrow", async () => {
    const tx = await program.rpc.initializeEscrow(
      new BN(initializerAmount),
      new BN(takerAmount),
      {
        accounts: {
          initializer: provider.wallet.publicKey,
          initializerDepositTokenAccount: initializerTokenAccountA,
          initializerReceiveTokenAccount: initializerTokenAccountB,
          escrowAccount: escrowAccount.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [escrowAccount],
      }
    );

    // Get the PDA that is assigned authority to token account.
    const [_pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow"))],
      program.programId
    );

    pda = _pda;

    let _initializerTokenAccountA = await mintA.getAccountInfo(initializerTokenAccountA);

    let _escrowAccount: EscrowAccount =
      await program.account.escrowAccount.fetch(escrowAccount.publicKey);

    // Check that the new owner is the PDA.
    assert.ok(_initializerTokenAccountA.owner.equals(pda));

    // Check that the values in the escrow account match what we expect.
    assert.ok(_escrowAccount.initializerKey.equals(provider.wallet.publicKey));
    assert.ok(_escrowAccount.initializerAmount.toNumber() == initializerAmount);
    assert.ok(_escrowAccount.takerAmount.toNumber() == takerAmount);
    assert.ok(
      _escrowAccount.initializerDepositTokenAccount.equals(
        initializerTokenAccountA
      )
    );
    assert.ok(
      _escrowAccount.initializerReceiveTokenAccount.equals(
        initializerTokenAccountB
      )
    );

    console.log("\n----------------------------------------------------------------------");
    console.log("tx                                             ->", tx);
    console.log("PDA PublicKey                                  ->", pda.toString());
    console.log("_escrowAccount.initializerKey                  ->", _escrowAccount.initializerKey.toString());
    console.log("_escrowAccount.initializerAmount               ->", _escrowAccount.initializerAmount.toNumber().toLocaleString());
    console.log("_escrowAccount.initializerDepositTokenAccount  ->", _escrowAccount.initializerDepositTokenAccount.toString());
    console.log("_escrowAccount.initializerReceiveTokenAccount  ->", _escrowAccount.initializerReceiveTokenAccount.toString());
    console.log("_escrowAccount.takerAmount                     ->", _escrowAccount.takerAmount.toNumber().toLocaleString());
    console.log("----------------------------------------------------------------------\n");
  });

  it("Exchange escrow", async () => {
    const tx = await program.rpc.exchange({
      accounts: {
        taker: provider.wallet.publicKey,
        takerDepositTokenAccount: takerTokenAccountB,
        takerReceiveTokenAccount: takerTokenAccountA,
        pdaDepositTokenAccount: initializerTokenAccountA,
        initializerReceiveTokenAccount: initializerTokenAccountB,
        initializerMainAccount: provider.wallet.publicKey,
        escrowAccount: escrowAccount.publicKey,
        pdaAccount: pda,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });

    let _takerTokenAccountA       = await mintA.getAccountInfo(takerTokenAccountA);
    let _takerTokenAccountB       = await mintB.getAccountInfo(takerTokenAccountB);
    let _initializerTokenAccountA = await mintA.getAccountInfo(initializerTokenAccountA);
    let _initializerTokenAccountB = await mintB.getAccountInfo(initializerTokenAccountB);

    // Check that the initializer gets back ownership of their token account.
    assert.ok(_takerTokenAccountA.owner.equals(provider.wallet.publicKey));

    assert.ok(_takerTokenAccountA.amount.toNumber() == initializerAmount);
    assert.ok(_initializerTokenAccountA.amount.toNumber() == 0);
    assert.ok(_initializerTokenAccountB.amount.toNumber() == takerAmount);
    assert.ok(_takerTokenAccountB.amount.toNumber() == 0);

    console.log("\n----------------------------------------------------------------------");
    console.log("tx                                   ->", tx);
    console.log("_initializerTokenAccountA.amount     ->", _initializerTokenAccountA.amount.toNumber().toLocaleString());
    console.log("_initializerTokenAccountB.amount     ->", _initializerTokenAccountB.amount.toNumber().toLocaleString());
    console.log("_takerTokenAccountA.owner PublicKey  ->", _takerTokenAccountA.owner.toString());
    console.log("_takerTokenAccountA.amount           ->", _takerTokenAccountA.amount.toNumber().toLocaleString());
    console.log("_takerTokenAccountB.amount           ->", _takerTokenAccountB.amount.toNumber().toLocaleString());
    console.log("----------------------------------------------------------------------\n");
  });

  // let newEscrow = Keypair.generate();
  //
  // it("Initialize escrow and cancel escrow", async () => {
  //   // Put back tokens into initializer token A account.
  //   await mintA.mintTo(
  //     initializerTokenAccountA,
  //     mintAuthority.publicKey,
  //     [mintAuthority],
  //     initializerAmount
  //   );
  //
  //   const tx_init = await program.rpc.initializeEscrow(
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
  //
  //   let _initializerTokenAccountA = await mintA.getAccountInfo(
  //     initializerTokenAccountA
  //   );
  //
  //   // Check that the new owner is the PDA.
  //   assert.ok(_initializerTokenAccountA.owner.equals(pda));
  //
  //   // Cancel the escrow.
  //   const tx_cancel = await program.rpc.cancelEscrow({
  //     accounts: {
  //       initializer: provider.wallet.publicKey,
  //       pdaDepositTokenAccount: initializerTokenAccountA,
  //       pdaAccount: pda,
  //       escrowAccount: newEscrow.publicKey,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     },
  //   });
  //
  //   // Check the final owner should be the provider public key.
  //   _initializerTokenAccountA = await mintA.getAccountInfo(
  //     initializerTokenAccountA
  //   );
  //   assert.ok(
  //     _initializerTokenAccountA.owner.equals(provider.wallet.publicKey)
  //   );
  //
  //   // Check all the funds are still there.
  //   assert.ok(_initializerTokenAccountA.amount.toNumber() == initializerAmount);
  //
  //   console.log("\n----------------------------------------------------------------------");
  //   console.log("tx_init    -> ", tx_init);
  //   console.log("tx_cancel  -> ", tx_cancel);
  //   console.log("----------------------------------------------------------------------\n");
  // });
});

/*
% anchor test
~~~ skip ~~~

escrow

----------------------------------------------------------------------
My Public Key          ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
Token Account A Amount ->  500
Token Account B Amount ->  1,000
----------------------------------------------------------------------

  ✓ Initialise escrow state (4361ms)

----------------------------------------------------------------------
PDA PublicKey                    ->  EBPuYEyCbGpYYq7ioy9nH2nm7SXkNgwRKQeqGCzbSNvu
_escrowAccount.initializerKey    ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
_escrowAccount.initializerAmount ->  500
_escrowAccount.takerAmount       ->  1,000
----------------------------------------------------------------------

  ✓ Initialize escrow (425ms)

----------------------------------------------------------------------
_takerTokenAccountA.owner PublicKey  ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
_takerTokenAccountA.amount           ->  500
_initializerTokenAccountA.amount     ->  0
_initializerTokenAccountB.amount     ->  1000
_takerTokenAccountB.amount           ->  0
----------------------------------------------------------------------

  ✓ Exchange escrow (466ms)
  ✓ Initialize escrow and cancel escrow (10332ms)


4 passing (16s)

✨  Done in 21.62s.
*/
