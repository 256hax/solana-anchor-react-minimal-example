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

  let pda = null;
  let bump = null;
  let mint = null;

  // User
  // Wallet is provider.wallet.publicKey. Keypair is provider.wallet.payer.
  let userTokenAccount = null;
  let userTokenBalance = null;

  // Admin
  const admin = Keypair.generate();
  let adminTokenAccount = null;
  let adminTokenBalance = null;

  it('Gets a PDA.', async () => {
    // It need underscore vars. Shouldn't directly into vars(ex: let pda; [pda, bump] = xxx;).
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

  it('Creates a counter account.', async () => {
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

    let fetchCounter = await program.account.counter.fetch(pda);
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

  it("Airdrop for admin.", async () => {
    let airdropSignature = await connection.requestAirdrop(
        admin.publicKey,
        LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
  });

  it("Creates a token.", async () => {
    mint = await createMint(
      connection,                 // connection,
      admin,      // payer,
      admin.publicKey,  // authority,
      null,                       // freeze_authority???
      9                           // decimals
    );
    assert.ok(mint);

    console.log('\n');
    console.log('mint =>', mint.toString());
    console.log('---------------------------------------------------');
  });

  it("Creates a userTokenAccount.", async () => {
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

  it("Creates a adminTokenAccount.", async () => {
    adminTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,               // connection: Connection,
      admin,    // payer: Signer,
      mint,                     // mint: PublicKey,
      admin.publicKey           // owner: PublicKey,
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(Number(userTokenBalance.value.amount) === 0);
    assert.ok(Number(adminTokenBalance.value.amount) === 0);

    console.log('\n');
    console.log('adminTokenAccount =>', adminTokenAccount.address.toString());
    console.log('userTokenBalance =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance =>', adminTokenBalance.value.amount);
    console.log('---------------------------------------------------');
  });

  it("Mints tokens.", async () => {
    const mint_tx = await mintTo(
      connection,                   // Connection
      admin,        // Payer
      mint,                         // Mint Address
      adminTokenAccount.address, // Destination Address
      admin.publicKey,    // Mint Authority
      LAMPORTS_PER_SOL,             // Mint Amount
      []                            // Signers???
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(Number(userTokenBalance.value.amount) === 0);
    assert.ok(Number(adminTokenBalance.value.amount) === LAMPORTS_PER_SOL);

    console.log('\n');
    console.log('userTokenBalance =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance =>', adminTokenBalance.value.amount);
    console.log('mint_tx =>', mint_tx)
    console.log('---------------------------------------------------');
  });

  // Read count in counter account then transfers counter amount same tokens.
  it("Transfers 1 token.", async () => {
    let fetchCounter = await program.account.counter.fetch(pda);

    const transfer_tx = await transfer(
      connection,                   // Connection
      admin,        // Payer
      adminTokenAccount.address, // From Address
      userTokenAccount.address,    // To Address
      admin.publicKey,    // Authority
      fetchCounter.count,           // Transfer Amount
      []                            // Signers???
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(Number(userTokenBalance.value.amount) === 1);

    console.log('\n');
    console.log('userTokenBalance =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance =>', adminTokenBalance.value.amount);
    console.log('fetchCounter =>', fetchCounter);
    console.log('transfer_tx =>', transfer_tx)
    console.log('---------------------------------------------------');
  });

  // Increments count then transfers token.
  it("Transfers 2 tokens.", async () => {
    const increment_tx_2nd = await program.rpc.increment({
      accounts: {
        counter: pda,
        user: provider.wallet.publicKey,
      },
    });

    let fetchCounter = await program.account.counter.fetch(pda);

    const transfer_tx_2nd = await transfer(
      connection,                   // Connection
      admin,        // Payer
      adminTokenAccount.address, // From Address
      userTokenAccount.address,    // To Address
      admin.publicKey,    // Authority
      fetchCounter.count,           // Transfer Amount
      []                            // Signers???
    );

    userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount.address);
    adminTokenBalance = await connection.getTokenAccountBalance(adminTokenAccount.address);
    assert.ok(fetchCounter.count === 2);
    assert.ok(Number(userTokenBalance.value.amount) === 3);

    console.log('\n');
    console.log('userTokenBalance =>', userTokenBalance.value.amount);
    console.log('adminTokenBalance =>', adminTokenBalance.value.amount);
    console.log('fetchCounter =>', fetchCounter);
    console.log('transfer_tx_2nd =>', transfer_tx_2nd)
    console.log('---------------------------------------------------');
  });
});

/*
% anchor test

post_to_earn
  ✓ Gets PDA.


pda          => Gr5Byc7RVyPuBYDvQH4fktcvYgVnBg1rU3VryjC7Mcfy
bump         => 255
fetchCounter => {
authority: PublicKey {
  _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
},
bump: 255,
count: 0
}
create_tx    => 5vbJbFmJx7qYr39vxW2z2Lr3DN4ZVMai9RUtCQSnsYTAgg5gyemnefwAjCZuKcU3rwhJKafjukEysbuuqcU995hD
---------------------------------------------------
  ✓ Creates counter accounts. (223ms)


fetchCounter => {
authority: PublicKey {
  _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
},
bump: 255,
count: 1
}
increment_tx => 4G3xK1G5vNfqoyJFMUwp5Tbt57GdbHaXPX6HTgcaCXuGpr4hgBJ3NBWxEacAmWKDtMtx3TAd6WH7V69naQjLN4Rw
---------------------------------------------------
  ✓ Increments a count. (455ms)


mint => BgTGDKL7kBGUydhEyRbrugHQVqBVxRAyumQJ4mM5EH5b
---------------------------------------------------
  ✓ Creates a token. (454ms)


providerTokenWallet => 4La4yibQ8sT2PTUMVZ3SPTfU47ZGNXekNfGhYZgqat9W
---------------------------------------------------
  ✓ Creates a userTokenAccount. (450ms)


userTokenBalance => 0
adminTokenBalance => 0
adminTokenAccount => 3KQXtVSop8KNPvqVP9XLRsHt3gktYMfFmJcTHY9BqavJ
---------------------------------------------------
  ✓ Creates a adminTokenAccount. (455ms)


userTokenBalance => 1000000000
adminTokenBalance => 0
mint_tx => 3srEALFMEQixnFZPCNPN5vSzRVNx6U7LY4rhWPqcjompyfzJG4pkCa9fYMrLAtE2NAYT2NV9vHj6iFfa3Hxfdta4
---------------------------------------------------
  ✓ Mints tokens. (459ms)


userTokenBalance => 999999999
adminTokenBalance => 1
transfer_tx => 1SvkJBCCF6LtYqsoH3o2Kiazz1P1fmGT7Rngv7PL1aZmXtAxWFYo7xqapPXvprbMRpqa1rcxk34bKEJcnQL8ohL
---------------------------------------------------
  ✓ Transfers 1 tokens. (462ms)


userTokenBalance => 999999997
adminTokenBalance => 3
fetchCounter => {
authority: PublicKey {
  _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
},
bump: 255,
count: 2
}
transfer_tx_2nd => 3oWxbWVhiwG4zLvkYMRPfSP4ejyu1QVDGvWn61z7aEaeZGL4fXExze8zin4NR2SArghx4QapNVtSKsgMYsNQG62r
---------------------------------------------------
  ✓ Transfers 2 tokens. (930ms)


9 passing (4s)

✨  Done in 10.16s.
*/
