import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount, transfer } from '@solana/spl-token';
import { PostToEarn } from '../target/types/post_to_earn';
import { assert } from 'chai';

describe('post_to_earn', async() => {
  const provider = anchor.Provider.local();
  const connection = provider.connection
  anchor.setProvider(provider);
  const program = anchor.workspace.PostToEarn as Program<PostToEarn>;

  // const taker = anchor.web3.Keypair.generate();

  let pda = null;
  let bump = null;
  let mint = null;
  let providerTokenWallet = null;
  // let takerTokenWallet = null;

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

  it("Increments a count.", async () => {
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

    console.log('\n');
    console.log('mint =>', mint.toString());
    console.log('providerTokenWallet =>', providerTokenWallet.address.toString());
    console.log('---------------------------------------------------');
  });

  it("Mints tokens.", async () => {
    const mint_tx = await mintTo(
      connection,             // Connection
      provider.wallet.payer,                  // Payer
      mint,                   // Mint Address
      providerTokenWallet.address,     // Destination Address
      provider.wallet.publicKey,         // Mint Authority
      LAMPORTS_PER_SOL,  // Mint Amount
      []                      // Signers???
    );

    const getMintedProviderTokenAccount = await getAccount(connection, providerTokenWallet.address);
    assert.ok(Number(getMintedProviderTokenAccount.amount) === LAMPORTS_PER_SOL);

    console.log('\n');
    console.log('mint_tx =>', mint_tx)
    console.log('---------------------------------------------------');
  });

  // Read count in counter account then transfers counter amount same tokens.
  it("Transfers LAMPORTS_PER_SOL tokens.", async () => {
    let fetchCounter = await program.account.counter.fetch(pda);

    const transfer_tx = await transfer(
      connection,                 // Connection
      provider.wallet.payer,                 // Payer
      providerTokenWallet.address,   // From Address
      providerTokenWallet.address,     // To Address
      provider.wallet.publicKey,       // Authority
      fetchCounter.count,      // Transfer Amount
      []                          // Signers???
    );

    console.log('\n');
    console.log('transfer_tx =>', transfer_tx)
    console.log('---------------------------------------------------');
  });

  // Increments count then transfers token.
  it("Transfers LAMPORTS_PER_SOL * 2 tokens.", async () => {
    const increment_tx_2nd = await program.rpc.increment({
      accounts: {
        counter: pda,
        user: provider.wallet.publicKey,
      },
    });

    let fetchCounter = await program.account.counter.fetch(pda);
    assert.ok(fetchCounter.count === 2);

    const transfer_tx_2nd = await transfer(
      connection,                 // Connection
      provider.wallet.payer,                 // Payer
      providerTokenWallet.address,   // From Address
      providerTokenWallet.address,     // To Address
      provider.wallet.publicKey,       // Authority
      fetchCounter.count,      // Transfer Amount
      []                          // Signers???
    );

    console.log('\n');
    console.log('transfer_tx_2nd =>', transfer_tx_2nd)
    console.log('---------------------------------------------------');
  });
});
