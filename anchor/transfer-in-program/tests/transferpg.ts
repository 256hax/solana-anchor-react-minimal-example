import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Transferpg } from "../target/types/transferpg";
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import assert from 'assert';
import BN from 'bn.js';

describe("transferpg", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Transferpg as Program<Transferpg>;
  const connection = program.provider.connection;

  const encode = anchor.utils.bytes.utf8.encode;
  let _pda: PublicKey;

  it("Initialize account", async () => {
    const [pda, nonce] = await PublicKey.findProgramAddress([encode("vault")], program.programId);

    const tx = await program.methods
      .initialize()
      .accounts({
        vault: pda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()


    const balanceBefore = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('provider =>', provider.wallet.publicKey.toString());
    console.log('pda =>', pda.toString());
    console.log('balance of pda before airdrop =>', balanceBefore);


    // --- Airdrop ---
    const airdropSignature = await connection.requestAirdrop(pda, LAMPORTS_PER_SOL);

    let latestBlockHash = await connection.getLatestBlockhash();

    // Wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
    // --- End Airdrop ---


    const balance = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('tx =>', tx);
    console.log('balance of pda =>', balance);

    _pda = pda;
  });
  
  it("Deposit to PDA", async () => {
    const pda = _pda;

    const tx = await program.methods
      .deposit(new BN(LAMPORTS_PER_SOL * 0.001))
      .accounts({
        vault: pda,
        authority: provider.wallet.publicKey,
        wallet: provider.wallet.publicKey,
      })
      .rpc()

    const balance = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('tx =>', tx);
    console.log('balance of pda =>', balance);
  });

  // it("Withdraw from PDA", async () => {
  //   const pda = _pda;

  //   const tx = await program.methods
  //     .deposit(new BN(LAMPORTS_PER_SOL * 0.001))
  //     .accounts({
  //       vault: provider.wallet.publicKey,
  //       authority: provider.wallet.publicKey,
  //       wallet: pda,
  //     })
  //     .rpc()

  //   const balance = await provider.connection.getBalance(pda);
  //   console.log('\n-------------------------------------------------');
  //   console.log('tx =>', tx);
  //   console.log('balance of pda =>', balance);
  // });
});