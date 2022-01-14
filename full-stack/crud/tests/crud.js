const assert = require("assert");
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

describe("CRUD", () => {
  // Use a local provider.
  const provider = anchor.Provider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it("Creates and initializes an account in a single atomic transaction (simplified)", async () => {
    // #region code-simplified
    // The program to execute.
    const program = anchor.workspace.Crud;

    // The Account to create.
    const crudAccount = anchor.web3.Keypair.generate();

    // Create the new account and initialize it with the program.
    // #region code-simplified
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
    // #endregion code-simplified

    // Fetch the newly created account from the cluster.
    const account = await program.account.crudAccount.fetch(crudAccount.publicKey);

    // Check it's state was initialized.
    assert.ok(account.data.eq(new anchor.BN(1234)));
    console.log("data: ", account.data.toString());

    // Store the account for the next test.
    _crudAccount = crudAccount;
  });

  it("Updates a previously created account", async () => {
    const crudAccount = _crudAccount;

    // #region update-test

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

    // #endregion update-test
  });

  it("Delete(Data Masking) a previously created account", async () => {
    const crudAccount = _crudAccount;

    // #region update-test

    // The program to execute.
    const program = anchor.workspace.Crud;

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

    // #endregion update-test
  });
});

/*
% anchor test

~~~ skip ~~~

CRUD
data:  1234
  ✔ Creates and initializes an account in a single atomic transaction (simplified) (545ms)
data:  4321
  ✔ Updates a previously created account (482ms)
data:  0
  ✔ Delete(Data Masking) a previously created account (481ms)


3 passing (2s)

✨  Done in 7.26s.
*/
