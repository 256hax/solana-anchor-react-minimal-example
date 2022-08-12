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
    const [pda, nonce] = await PublicKey.findProgramAddress([encode("pda")], program.programId);

    const tx = await program.methods
      .initialize()
      .accounts({
        pda: pda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    const balanceBefore = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('provider =>', provider.wallet.publicKey.toString());
    console.log('pda =>', pda.toString());
    console.log('balance of pda =>', balanceBefore);

    const balance = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('tx =>', tx);

    _pda = pda;
  });
  
  it("Deposit to PDA", async () => {
    const pda = _pda;

    const tx = await program.methods
      .deposit(new BN(LAMPORTS_PER_SOL * 0.001))
      .accounts({
        wallet: provider.wallet.publicKey, // from
        pda: pda, // to
        authority: provider.wallet.publicKey, // authority
      })
      .rpc()

    const balance = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('tx =>', tx);
    console.log('balance of pda =>', balance);
  });

  it("Withdraw from PDA", async () => {
    const pda = _pda;

    const tx = await program.methods
      .withdraw(new BN(LAMPORTS_PER_SOL * 0.0001))
      .accounts({
        pda: pda, // from
        wallet: provider.wallet.publicKey, // to
        authority: provider.wallet.publicKey, // authority
      })
      .rpc()

    const balance = await provider.connection.getBalance(pda);
    console.log('\n-------------------------------------------------');
    console.log('tx =>', tx);
    console.log('balance of pda =>', balance);
  });
});