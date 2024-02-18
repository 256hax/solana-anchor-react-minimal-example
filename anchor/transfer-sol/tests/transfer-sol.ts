// Docs: https://www.quicknode.com/guides/solana-development/anchor/transfer-tokens
import * as anchor from '@coral-xyz/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js'
import { TransferSol } from '../target/types/transfer_sol';
import { assert } from 'chai';

describe('transfer-sol', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  // @ts-ignore
  const payer = provider.wallet.payer;

  const program = anchor.workspace.TransferSol as Program<TransferSol>;

  it('Trasnfer SOL to random taker', async () => {
    // Generate keypair for the new account
    const taker = new Keypair();

    // Send transaction
    const data = new BN(1000000);
    const signature = await program.methods
      .transferLamports(data)
      .accounts({
        from: provider.wallet.publicKey,
        to: taker.publicKey,
      })
      .signers([payer])
      .rpc();

    console.log('taker =>', taker.publicKey);
    console.log('signature =>', signature);

    const newAccountBalance = await provider.connection.getBalance(
      taker.publicKey
    );
    assert.strictEqual(
      newAccountBalance,
      data.toNumber(),
      'The new account should have the transferred lamports'
    );
  });
});
