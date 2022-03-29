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

  let pdaCounter = null;
  let bumpCounter = null;
  let pdaPayment = null;
  let bumpPayment = null;

  let mint = null;

  // User
  // Wallet is provider.wallet.publicKey. Keypair is provider.wallet.payer.
  let userTokenAccount = null;
  let userTokenBalance = null;

  // Admin
  const admin = Keypair.generate();
  let adminTokenAccount = null;
  let adminTokenBalance = null;

  // Payment
  let transferAmount = null;

  it('Gets a PDA for Counter.', async () => {
    // It need underscore vars. Shouldn't directly into vars(ex: let pda; [pda, bump] = xxx;).
    const [_pdaCounter, _bumpCounter] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("counter"),
          provider.wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    // Important
    pdaCounter = _pdaCounter;
    bumpCounter = _bumpCounter;

    assert.ok(pdaCounter);
    assert.ok(bumpCounter);

    console.log('\n');
    console.log('pdaCounter   =>', pdaCounter.toString());
    console.log('bumpCounter  =>', bumpCounter);
  });

  it('Gets a PDA for Payment.', async () => {
    // It need underscore vars. Shouldn't directly into vars(ex: let pda; [pda, bump] = xxx;).
    const [_pdaPayment, _bumpPayment] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("payment"),
          provider.wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    // Important
    pdaPayment = _pdaPayment;
    bumpPayment = _bumpPayment;

    assert.ok(pdaPayment);
    assert.ok(bumpPayment);

    console.log('\n');
    console.log('pdaPayment   =>', pdaPayment.toString());
    console.log('bumpCounter  =>', bumpCounter);
  });

  it('Creates a counter account.', async () => {
    const create_tx = await program.rpc.createCounter(
      {
        accounts: {
          user: provider.wallet.publicKey,
          counter: pdaCounter,
          systemProgram: SystemProgram.programId
        }
      }
    );

    let fetchCounter = await program.account.counter.fetch(pdaCounter);
    assert.ok(fetchCounter);

    console.log('\n');
    console.log('fetchCounter =>', fetchCounter);
    console.log('create_tx    =>', create_tx);
    console.log('---------------------------------------------------');
  });

  it('Creates a payment account.', async () => {
    const createPayment_tx = await program.rpc.createPayment(
      {
        accounts: {
          user: provider.wallet.publicKey,
          payment: pdaPayment,
          systemProgram: SystemProgram.programId
        }
      }
    );

    let fetchPayment = await program.account.payment.fetch(pdaPayment);
    assert.ok(fetchPayment);

    console.log('\n');
    console.log('fetchPayment     =>', fetchPayment);
    console.log('createPayment_tx =>', createPayment_tx);
    console.log('---------------------------------------------------');
  });

  it("Increments a count.", async () => {
    const increment_tx = await program.rpc.incrementCounter({
      accounts: {
        user: provider.wallet.publicKey,
        counter: pdaCounter,
      },
    });

    let fetchCounter = await program.account.counter.fetch(pdaCounter);
    assert.ok(fetchCounter.count === 1);

    console.log('\n');
    console.log('fetchCounter =>', fetchCounter);
    console.log('increment_tx =>', increment_tx);
    console.log('---------------------------------------------------');
  });

  it("Airdrop for admin.", async () => {
    let airdropSignature = await connection.requestAirdrop(
        admin.publicKey,
        LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);

    const adminBalance = await connection.getBalance(admin.publicKey);
    assert.ok(adminBalance === LAMPORTS_PER_SOL);
  });

  it("Creates a token.", async () => {
    mint = await createMint(
      connection,       // connection,
      admin,            // payer,
      admin.publicKey,  // authority,
      null,             // freeze_authority???
      9                 // decimals
    );
    assert.ok(mint);

    console.log('\n');
    console.log('mint =>', mint.toString());
    console.log('---------------------------------------------------');
  });

  it("Creates an userTokenAccount.", async () => {
    userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,               // connection: Connection,
      provider.wallet.payer,    // payer: Signer,
      mint,                     // mint: PublicKey,
      provider.wallet.publicKey // owner: PublicKey,
    );

    assert.ok(userTokenAccount.address);
    assert.ok(Number(userTokenAccount.amount) === 0);

    console.log('\n');
    console.log('userTokenAccount =>', userTokenAccount.address.toString());
    console.log('---------------------------------------------------');
  });

  it("Creates an adminTokenAccount.", async () => {
    adminTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,     // connection: Connection,
      admin,          // payer: Signer,
      mint,           // mint: PublicKey,
      admin.publicKey // owner: PublicKey,
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(Number(userTokenBalance.value.amount) === 0);
    assert.ok(Number(adminTokenBalance.value.amount) === 0);

    console.log('\n');
    console.log('adminTokenAccount  =>', adminTokenAccount.address.toString());
    console.log('userTokenBalance   =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance  =>', adminTokenBalance.value.amount);
    console.log('---------------------------------------------------');
  });

  it("Mints tokens.", async () => {
    const mint_tx = await mintTo(
      connection,                 // Connection
      admin,                      // Payer
      mint,                       // Mint Address
      adminTokenAccount.address,  // Destination Address
      admin.publicKey,            // Mint Authority
      LAMPORTS_PER_SOL,           // Mint Amount
      []                          // Signers???
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(Number(userTokenBalance.value.amount) === 0);
    assert.ok(Number(adminTokenBalance.value.amount) === LAMPORTS_PER_SOL);

    console.log('\n');
    console.log('userTokenBalance   =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance  =>', adminTokenBalance.value.amount);
    console.log('mint_tx            =>', mint_tx)
    console.log('---------------------------------------------------');
  });

  // Read count in counter account then transfers counter amount same tokens.
  it("Transfers 1 token.", async () => {
    let fetchCounter = await program.account.counter.fetch(pdaCounter);
    let fetchPayment = await program.account.payment.fetch(pdaPayment);
    let transferAmount = fetchCounter.count - fetchPayment.count;

    const transfer_tx = await transfer(
      connection,                 // Connection
      admin,                      // Payer
      adminTokenAccount.address,  // From Address
      userTokenAccount.address,   // To Address
      admin.publicKey,            // Authority
      transferAmount,             // Transfer Amount
      []                          // Signers???
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(Number(userTokenBalance.value.amount) === 1);

    console.log('\n');
    console.log('userTokenBalance   =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance  =>', adminTokenBalance.value.amount);
    console.log('fetchCounter       =>', fetchCounter);
    console.log('fetchPayment       =>', fetchPayment);
    console.log('transfer_tx        =>', transfer_tx)
    console.log('---------------------------------------------------');
  });

  // Write transfer evidence to payment.
  it("Update payment.", async () => {
    const updatePayment_tx = await program.rpc.updatePayment({
      accounts: {
        user: provider.wallet.publicKey,
        payment: pdaPayment,
        counter: pdaCounter,
      },
    });

    let fetchCounter = await program.account.counter.fetch(pdaCounter);
    let fetchPayment = await program.account.payment.fetch(pdaPayment);
    assert.ok(fetchPayment.count === 1);

    console.log('\n');
    console.log('fetchCounter     =>', fetchCounter);
    console.log('fetchPayment     =>', fetchPayment);
    console.log('updatePayment_tx =>', updatePayment_tx);
    console.log('---------------------------------------------------');
  });
});

/*
% anchor test

post_to_earn


pdaCounter   => Gr5Byc7RVyPuBYDvQH4fktcvYgVnBg1rU3VryjC7Mcfy
bumpCounter  => 255
  ✓ Gets a PDA for Counter.


pdaPayment   => 5b1FyYLd6rDkP3usQND2Zugzn1DnMsCRRsaDjCgMjJoT
bumpCounter  => 255
  ✓ Gets a PDA for Payment.


fetchCounter => { bump: 255, count: 0 }
create_tx    => f1UnWxim4SCr2sZbH9kceeE5bfvPQejrhnrqy93sSr8trfYt5VRqgdAtvbB9HeQzhW4XpY1AwHghReJUW1QqeUB
---------------------------------------------------
  ✓ Creates a counter account. (340ms)


fetchPayment     => { bump: 255, count: 0 }
createPayment_tx => YMNwCf2Jv4pZ3LJ7cdeEYR3fxhfT7MpgRjBAG6fRurbZHmDB7phHvayLuQd3nneRZeu3jo1Zfsz2CZhzBN4HQNx
---------------------------------------------------
  ✓ Creates a payment account. (474ms)


fetchCounter => { bump: 255, count: 1 }
increment_tx => 2PFA9LEQRiKQVxnzFWsd2iEBgkEjntceGA9zwgCWwZhRkvH5cvxU2qaa729KNMUkCB1mhHM8mFAmAX59ek4Lrs1A
---------------------------------------------------
  ✓ Increments a count. (482ms)
  ✓ Airdrop for admin. (471ms)


mint => HNLUCbWEtQdtzEz4UrtXGvapnRxzqxh49dJbHQtQWM1i
---------------------------------------------------
  ✓ Creates a token. (470ms)


userTokenAccount => GkEQznoUT6BZ95SvFb2AD7T9S33AcxGUexTTjUnuGjxy
---------------------------------------------------
  ✓ Creates an userTokenAccount. (477ms)


adminTokenAccount  => 2v62Fkve1vJQZdZ25QjeB8C99SGWcXx7daqGMTVRsSQk
userTokenBalance   => 0
adminTokenBalance  => 0
---------------------------------------------------
  ✓ Creates an adminTokenAccount. (462ms)


userTokenBalance   => 0
adminTokenBalance  => 1000000000
mint_tx            => 5rqzsPNyi5qmtoeZqihWDhgMULJ1D3NSCh3DWqewFBZa5GFWXSk2GaxG7rHgPrkz7uvw5VyjzQxeGEkCzhH9AgKA
---------------------------------------------------
  ✓ Mints tokens. (448ms)


userTokenBalance   => 1
adminTokenBalance  => 999999999
fetchCounter       => { bump: 255, count: 1 }
fetchPayment       => { bump: 255, count: 0 }
transfer_tx        => 31nadWJWq4QwW23p78vSSi3C9oahdhSsv21cj5d6SYFakjgTJm1nTv2TPdk3PLurRw822VrfMHSK9ge5sqeLxxLJ
---------------------------------------------------
  ✓ Transfers 1 token. (430ms)


fetchCounter     => { bump: 255, count: 1 }
fetchPayment     => { bump: 255, count: 1 }
updatePayment_tx => 65c9R9bMin15xj9VzGEPv2Pc6vx5a9dZpfZ3Hcdct7gFgDFgSf1PWuSM1MT13byRnN58qjPcQDTNXvcLD2Bwyb87
---------------------------------------------------
  ✓ Update payment. (479ms)


12 passing (5s)

✨  Done in 10.49s.
*/
