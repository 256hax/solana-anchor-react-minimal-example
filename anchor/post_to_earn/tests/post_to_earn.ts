import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { PostToEarn } from '../target/types/post_to_earn';
import { assert } from 'chai';

describe('post_to_earn', async() => {
  const provider = anchor.Provider.local();
  const connection = provider.connection
  anchor.setProvider(provider);

  const program = anchor.workspace.PostToEarn as Program<PostToEarn>;
  let pda = null;
  let bump = null;
  let mint = null;
  let providerTokenWallet = null;

  it('Gets PDA.', async () => {
    // It need underscore var. Shouldn't directly into var.
    const [_pda, _bump] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("counter"),
          provider.wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    // Important
    pda = _pda;
    bump = _bump;

    assert.ok(pda);
    assert.ok(bump);
  });

  it('Creates counter accounts.', async () => {

    const create_tx = await program.rpc.create(
      provider.wallet.publicKey,
      {
        accounts: {
          user: provider.wallet.publicKey,
          counter: pda,
          systemProgram: SystemProgram.programId
        }
      }
    );

    const fetchCounter = await program.account.counter.fetch(pda);
    assert.ok(fetchCounter);

    console.log('\n');
    console.log('pda          =>', pda.toString());
    console.log('bump         =>', bump);
    console.log('fetchCounter =>', fetchCounter);
    console.log('create_tx    =>', create_tx);
    console.log('---------------------------------------------------');
  });

  it("Updates a counter.", async () => {
    const increment_tx = await program.rpc.increment({
      accounts: {
        counter: pda,
        user: provider.wallet.publicKey,
      },
    });

    let fetchCounter = await program.account.counter.fetch(pda);
    assert.ok(fetchCounter.count === 1);

    console.log('\n');
    console.log('fetchCounter =>', fetchCounter);
    console.log('increment_tx =>', increment_tx);
    console.log('---------------------------------------------------');
  });

  it("Creates a token.", async () => {
    mint = await createMint(
      connection,                 // connection,
      provider.wallet.payer,      // payer,
      provider.wallet.publicKey,  // authority,
      null,                       // freeze_authority???
      9                           // decimals
    );

    providerTokenWallet = await getOrCreateAssociatedTokenAccount(
      connection,               // connection: Connection,
      provider.wallet.payer,    // payer: Signer,
      mint,                     // mint: PublicKey,
      provider.wallet.publicKey // owner: PublicKey,
    );

    assert.ok(mint);
    assert.ok(providerTokenWallet.address);
    
    console.log(mint);
    console.log(providerTokenWallet);
    console.log('---------------------------------------------------');
  });
  //
  // it("Mints tokens.", async () => {
  //   const signatureMint = await splToken.mintTo(
  //     connection,             // Connection
  //     providerWallet.payer,                  // Payer
  //     mint,                   // Mint Address
  //     providerTokenAccount.address,     // Destination Address
  //     providerWallet.publicKey,         // Mint Authority
  //     web3.LAMPORTS_PER_SOL,  // Mint Amount
  //     []                      // Signers???
  //   );
  //
  //   const getMintedProviderTokenAccount = await splToken.getAccount(connection, providerTokenAccount.address);
  //   assert.ok(Number(getMintedProviderTokenAccount.amount) === web3.LAMPORTS_PER_SOL);
  // });
  //
  // it("Updates a counter.", async () => {
  //   const program = anchor.workspace.PostToEarn;
  //
  //   await program.rpc.increment({
  //     accounts: {
  //       counter: counter.publicKey,
  //       authority: provider.wallet.publicKey,
  //     },
  //   });
  //
  //   let counterAccount = await program.account.counter.fetch(
  //     counter.publicKey
  //   );
  //
  //   assert.ok(counterAccount.authority.equals(provider.wallet.publicKey));
  //   assert.ok(counterAccount.count.toNumber() === 1);
  // });
  //
  // it("Transfers token.", async () => {
  //   const signatureTransfer = await splToken.transfer(
  //     connection,                 // Connection
  //     providerWallet.payer,                 // Payer
  //     providerTokenAccount.address,   // From Address
  //     providerTokenAccount.address,     // To Address
  //     providerWallet.publicKey,       // Authority
  //     web3.LAMPORTS_PER_SOL,      // Transfer Amount
  //     []                          // Signers???
  //   );
  // });
  //
  // it("Resets counter.", async () => {
  //   const program = anchor.workspace.PostToEarn;
  //
  //   await program.rpc.reset({
  //     accounts: {
  //       counter: counter.publicKey,
  //       authority: provider.wallet.publicKey,
  //     },
  //   });
  //
  //   let counterAccount = await program.account.counter.fetch(counter.publicKey);
  //
  //   assert.ok(counterAccount.count.toNumber() === 0)
  // });
});
