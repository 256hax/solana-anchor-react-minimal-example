import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { Myanc } from "../target/types/myanc";

describe("Transfer SOL from User PDA", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myanc as Program<Myanc>;

  let pda;
  let bump;

  const user = Keypair.generate();
  const taker = Keypair.generate();

  it("Airdrop to PDA", async () => {
    // -----------------------------------------------------------
    //  Generate PDA(Not yet created)
    // -----------------------------------------------------------
    [pda, bump] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("myseed"),
        user.publicKey.toBuffer(),
      ],
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

    const balancePda = await provider.connection.getBalance(pda) / LAMPORTS_PER_SOL;
    const balanceTaker = await provider.connection.getBalance(taker.publicKey) / LAMPORTS_PER_SOL;

    console.log('user =>', user.publicKey.toString());
    console.log('user pda =>', pda.toString());
    console.log('user pda bump =>', bump);
    console.log('taker =>', taker.publicKey.toString());

    console.log('\n--- before transfer ---');
    console.log('balancePda =>', balancePda, 'SOL');
    console.log('balanceTaker =>', balanceTaker, 'SOL');
  });

  it("Transfer SOL from PDA", async () => {
    await program.methods
      .transferUserSol(
        new anchor.BN(0.001 * LAMPORTS_PER_SOL),
        bump,
      )
      .accounts ({
        user: user.publicKey, // signer
        pda: pda, // payer
        taker: taker.publicKey, // taker
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc()

    const balancePda = await provider.connection.getBalance(pda) / LAMPORTS_PER_SOL;
    const balanceTaker = await provider.connection.getBalance(taker.publicKey) / LAMPORTS_PER_SOL;

    console.log('\n--- after transfer ---');
    console.log('balancePda =>', balancePda, 'SOL');
    console.log('balanceTaker =>', balanceTaker, 'SOL');
  });
});
