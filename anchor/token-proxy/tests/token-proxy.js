const anchor = require("@project-serum/anchor");
const assert = require("assert");

describe("token", () => {
  const provider = anchor.Provider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.TokenProxy;

  let mint = null;
  let from = null;
  let to = null;

  it("Initializes test state", async () => {
    // createMint and createTokenAccount function are in this code. It's not @project-serum/common function.
    mint = await createMint(provider);
    from = await createTokenAccount(provider, mint, provider.wallet.publicKey);
    to = await createTokenAccount(provider, mint, provider.wallet.publicKey);

    console.log("\n-----------------------------------------------------------");
    console.log("mint                             ->", mint.toString());
    console.log("from                             ->", from.toString());
    console.log("to                               ->", to.toString());
    console.log("-----------------------------------------------------------\n");
  });

  it("Mints a token", async () => {
    const tx = await program.rpc.proxyMintTo(new anchor.BN(1000), {
      accounts: {
        authority: provider.wallet.publicKey,
        mint,
        to: from,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const fromAccount = await getTokenAccount(provider, from);

    assert.ok(fromAccount.amount.eq(new anchor.BN(1000)));

    console.log("\n-----------------------------------------------------------");
    console.log("tx                               ->", tx);
    console.log("fromAccount.amount               ->", fromAccount.amount.toNumber());
    console.log("-----------------------------------------------------------\n");
  });

  it("Transfers a token", async () => {
    const tx = await program.rpc.proxyTransfer(new anchor.BN(400), {
      accounts: {
        authority: provider.wallet.publicKey,
        to,
        from,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const fromAccount = await getTokenAccount(provider, from);
    const toAccount = await getTokenAccount(provider, to);

    assert.ok(fromAccount.amount.eq(new anchor.BN(600)));
    assert.ok(toAccount.amount.eq(new anchor.BN(400)));

    console.log("\n-----------------------------------------------------------");
    console.log("proxyTransfer amount             ->", new anchor.BN(400).toNumber());
    console.log("proxyTransfer authority          ->", provider.wallet.publicKey.toString());
    console.log("proxyTransfer to                 ->", to.toString());
    console.log("proxyTransfer from               ->", from.toString());
    console.log("proxyTransfer tokenProgram       ->", TokenInstructions.TOKEN_PROGRAM_ID.toString());
    console.log("-------------------------------------------------------------");
    console.log("tx                               ->", tx);
    console.log("fromAccount.mint                 ->", fromAccount.mint.toString());
    console.log("fromAccount.owner                ->", fromAccount.owner.toString());
    console.log("fromAccount.amount(1000 - 400 =) ->", fromAccount.amount.toNumber());
    console.log("toAccount.mint                   ->", toAccount.mint.toString());
    console.log("toAccount.owner                  ->", toAccount.owner.toString());
    console.log("toAccount.amount                 ->", toAccount.amount.toNumber());
    console.log("-----------------------------------------------------------\n");
  });

  it("Burns a token", async () => {
    const tx = await program.rpc.proxyBurn(new anchor.BN(399), {
      accounts: {
        authority: provider.wallet.publicKey,
        mint,
        to,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
      },
    });

    const toAccount = await getTokenAccount(provider, to);
    assert.ok(toAccount.amount.eq(new anchor.BN(1)));

    console.log("\n-----------------------------------------------------------");
    console.log("tx                               ->", tx);
    console.log("toAccount.amount(400 - 399 =)    ->", toAccount.amount.toNumber());
    console.log("-----------------------------------------------------------\n");
  });

  it("Set new mint authority", async () => {
    const newMintAuthority = anchor.web3.Keypair.generate();
    const tx = await program.rpc.proxySetAuthority(
      { mintTokens: {} },
      newMintAuthority.publicKey,
      {
        accounts: {
          accountOrMint: mint,
          currentAuthority: provider.wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        },
      }
    );

    const mintInfo = await getMintInfo(provider, mint);
    assert.ok(mintInfo.mintAuthority.equals(newMintAuthority.publicKey));

    console.log("\n-----------------------------------------------------------");
    console.log("tx                               ->", tx);
    console.log("newMintAuthority                 ->", newMintAuthority.publicKey.toString());
    console.log("mintInfo.mintAuthority           ->", mintInfo.mintAuthority.toString());
    console.log("-----------------------------------------------------------\n");
  });
});

// SPL token client boilerplate for test initialization. Everything below here is
// mostly irrelevant to the point of the example.

// Ref: https://github.com/project-serum/serum-ts/blob/master/packages/common/src/index.ts
const serumCmn = require("@project-serum/common");
const TokenInstructions = require("@project-serum/serum").TokenInstructions;

// TODO: remove this constant once @project-serum/serum uses the same version
//       of @solana/web3.js as anchor (or switch packages).
const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
  TokenInstructions.TOKEN_PROGRAM_ID.toString()
);

async function getTokenAccount(provider, addr) {
  return await serumCmn.getTokenAccount(provider, addr);
}

async function getMintInfo(provider, mintAddr) {
  return await serumCmn.getMintInfo(provider, mintAddr);
}

async function createMint(provider, authority) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey;
  }
  const mint = anchor.web3.Keypair.generate();
  const instructions = await createMintInstructions(
    provider,
    authority,
    mint.publicKey
  );

  const tx = new anchor.web3.Transaction();
  tx.add(...instructions);

  const tx_sig = await provider.send(tx, [mint]);

  console.log("\n-----------------------------------------------------------");
  console.log("instructions   ->", instructions);
  console.log("-------------------------------------------------------------");
  console.log("tx             ->", tx);
  console.log("-------------------------------------------------------------");
  console.log("create mint tx ->", tx_sig);
  console.log("-----------------------------------------------------------\n");

  return mint.publicKey;
}

async function createMintInstructions(provider, authority, mint) {
  let instructions = [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeMint({
      mint,
      decimals: 0,
      mintAuthority: authority,
    }),
  ];
  return instructions;
}

async function createTokenAccount(provider, mint, owner) {
  const vault = anchor.web3.Keypair.generate();
  const tx = new anchor.web3.Transaction();
  tx.add(
    ...(await createTokenAccountInstrs(provider, vault.publicKey, mint, owner))
  );
  const tx_sig = await provider.send(tx, [vault]);

  console.log("\n-----------------------------------------------------------");
  console.log("tx                     ->", tx);
  console.log("\n");
  console.log("createTokenAccount sig ->", tx_sig);
  console.log("-----------------------------------------------------------\n");

  return vault.publicKey;
}

async function createTokenAccountInstrs(
  provider,
  newAccountPubkey,
  mint,
  owner,
  lamports
) {
  if (lamports === undefined) {
    lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
  }
  return [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey,
      space: 165,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeAccount({
      account: newAccountPubkey,
      mint,
      owner,
    }),
  ];
}

/*
% anchor test

~~~ skip ~~~

token

-----------------------------------------------------------
instructions   -> [
TransactionInstruction {
  keys: [ [Object], [Object] ],
  programId: PublicKey { _bn: <BN: 0> },
  data: <Buffer 00 00 00 00 60 4d 16 00 00 00 00 00 52 00 00 00 00 00 00 00 06 dd f6 e1 d7 65 a1 93 d9 cb e1 46 ce eb 79 ac 1c b4 85 ed 5f 5b 37 91 3a 8c f5 85 7e ff ... 2 more bytes>
},
TransactionInstruction {
  keys: [ [Object], [Object] ],
  programId: PublicKey {
    _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
  },
  data: <Buffer 00 00 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 17 more bytes>
}
]
-------------------------------------------------------------
tx             -> Transaction {
signatures: [
  {
    signature: <Buffer 95 6c 42 81 6b d0 c1 97 94 1d 3c d9 69 99 f3 89 c1 34 60 1b ed 1e 82 54 96 18 44 86 d7 b3 36 73 27 6e 20 a0 f9 25 e0 c0 08 9d 97 21 2a 0d ef 88 50 6d ... 14 more bytes>,
    publicKey: [PublicKey]
  },
  {
    signature: <Buffer d6 35 ec 5a 57 57 94 78 2c 95 eb 86 1d 2a 5b 3d 10 48 3d c6 84 40 fd 2d 9e 1a ed d3 c8 70 ce c0 49 a3 de 6f 73 e3 0f f8 fc 94 ba d1 2a cb 5f 28 90 65 ... 14 more bytes>,
    publicKey: [PublicKey]
  }
],
feePayer: PublicKey {
  _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
},
instructions: [
  TransactionInstruction {
    keys: [Array],
    programId: [PublicKey],
    data: <Buffer 00 00 00 00 60 4d 16 00 00 00 00 00 52 00 00 00 00 00 00 00 06 dd f6 e1 d7 65 a1 93 d9 cb e1 46 ce eb 79 ac 1c b4 85 ed 5f 5b 37 91 3a 8c f5 85 7e ff ... 2 more bytes>
  },
  TransactionInstruction {
    keys: [Array],
    programId: [PublicKey],
    data: <Buffer 00 00 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 17 more bytes>
  }
],
recentBlockhash: 'A1TkeHWUqKBXc25TYD17E7JzwoQJ39dDm16W6wVC35zV',
nonceInfo: undefined
}
-------------------------------------------------------------
create mint tx -> 3zGkpH7mg1ePYwR5sBn4peZVFr1QxdMiMdNEQ43C1A62Eh7VvLYH9T1DpqM7epwUyAc6gnijKidLTotDZXezvBKE
-----------------------------------------------------------


-----------------------------------------------------------
tx                     -> Transaction {
signatures: [
  {
    signature: <Buffer de 51 b8 bf d1 68 6e 2e 26 10 db c5 52 eb 47 eb 58 38 0e 38 87 bd 68 1f 83 36 be 75 6e 45 af 6a 84 e4 04 38 09 33 58 5a 19 6c 22 15 e0 e1 0d 50 3b 10 ... 14 more bytes>,
    publicKey: [PublicKey]
  },
  {
    signature: <Buffer 3d 16 2c f9 ac f8 6f 09 c4 9b 20 e8 5c a2 66 1c c5 f9 25 45 34 24 b4 c5 b8 d0 e7 77 b1 74 de 83 1e e8 c7 79 e1 9a 83 eb 31 61 66 7c 25 59 e2 08 a1 f6 ... 14 more bytes>,
    publicKey: [PublicKey]
  }
],
feePayer: PublicKey {
  _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
},
instructions: [
  TransactionInstruction {
    keys: [Array],
    programId: [PublicKey],
    data: <Buffer 00 00 00 00 f0 1d 1f 00 00 00 00 00 a5 00 00 00 00 00 00 00 06 dd f6 e1 d7 65 a1 93 d9 cb e1 46 ce eb 79 ac 1c b4 85 ed 5f 5b 37 91 3a 8c f5 85 7e ff ... 2 more bytes>
  },
  TransactionInstruction {
    keys: [Array],
    programId: [PublicKey],
    data: <Buffer 01>
  }
],
recentBlockhash: 'A1TkeHWUqKBXc25TYD17E7JzwoQJ39dDm16W6wVC35zV',
nonceInfo: undefined
}


createTokenAccount sig -> 5SoZ8yEG2ZmLL7D92jY5vYt6t6rpV3LwEsy8JnncbBQwXXxZdbTTi4wr3ciQS6SYHWg8FMJcmk3mafsA7VhrDtc1
-----------------------------------------------------------


-----------------------------------------------------------
tx                     -> Transaction {
signatures: [
  {
    signature: <Buffer c5 f6 82 56 4f 21 9b 3b 32 01 3e ab 37 cf 32 6a 5e b1 fb 7f ce 45 29 b2 f8 eb 19 8d 59 85 9f 83 18 a8 c5 70 04 55 6d 20 57 8f 66 5f 8e 07 7a 7f 82 a1 ... 14 more bytes>,
    publicKey: [PublicKey]
  },
  {
    signature: <Buffer 47 3c f1 99 a0 dd d9 ce 67 65 aa 18 ff 75 72 c3 8d bb 6d 06 6b 11 d5 d2 8c 96 a2 c6 c2 34 bf 99 de 2e a2 e0 56 26 81 56 4e e5 df 3e c7 fe c5 71 bf 25 ... 14 more bytes>,
    publicKey: [PublicKey]
  }
],
feePayer: PublicKey {
  _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
},
instructions: [
  TransactionInstruction {
    keys: [Array],
    programId: [PublicKey],
    data: <Buffer 00 00 00 00 f0 1d 1f 00 00 00 00 00 a5 00 00 00 00 00 00 00 06 dd f6 e1 d7 65 a1 93 d9 cb e1 46 ce eb 79 ac 1c b4 85 ed 5f 5b 37 91 3a 8c f5 85 7e ff ... 2 more bytes>
  },
  TransactionInstruction {
    keys: [Array],
    programId: [PublicKey],
    data: <Buffer 01>
  }
],
recentBlockhash: 'EHhicf3ixaWrSQTQ28a3Nj7acpBzfywKSSG8B5vbcX5r',
nonceInfo: undefined
}


createTokenAccount sig -> 4xZRKDbtsgubL1fMkLfVTqKRL9jyJ6YjobYpcBuxBxn4w1PUgJzzdg3TTsvFWEq6eQ5nsWFDQxXvTE8Kvox9KY9i
-----------------------------------------------------------


-----------------------------------------------------------
mint                             -> AqY4fzpuBgpbYFwALLC4KgtjRXjgEtSSiQkqEfe9ikcC
from                             -> EcDoDus9Jo9QFUx1FxLorRmWDdGAioYx7YffFEfNiVDG
to                               -> GP5jiy2Bd1AEqMtn43wjHfqtomxMTfwoXZPr13YPckuH
-----------------------------------------------------------

  ✔ Initializes test state (1566ms)

-----------------------------------------------------------
tx                               -> 2JkCMvyDg4YqK7ZZVtariuCzZ19Z5Sm7f84AezhQBNz2JrPBQSvXDMd7C1fWpeuW24WFDJ2QF4BjkAm6qwg5Ue32
fromAccount.amount               -> 1000
-----------------------------------------------------------

  ✔ Mints a token (480ms)

-----------------------------------------------------------
proxyTransfer amount             -> 400
proxyTransfer authority          -> HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
proxyTransfer to                 -> GP5jiy2Bd1AEqMtn43wjHfqtomxMTfwoXZPr13YPckuH
proxyTransfer from               -> EcDoDus9Jo9QFUx1FxLorRmWDdGAioYx7YffFEfNiVDG
proxyTransfer tokenProgram       -> TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
-------------------------------------------------------------
tx                               -> 5cQtA7i874uyQLh6uvmcLngdWYGBfheTJJ5xMxFFgStaZ6ppa7LYakXHawhfNrdHkkyPbN9p51q2uVWm5AzboYRK
fromAccount.mint                 -> AqY4fzpuBgpbYFwALLC4KgtjRXjgEtSSiQkqEfe9ikcC
fromAccount.owner                -> HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
fromAccount.amount(1000 - 400 =) -> 600
toAccount.mint                   -> AqY4fzpuBgpbYFwALLC4KgtjRXjgEtSSiQkqEfe9ikcC
toAccount.owner                  -> HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
toAccount.amount                 -> 400
-----------------------------------------------------------

  ✔ Transfers a token (475ms)

-----------------------------------------------------------
tx                               -> xasPZqsFHfVWnRWokmxhHwSbHgVMkyxJ1oK6mQydXkBZSDeQiXf6ppZ73sN4ytZpRS4EPdDxy6yVmDhr83xPuZS
toAccount.amount(400 - 399 =)    -> 1
-----------------------------------------------------------

  ✔ Burns a token (465ms)

-----------------------------------------------------------
tx                               -> nA1WF3uRs6THbJ2jJAMz1sEaw7foLH3Va5dqC47ag86fb7L7AeYXDAULgkgUh1qdjzd9cVrQqVemUsn275Liygw
newMintAuthority                 -> 76RqgEgKo7CkvNXAJbHYcgUiTNrmXRLDLhy72YoiByUw
mintInfo.mintAuthority           -> 76RqgEgKo7CkvNXAJbHYcgUiTNrmXRLDLhy72YoiByUw
-----------------------------------------------------------

  ✔ Set new mint authority (462ms)


5 passing (3s)

✨  Done in 9.35s.
*/
