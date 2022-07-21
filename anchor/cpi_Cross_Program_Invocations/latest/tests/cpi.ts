import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PuppetMaster } from "../target/types/puppet_master";
import { Puppet } from "../target/types/puppet";
import { assert } from "chai";

describe("cpi", () => {
  // anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.AnchorProvider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  it("Performs CPI from puppet master to puppet", async () => {
    const puppetMaster = anchor.workspace.PuppetMaster as Program<PuppetMaster>;
    const puppet = anchor.workspace.Puppet as Program<Puppet>;

    // Initialize a new puppet account.
    const newPuppetAccount = anchor.web3.Keypair.generate();
    const tx = await puppet.methods
      .initialize()
      .accounts({
        puppet: newPuppetAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newPuppetAccount])
      .rpc()

    // Invoke the puppet master to perform a CPI to the puppet.
    await puppetMaster.methods
      .pullStrings(new anchor.BN(111))
      .accounts({
        puppet: newPuppetAccount.publicKey,
        puppetProgram: puppet.programId,
      })
      .rpc()

    // Check the state updated.
    const puppetAccount = await puppet.account.data.fetch(newPuppetAccount.publicKey);
    assert.ok(puppetAccount.data.eq(new anchor.BN(111)));
  });
});
