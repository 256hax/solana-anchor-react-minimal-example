import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
import { assert } from 'chai';

describe("counter", () => {
  // anchor.setProvider(anchor.AnchorProvider.env());

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  // Counter for the tests.
  const counter = anchor.web3.Keypair.generate();

  const program = anchor.workspace.Counter as Program<Counter>;

  it("Creates a counter", async () => {
    await program.methods
    .create(
      provider.wallet.publicKey
    )
    .accounts({
      counter: counter.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([counter])
    .rpc()

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
    assert.ok(counterAccount.count.toNumber() === 0);
  });

  it("Updates a counter", async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      })
      .rpc()

    const counterAccount = await program.account.counter.fetch(
      counter.publicKey
    );

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
    assert.ok(counterAccount.count.toNumber() == 1);
  });
});
