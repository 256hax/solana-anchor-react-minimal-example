import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Crud } from "../target/types/crud";
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { assert } from "chai";

describe("CRUD", () => {
  const provider = anchor.Provider.local();
  const connection = provider.connection
  anchor.setProvider(provider);

  const program = anchor.workspace.Crud as Program<Crud>;

  const crudAccount = anchor.web3.Keypair.generate();

  it("Creates and initializes an account in a single atomic transaction (simplified)", async () => {

    await program.rpc.create(
      new anchor.BN(1234), // args: data
      {
        accounts: { // args: ctx
          crudAccount: crudAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
      },
      signers: [crudAccount],
    });

    const account = await program.account.crudAccount.fetch(crudAccount.publicKey);

    assert.ok(account.data.eq(new anchor.BN(1234)));
    console.log("data: ", account.data.toString());

    // Store the account for the next test.
  });

  it("Updates a previously created account", async () => {

    // The program to execute.
    const program = anchor.workspace.Crud;

    // Invoke the update rpc.
    await program.rpc.update(
      new anchor.BN(4321), // args: data
      {
        accounts: { // args: ctx
          crudAccount: crudAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.crudAccount.fetch(crudAccount.publicKey);

    // Check it's state was mutated.
    assert.ok(account.data.eq(new anchor.BN(4321)));
    console.log("data: ", account.data.toString());
  });

  it("Delete(Data Masking) a previously created account", async () => {

    // Invoke the update rpc.
    await program.rpc.delete({
      accounts: { // args: ctx
        crudAccount: crudAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.crudAccount.fetch(crudAccount.publicKey);

    // Check it's state was mutated.
    assert.ok(account.data.eq(new anchor.BN(0)));
    console.log("data: ", account.data.toString());
  });
});
