import * as anchor from "@coral-xyz/anchor";
import { assert } from 'chai';

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  // Assign address for Counter Account
  const counter = anchor.web3.Keypair.generate();

  const program = anchor.workspace.Counter;

  it("Creates a counter", async () => {
    const startCount = 0;

    const signatuer = await program.methods
      .initialize(
        new anchor.BN(startCount)
      )
      .accounts({
        counter: counter.publicKey, // Assign address
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([provider.wallet.payer, counter])
      .rpc()

    let counterAccount = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
    assert.ok(counterAccount.count.toNumber() === 0);

    console.log('provider =>', provider.wallet.publicKey.toString());
    console.log('counter =>', counter.publicKey.toString());
    console.log('signatuer =>', signatuer);
  });

  it("Updates a counter", async () => {
    const signatuer = await program.methods
      .increment()
      .accounts({
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      })
      .signers([provider.wallet.payer])
      .rpc()

    const counterAccount = await program.account.counter.fetch(
      counter.publicKey
    );

    assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
    assert.ok(counterAccount.count.toNumber() == 1);
    
    console.log('signatuer =>', signatuer);
  });
});
