const anchor = require('@project-serum/anchor');

describe('initialize', () => {
  anchor.setProvider(anchor.Provider.env());

  it('Is initialized!', async () => {
    const program = anchor.workspace.Initialize;
    const tx = await program.rpc.initialize();
    console.log("Your transaction signature", tx);
  });
});
