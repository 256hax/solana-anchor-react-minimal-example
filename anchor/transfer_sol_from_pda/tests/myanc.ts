import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { Myanc } from "../target/types/myanc";

describe("myanc", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myanc as Program<Myanc>;

  let pda;
  let bump;

  const randomWallet = Keypair.generate().publicKey;

  it("Airdrop to PDA", async () => {
    // -----------------------------------------------------------
    //  Generate PDA(Not yet created)
    // -----------------------------------------------------------
    [pda, bump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("test")],
      program.programId,
    );

    // -----------------------------------------------------------
    //  Airdrop
    // -----------------------------------------------------------
    let latestBlockhash: any;

    latestBlockhash = await provider.connection.getLatestBlockhash();
    const signatureAirdropAlice = await provider.connection.requestAirdrop(pda, LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: signatureAirdropAlice,
    });

    console.log('provider.wallet.publicKey =>', provider.wallet.publicKey.toString());
    console.log('pda =>', pda.toString());
    console.log('bump =>', bump);

    console.log('\n--- before transfer ---');
    const balancePda = await provider.connection.getBalance(pda) / LAMPORTS_PER_SOL;
    const balanceRandomWallet = await provider.connection.getBalance(randomWallet) / LAMPORTS_PER_SOL;
    console.log('balancePda =>', balancePda, 'SOL');
    console.log('randomWallet =>', balanceRandomWallet, 'SOL');
  });

  it("Transfer SOL from PDA", async () => {
    await program.methods
      .transferSol(
        new anchor.BN(0.001 * LAMPORTS_PER_SOL),
        bump,
      )
      .accounts ({
        pda: pda, // payer
        taker: randomWallet, // taker
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    console.log('\n--- after transfer ---');
    const balancePda = await provider.connection.getBalance(pda) / LAMPORTS_PER_SOL;
    const balanceRandomWallet = await provider.connection.getBalance(randomWallet) / LAMPORTS_PER_SOL;
    console.log('balancePda =>', balancePda, 'SOL');
    console.log('randomWallet =>', balanceRandomWallet, 'SOL');
  });
});
