// Docs: https://www.quicknode.com/guides/solana-development/anchor/transfer-tokens
// Solana
import { Keypair } from '@solana/web3.js';
import {
  createMint,
  createAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
  mintTo,
} from '@solana/spl-token';

// Anchor
import * as anchor from '@coral-xyz/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { TransferSol } from '../target/types/transfer_sol';

// Lib
import { assert } from 'chai';

describe('transfer-sol', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.AnchorProvider.env();
  // @ts-ignore
  const payer = provider.wallet.payer;

  const program = anchor.workspace.TransferSol as Program<TransferSol>;

  it('Trasnfer SOL(Lamports) to random taker', async () => {
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

    console.log('---------------------------------------');
    console.log('Trasnfer SOL(Lamports) to random taker');
    console.log('---------------------------------------');
    console.log('payer =>', payer.publicKey);
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

  it('Trasnfer SPL Token to random taker', async () => {
    // Generate keypairs for the new accounts
    const taker = new Keypair();

    // Create a new mint and initialize it
    const mint = await createMint(
      provider.connection,
      payer,
      provider.wallet.publicKey,
      null,
      0
    );

    // Create associated token accounts for the new accounts
    const payerAta = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      mint,
      provider.wallet.publicKey
    );
    const takerAta = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      mint,
      taker.publicKey
    );
    // Mint tokens to the 'from' associated token account
    const mintAmount = 1000;
    const mintedSignature = await mintTo(
      provider.connection,
      payer,
      mint,
      payerAta,
      provider.wallet.publicKey,
      mintAmount
    );

    // Send transaction
    const transferAmount = new BN(500);
    const transferredSignature = await program.methods
      .transferSplTokens(transferAmount)
      .accounts({
        from: provider.wallet.publicKey,
        fromAta: payerAta,
        toAta: takerAta,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();


    console.log('---------------------------------------');
    console.log('Trasnfer SPL Token to random taker');
    console.log('---------------------------------------');
    console.log('payer =>', payer.publicKey);
    console.log('taker =>', taker.publicKey);
    console.log('mintedSignature =>', mintedSignature);
    console.log('transferredSignature =>', transferredSignature);

    const toTokenAccount = await provider.connection.getTokenAccountBalance(takerAta);
    assert.strictEqual(
      toTokenAccount.value.uiAmount,
      transferAmount.toNumber(),
      "The 'to' token account should have the transferred tokens"
    );
  });
});
