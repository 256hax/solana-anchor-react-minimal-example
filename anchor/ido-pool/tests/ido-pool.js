const anchor = require("@project-serum/anchor");
const assert = require("assert");
const {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} = require("@solana/spl-token");
const {
  sleep,
  getTokenAccount,
  createMint,
  createTokenAccount,
} = require("./utils");
const { token } = require("@project-serum/anchor/dist/cjs/utils");

describe("ido-pool", () => {
  const provider = anchor.Provider.local();
  // const provider = anchor.Provider.env();
  const connection = provider.connection;

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.IdoPool;

  // All mints default to 6 decimal places.
  const watermelonIdoAmount = new anchor.BN(5000000);

  // These are all of the variables we assume exist in the world already and
  // are available to the client.
  let usdcMintAccount = null;       // USDC Token Program Account
  let usdcMint = null;              // Public Key of USDC Token Program Account
  let watermelonMintAccount = null; // Watermelon Token Program Account
  let watermelonMint = null;        // Public Key of Watermelon Token Program Account
  let idoAuthorityUsdc = null;
  let idoAuthorityWatermelon = null;

  it("Initializes the state-of-the-world", async () => {
    usdcMintAccount = await createMint(provider);
    watermelonMintAccount = await createMint(provider);
    usdcMint = usdcMintAccount.publicKey;
    watermelonMint = watermelonMintAccount.publicKey;
    idoAuthorityUsdc = await createTokenAccount(
      provider,
      usdcMint,
      provider.wallet.publicKey
    );
    idoAuthorityWatermelon = await createTokenAccount(
      provider,
      watermelonMint,
      provider.wallet.publicKey
    );
    // Mint Watermelon tokens that will be distributed from the IDO pool.
    await watermelonMintAccount.mintTo(
      idoAuthorityWatermelon,
      provider.wallet.publicKey,
      [],
      watermelonIdoAmount.toString()
    );
    idoAuthority_watermelon_account = await getTokenAccount(
      provider,
      idoAuthorityWatermelon
    );
    assert.ok(idoAuthority_watermelon_account.amount.eq(watermelonIdoAmount));

    console.log("----------------------------------------------------------");
    console.log("idoAuthority_watermelon_account.mint publicKey -> ", idoAuthority_watermelon_account.mint.toString());
    console.log("idoAuthority_watermelon_account.owner publicKey -> ", idoAuthority_watermelon_account.owner.toString());
    console.log("idoAuthority_watermelon_account.amount -> ", idoAuthority_watermelon_account.amount.toNumber().toLocaleString());
    console.log("----------------------------------------------------------\n");
  });

  // These are all variables the client will need to create in order to
  // initialize the IDO pool
  let idoTimes;
  let idoName = "test_ido";

  it("Initializes the IDO pool", async () => {
    let bumps = new PoolBumps();

    const [idoAccount, idoAccountBump] =
      // Ref: https://project-serum.github.io/anchor/ts/classes/web3.PublicKey.html#findProgramAddress
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(idoName)], // seeds
        program.programId
      );
    bumps.idoAccount = idoAccountBump;

    const [redeemableMint, redeemableMintBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(idoName), Buffer.from("redeemable_mint")],
        program.programId
      );
    bumps.redeemableMint = redeemableMintBump;

    const [poolWatermelon, poolWatermelonBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(idoName), Buffer.from("pool_watermelon")],
        program.programId
      );
    bumps.poolWatermelon = poolWatermelonBump;

    const [poolUsdc, poolUsdcBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(idoName), Buffer.from("pool_usdc")],
        program.programId
      );
    bumps.poolUsdc = poolUsdcBump;

    idoTimes = new IdoTimes();
    const nowBn = new anchor.BN(Date.now() / 1000);
    idoTimes.startIdo = nowBn.add(new anchor.BN(5));
    idoTimes.endDeposits = nowBn.add(new anchor.BN(10));
    idoTimes.endIdo = nowBn.add(new anchor.BN(15));
    idoTimes.endEscrow = nowBn.add(new anchor.BN(16));

    await program.rpc.initializePool(
      idoName,
      bumps,
      watermelonIdoAmount,
      idoTimes,
      {
        accounts: {
          idoAuthority: provider.wallet.publicKey,
          idoAuthorityWatermelon,
          idoAccount,
          watermelonMint,
          usdcMint,
          redeemableMint,
          poolWatermelon,
          poolUsdc,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      }
    );

    idoAuthorityWatermelonAccount = await getTokenAccount(
      provider,
      idoAuthorityWatermelon
    );
    assert.ok(idoAuthorityWatermelonAccount.amount.eq(new anchor.BN(0)));

    console.log("----------------------------------------------------------");
    console.log("nowBn date -> ", new Date(nowBn.toNumber()));
    console.log("idoTimes.startIdo -> ", new Date(idoTimes.startIdo.toNumber()));
    console.log("idoTimes.endDeposits -> ", new Date(idoTimes.endDeposits.toNumber()));
    console.log("idoTimes.endIdo -> ", new Date(idoTimes.endIdo.toNumber()));
    console.log("idoTimes.endEscrow -> ", new Date(idoTimes.endEscrow.toNumber()));
    console.log("----------------------------------------------------------\n");
  });

  // We're going to need to start using the associated program account for creating token accounts
  // if not in testing, then definitely in production.

  let userUsdc = null;
  // 10 usdc
  const firstDeposit = new anchor.BN(10_000_349);

  it("Exchanges user USDC for redeemable tokens", async () => {
    // Wait until the IDO has opened.
    // "sleep" means simulated time.
    if (Date.now() < idoTimes.startIdo.toNumber() * 1000) {
      await sleep(idoTimes.startIdo.toNumber() * 1000 - Date.now() + 2000);
    }
    // console.log(new Date(idoTimes.startIdo.toNumber() * 1000));

    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [redeemableMint] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("redeemable_mint")],
      program.programId
    );

    const [poolUsdc] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("pool_usdc")],
      program.programId
    );

    userUsdc = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      usdcMint,
      program.provider.wallet.publicKey
    );
    // Get the instructions to add to the RPC call
    let createUserUsdcInstr = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      usdcMint,
      userUsdc,
      program.provider.wallet.publicKey,
      program.provider.wallet.publicKey
    );
    let createUserUsdcTrns = new anchor.web3.Transaction().add(
      createUserUsdcInstr
    );
    const tx = await provider.send(createUserUsdcTrns);
    console.log("tx (createAssociatedTokenAccountInstruction) -> ", tx);

    await usdcMintAccount.mintTo(
      userUsdc,
      provider.wallet.publicKey,
      [],
      firstDeposit.toString()
    );
    console.log("getBalance(userUsdc) -> ", await connection.getBalance(userUsdc));

    // Check if we inited correctly
    userUsdcAccount = await getTokenAccount(provider, userUsdc);
    assert.ok(userUsdcAccount.amount.eq(firstDeposit));
    console.log("userUsdcAccount token balance ->", await connection.getBalance(userUsdcAccount.mint));

    const [userRedeemable] = await anchor.web3.PublicKey.findProgramAddress(
      [
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(idoName),
        Buffer.from("user_redeemable"),
      ],
      program.programId
    );

    try {
      console.log("Transfer user's USDC to pool USDC account.");
      // Programs: https://github.com/project-serum/anchor/blob/5edaf7af841296079906e16bf8b9fb8795249403/tests/ido-pool/programs/ido-pool/src/lib.rs#L66
      const tx = await program.rpc.exchangeUsdcForRedeemable(firstDeposit, {
        accounts: {
          userAuthority: provider.wallet.publicKey,
          userUsdc,
          userRedeemable,
          idoAccount,
          usdcMint,
          redeemableMint,
          watermelonMint,
          poolUsdc,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
          program.instruction.initUserRedeemable({
            accounts: {
              userAuthority: provider.wallet.publicKey,
              userRedeemable,
              idoAccount,
              redeemableMint,
              systemProgram: anchor.web3.SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            },
          }),
        ],
      });
      console.log("tx (exchangeUsdcForRedeemable) -> ", tx);
    } catch (err) {
      console.log("This is the error message", err.toString());
    }
    poolUsdcAccount = await getTokenAccount(provider, poolUsdc);
    assert.ok(poolUsdcAccount.amount.eq(firstDeposit));
    userRedeemableAccount = await getTokenAccount(provider, userRedeemable);
    assert.ok(userRedeemableAccount.amount.eq(firstDeposit));

    console.log("----------------------------------------------------------");
    console.log("firstDeposit (10 USDC) -> ", firstDeposit.toNumber().toLocaleString());
    console.log("userUsdc publickey -> ", userUsdc.toString());
    console.log("userUsdcAccount.mint publickey -> ", userUsdcAccount.mint.toString());
    console.log("userUsdcAccount.owner publickey -> ", userUsdcAccount.owner.toString());
    console.log("userUsdcAccount.amount -> ", userUsdcAccount.amount.toNumber().toLocaleString());

    console.log("idoAccount Public Key (Program ID?) -> ", idoAccount.toString());
    console.log("redeemableMint Public Key -> ", redeemableMint.toString());
    console.log("poolUsdc Public Key -> ", poolUsdc.toString());
    console.log("----------------------------------------------------------\n");
  });

  // // 23 usdc
  const secondDeposit = new anchor.BN(23_000_672);
  let totalPoolUsdc, secondUserKeypair, secondUserUsdc;

  it("Exchanges a second users USDC for redeemable tokens", async () => {
    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [redeemableMint] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("redeemable_mint")],
      program.programId
    );

    const [poolUsdc] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("pool_usdc")],
      program.programId
    );

    secondUserKeypair = anchor.web3.Keypair.generate();

    // --- Airdrop ---
    const airdropSignature = await connection.requestAirdrop(
      secondUserKeypair.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
    const secondUserBalance = await connection.getBalance(secondUserKeypair.publicKey);
    console.log("secondUserBalance (LAMPORTS_PER_SOL) -> ", secondUserBalance);

    transferSolInstr = anchor.web3.SystemProgram.transfer({
      fromPubkey: provider.wallet.publicKey,
      lamports: 100_000_000_000, // 100 sol
      toPubkey: secondUserKeypair.publicKey,
    });
    secondUserUsdc = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      usdcMint,
      secondUserKeypair.publicKey
    );
    createSecondUserUsdcInstr = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      usdcMint,
      secondUserUsdc,
      secondUserKeypair.publicKey,
      provider.wallet.publicKey
    );
    let createSecondUserUsdcTrns = new anchor.web3.Transaction();
    createSecondUserUsdcTrns.add(transferSolInstr);
    createSecondUserUsdcTrns.add(createSecondUserUsdcInstr);
    await provider.send(createSecondUserUsdcTrns);
    await usdcMintAccount.mintTo(
      secondUserUsdc,
      provider.wallet.publicKey,
      [],
      secondDeposit.toString()
    );

    // Checking the transfer went through
    secondUserUsdcAccount = await getTokenAccount(provider, secondUserUsdc);
    assert.ok(secondUserUsdcAccount.amount.eq(secondDeposit));

    const [secondUserRedeemable] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          secondUserKeypair.publicKey.toBuffer(),
          Buffer.from(idoName),
          Buffer.from("user_redeemable"),
        ],
        program.programId
      );

    const tx = await program.rpc.exchangeUsdcForRedeemable(secondDeposit, {
      accounts: {
        userAuthority: secondUserKeypair.publicKey,
        userUsdc: secondUserUsdc,
        userRedeemable: secondUserRedeemable,
        idoAccount,
        usdcMint,
        redeemableMint,
        watermelonMint,
        poolUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [
        program.instruction.initUserRedeemable({
          accounts: {
            userAuthority: secondUserKeypair.publicKey,
            userRedeemable: secondUserRedeemable,
            idoAccount,
            redeemableMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          },
        }),
      ],
      signers: [secondUserKeypair],
    });
    console.log("tx -> ", tx);

    secondUserRedeemableAccount = await getTokenAccount(
      provider,
      secondUserRedeemable
    );
    assert.ok(secondUserRedeemableAccount.amount.eq(secondDeposit));

    totalPoolUsdc = firstDeposit.add(secondDeposit);
    poolUsdcAccount = await getTokenAccount(provider, poolUsdc);
    assert.ok(poolUsdcAccount.amount.eq(totalPoolUsdc));

    console.log("----------------------------------------------------------");
    console.log("secondDeposit (23 USDC) -> ", secondDeposit.toNumber().toLocaleString());
    console.log("secondUserKeypair.publicKey -> ", secondUserKeypair.publicKey.toString());
    console.log("secondUserUsdc publickey -> ", userUsdc.toString());
    console.log("secondUserUsdcAccount.mint publickey -> ", secondUserUsdcAccount.mint.toString());
    console.log("secondUserUsdcAccount.owner publickey -> ", secondUserUsdcAccount.owner.toString());
    console.log("secondUserUsdcAccount.amount -> ", secondUserUsdcAccount.amount.toNumber().toLocaleString());
    console.log("totalPoolUsdc (frst:10 + second:23 = 33 USDC) -> ", totalPoolUsdc.toNumber().toLocaleString());
    console.log("----------------------------------------------------------\n");
  });

  const firstWithdrawal = new anchor.BN(2_000_000);

  it("Exchanges user Redeemable tokens for USDC", async () => {
    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [redeemableMint] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("redeemable_mint")],
      program.programId
    );

    const [poolUsdc] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("pool_usdc")],
      program.programId
    );

    const [userRedeemable] = await anchor.web3.PublicKey.findProgramAddress(
      [
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(idoName),
        Buffer.from("user_redeemable"),
      ],
      program.programId
    );

    const [escrowUsdc] = await anchor.web3.PublicKey.findProgramAddress(
      [
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(idoName),
        Buffer.from("escrow_usdc"),
      ],
      program.programId
    );

    const tx = await program.rpc.exchangeRedeemableForUsdc(firstWithdrawal, {
      accounts: {
        userAuthority: provider.wallet.publicKey,
        escrowUsdc,
        userRedeemable,
        idoAccount,
        usdcMint,
        redeemableMint,
        watermelonMint,
        poolUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      instructions: [
        program.instruction.initEscrowUsdc({
          accounts: {
            userAuthority: provider.wallet.publicKey,
            escrowUsdc,
            idoAccount,
            usdcMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          },
        }),
      ],
    });
    console.log("tx -> ", tx);

    totalPoolUsdc = totalPoolUsdc.sub(firstWithdrawal);
    poolUsdcAccount = await getTokenAccount(provider, poolUsdc);
    // assert.ok(poolUsdcAccount.amount.eq(totalPoolUsdc));
    escrowUsdcAccount = await getTokenAccount(provider, escrowUsdc);
    assert.ok(escrowUsdcAccount.amount.eq(firstWithdrawal));

    console.log("----------------------------------------------------------");
    console.log("firstWithdrawal (2 USDC) ->", firstWithdrawal.toNumber().toLocaleString());
    console.log("totalPoolUsdc (33 - 2 = 31 USDC) ->", totalPoolUsdc.toNumber().toLocaleString());
    console.log("escrowUsdcAccount.mint publickey -> ", escrowUsdcAccount.mint.toString());
    console.log("escrowUsdcAccount.owner publickey -> ", escrowUsdcAccount.owner.toString());
    console.log("escrowUsdcAccount.amount -> ", escrowUsdcAccount.amount.toNumber().toLocaleString());
    console.log("----------------------------------------------------------\n");
  });

  it("Exchanges user Redeemable tokens for watermelon", async () => {
    // Wait until the IDO has ended.
    if (Date.now() < idoTimes.endIdo.toNumber() * 1000) {
      await sleep(idoTimes.endIdo.toNumber() * 1000 - Date.now() + 3000);
    }

    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [poolWatermelon] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("pool_watermelon")],
      program.programId
    );

    const [redeemableMint] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("redeemable_mint")],
      program.programId
    );

    const [userRedeemable] = await anchor.web3.PublicKey.findProgramAddress(
      [
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(idoName),
        Buffer.from("user_redeemable"),
      ],
      program.programId
    );

    let firstUserRedeemable = firstDeposit.sub(firstWithdrawal);
    // TODO we've been lazy here and not used an ATA as we did with USDC
    userWatermelon = await createTokenAccount(
      provider,
      watermelonMint,
      provider.wallet.publicKey
    );

    const tx = await program.rpc.exchangeRedeemableForWatermelon(firstUserRedeemable, {
      accounts: {
        payer: provider.wallet.publicKey,
        userAuthority: provider.wallet.publicKey,
        userWatermelon,
        userRedeemable,
        idoAccount,
        watermelonMint,
        redeemableMint,
        poolWatermelon,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
    console.log("tx -> ", tx);

    poolWatermelonAccount = await getTokenAccount(provider, poolWatermelon);
    let redeemedWatermelon = firstUserRedeemable
      .mul(watermelonIdoAmount)
      .div(totalPoolUsdc);
    let remainingWatermelon = watermelonIdoAmount.sub(redeemedWatermelon);
    assert.ok(poolWatermelonAccount.amount.eq(remainingWatermelon));
    userWatermelonAccount = await getTokenAccount(provider, userWatermelon);
    assert.ok(userWatermelonAccount.amount.eq(redeemedWatermelon));

    console.log("----------------------------------------------------------");
    console.log("poolWatermelonAccount.mint publickey -> ", poolWatermelonAccount.mint.toString());
    console.log("poolWatermelonAccount.owner publickey -> ", poolWatermelonAccount.mint.toString());
    console.log("poolWatermelonAccount.amount -> ", poolWatermelonAccount.amount.toNumber().toLocaleString());
    console.log("remainingWatermelon -> ", remainingWatermelon.toNumber().toLocaleString());
    console.log("userWatermelonAccount.mint publickey -> ", userWatermelonAccount.mint.toString());
    console.log("userWatermelonAccount.owner publickey -> ", userWatermelonAccount.owner.toString());
    console.log("----------------------------------------------------------\n");
  });

  it("Exchanges second user's Redeemable tokens for watermelon", async () => {
    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [redeemableMint] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("redeemable_mint")],
      program.programId
    );

    const [secondUserRedeemable] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          secondUserKeypair.publicKey.toBuffer(),
          Buffer.from(idoName),
          Buffer.from("user_redeemable"),
        ],
        program.programId
      );

    const [poolWatermelon] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("pool_watermelon")],
      program.programId
    );

    secondUserWatermelon = await createTokenAccount(
      provider,
      watermelonMint,
      secondUserKeypair.publicKey
    );

    const tx = await program.rpc.exchangeRedeemableForWatermelon(secondDeposit, {
      accounts: {
        payer: provider.wallet.publicKey,
        userAuthority: secondUserKeypair.publicKey,
        userWatermelon: secondUserWatermelon,
        userRedeemable: secondUserRedeemable,
        idoAccount,
        watermelonMint,
        redeemableMint,
        poolWatermelon,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
    console.log("tx -> ", tx);

    poolWatermelonAccount = await getTokenAccount(provider, poolWatermelon);
    assert.ok(poolWatermelonAccount.amount.eq(new anchor.BN(0)));

    console.log("----------------------------------------------------------");
    console.log("poolWatermelonAccount.mint publickey -> ", poolWatermelonAccount.mint.toString());
    console.log("poolWatermelonAccount.owner publickey -> ", poolWatermelonAccount.mint.toString());
    console.log("poolWatermelonAccount.amount (Redemmed second deposit = 0 USDC) -> ", poolWatermelonAccount.amount.toNumber().toLocaleString());
    console.log("----------------------------------------------------------\n");
  });

  it("Withdraws total USDC from pool account", async () => {
    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [poolUsdc] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName), Buffer.from("pool_usdc")],
      program.programId
    );

    const tx = await program.rpc.withdrawPoolUsdc({
      accounts: {
        idoAuthority: provider.wallet.publicKey,
        idoAuthorityUsdc,
        idoAccount,
        usdcMint,
        watermelonMint,
        poolUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
    console.log("tx -> ", tx);

    poolUsdcAccount = await getTokenAccount(provider, poolUsdc);
    assert.ok(poolUsdcAccount.amount.eq(new anchor.BN(0)));
    idoAuthorityUsdcAccount = await getTokenAccount(provider, idoAuthorityUsdc);
    assert.ok(idoAuthorityUsdcAccount.amount.eq(totalPoolUsdc));

    console.log("----------------------------------------------------------");
    console.log("poolUsdcAccount.mint publickey -> ", poolUsdcAccount.mint.toString());
    console.log("poolUsdcAccount.owner publickey -> ", poolUsdcAccount.mint.toString());
    console.log("poolUsdcAccount.amount -> ", poolUsdcAccount.amount.toNumber().toLocaleString());
    console.log("idoAuthorityUsdcAccount.mint publickey -> ", idoAuthorityUsdcAccount.mint.toString());
    console.log("idoAuthorityUsdcAccount.owner publickey -> ", idoAuthorityUsdcAccount.owner.toString());
    console.log("totalPoolUsdc -> ", totalPoolUsdc.toNumber().toLocaleString());
    console.log("----------------------------------------------------------\n");
  });

  it("Withdraws USDC from the escrow account after waiting period is over", async () => {
    // Wait until the escrow period is over.
    if (Date.now() < idoTimes.endEscrow.toNumber() * 1000 + 1000) {
      await sleep(idoTimes.endEscrow.toNumber() * 1000 - Date.now() + 4000);
    }

    const [idoAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(idoName)],
      program.programId
    );

    const [escrowUsdc] = await anchor.web3.PublicKey.findProgramAddress(
      [
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(idoName),
        Buffer.from("escrow_usdc"),
      ],
      program.programId
    );

    const tx = await program.rpc.withdrawFromEscrow(firstWithdrawal, {
      accounts: {
        payer: provider.wallet.publicKey,
        userAuthority: provider.wallet.publicKey,
        userUsdc,
        escrowUsdc,
        idoAccount,
        usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
    console.log("tx -> ", tx);

    userUsdcAccount = await getTokenAccount(provider, userUsdc);
    assert.ok(userUsdcAccount.amount.eq(firstWithdrawal));

    console.log("----------------------------------------------------------");
    console.log("userUsdcAccount.mint publickey -> ", userUsdcAccount.mint.toString());
    console.log("userUsdcAccount.owner publickey -> ", userUsdcAccount.mint.toString());
    console.log("userUsdcAccount.amount -> ", userUsdcAccount.amount.toNumber().toLocaleString());
    console.log("totalPoolUsdc -> ", totalPoolUsdc.toNumber().toLocaleString());
    console.log("----------------------------------------------------------\n");



    console.log("----------------------------------------------------------");
    console.log("provider.wallet.publicKey (= My Wallet) -> ", provider.wallet.publicKey.toString());
    console.log("watermelonIdoAmount -> ", watermelonIdoAmount.toNumber().toLocaleString());

    console.log("usdcMintAccount programId (= Solana Token Program ID. Fixed Value) -> ", usdcMintAccount.programId.toString());
    console.log("usdcMintAccount associatedProgramId (Fixed Value) -> ", usdcMintAccount.associatedProgramId.toString());
    console.log("usdcMintAccount Public Key (= Mint Address) -> ", usdcMintAccount.publicKey.toString());

    console.log("watermelonMintAccount programId (= Solana Token Program ID) -> ", watermelonMintAccount.programId.toString());
    console.log("watermelonMintAccount associatedProgramId -> ", watermelonMintAccount.associatedProgramId.toString());
    console.log("watermelonMintAccount Public Key (= Mint Address) -> ", watermelonMintAccount.publicKey.toString());

    console.log("idoAuthorityUsdc Public Key -> ", idoAuthorityUsdc.toString());
    console.log("idoAuthorityWatermelon Public Key -> ", idoAuthorityWatermelon.toString());

    console.log("userUsdcAccount.mint publickey -> ", userUsdcAccount.mint.toString());
    console.log("userUsdcAccount.owner publickey -> ", userUsdcAccount.owner.toString());
    console.log("----------------------------------------------------------\n");
  });

  function PoolBumps() {
    this.idoAccount;
    this.redeemableMint;
    this.poolWatermelon;
    this.poolUsdc;
  }

  function IdoTimes() {
    this.startIdo;
    this.endDeposts;
    this.endIdo;
    this.endEscrow;
  }
});

/*
% anchor test

~~~ skip ~~~

ido-pool
----------------------------------------------------------
idoAuthority_watermelon_account.mint publicKey ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
idoAuthority_watermelon_account.owner publicKey ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
idoAuthority_watermelon_account.amount ->  5,000,000
----------------------------------------------------------

  ✔ Initializes the state-of-the-world (2516ms)
----------------------------------------------------------
nowBn date ->  1970-01-19T23:55:46.773Z
idoTimes.startIdo ->  1970-01-19T23:55:46.778Z
idoTimes.endDeposits ->  1970-01-19T23:55:46.783Z
idoTimes.endIdo ->  1970-01-19T23:55:46.788Z
idoTimes.endEscrow ->  1970-01-19T23:55:46.789Z
----------------------------------------------------------

  ✔ Initializes the IDO pool (415ms)
Sleeping for 6.069 seconds
tx (createAssociatedTokenAccountInstruction) ->  2CaKK32And8iW8RjhhS8RpQDvrLn7AkiTcU1x3zLCjck1suNiwURmZTGcnUpRraUPJmge8z9sDMWoegJPgo1iPgw
getBalance(userUsdc) ->  2039280
userUsdcAccount token balance -> 1461600
Transfer user's USDC to pool USDC account.
tx (exchangeUsdcForRedeemable) ->  2v3WMdmkFz9yeqWvvmoZycjnjLGX2TaemmVStqFictuKwxva4CerSc3qS2Zqqj78dtedWNpsxcsgr5xY3DGGMt7E
----------------------------------------------------------
firstDeposit (10 USDC) ->  10,000,349
userUsdc publickey ->  ApNdod4e7unTqKjBGwHJqYQigs56B6EueCHUuHD9hjWB
userUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
userUsdcAccount.owner publickey ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
userUsdcAccount.amount ->  10,000,349
idoAccount Public Key (Program ID?) ->  2YkqGDyLGuu1G5QSRtVMbrX6dx3KUQi6WAQZfyy67x3h
redeemableMint Public Key ->  Bpq5y6h11C8iVTTHY5D9CLTdcgyzhHaaX8N9ZCTjms7K
poolUsdc Public Key ->  Egcr8zNd7trXinEFHC1sCDx5CTt3JULtEMrPRX6KimxN
----------------------------------------------------------

  ✔ Exchanges user USDC for redeemable tokens (7578ms)
secondUserBalance (LAMPORTS_PER_SOL) ->  1000000000
tx ->  h9NzQduuVbAgPjwyk3Cw5jhYGg2TrMckMfShvkFjWRfqbVgsR4bJAfokn31K9rRqqFnqLZ7Nt9EgHJyoVLnXiJ6
----------------------------------------------------------
secondDeposit (23 USDC) ->  23,000,672
secondUserKeypair.publicKey ->  GRT5XpbA5ukqnhgz34xB9vrwZMP6pUHryYx8HM92uQLa
secondUserUsdc publickey ->  ApNdod4e7unTqKjBGwHJqYQigs56B6EueCHUuHD9hjWB
secondUserUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
secondUserUsdcAccount.owner publickey ->  GRT5XpbA5ukqnhgz34xB9vrwZMP6pUHryYx8HM92uQLa
secondUserUsdcAccount.amount ->  23,000,672
totalPoolUsdc (frst:10 + second:23 = 33 USDC) ->  33,001,021
----------------------------------------------------------

  ✔ Exchanges a second users USDC for redeemable tokens (1880ms)
tx ->  5P5mrkfJrv44DZjk2sCE4gWCeFFxkdHj66UJc88Biyzc2bkAJ7XUafp4ajaaVoHFV5bQ4QtYoYwuu3TGen5ecgGc
----------------------------------------------------------
firstWithdrawal (2 USDC) -> 2,000,000
totalPoolUsdc (33 - 2 = 31 USDC) -> 31,001,021
escrowUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
escrowUsdcAccount.owner publickey ->  2YkqGDyLGuu1G5QSRtVMbrX6dx3KUQi6WAQZfyy67x3h
escrowUsdcAccount.amount ->  2,000,000
----------------------------------------------------------

  ✔ Exchanges user Redeemable tokens for USDC (480ms)
Sleeping for 7.127 seconds
tx ->  3Jzp88J1txMXax4frGco33HoteCERPmBWkRVkjMbKL92nDnwsy5fz9QjSwUE2F2Ej28Tvvv7oqjT8oCKrpmd1815
----------------------------------------------------------
poolWatermelonAccount.mint publickey ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
poolWatermelonAccount.owner publickey ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
poolWatermelonAccount.amount ->  3,709,664
remainingWatermelon ->  3,709,664
userWatermelonAccount.mint publickey ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
userWatermelonAccount.owner publickey ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
----------------------------------------------------------

  ✔ Exchanges user Redeemable tokens for watermelon (7927ms)
tx ->  5KgJWb4L4XrYT5DCvet84DWnQqMGBLMeBg1T1s34jFL1Q49q8EvaSQdF9b3KXhytusvtWkSwSdVh5wvp7czmF4rk
----------------------------------------------------------
poolWatermelonAccount.mint publickey ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
poolWatermelonAccount.owner publickey ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
poolWatermelonAccount.amount (Redemmed second deposit = 0 USDC) ->  0
----------------------------------------------------------

  ✔ Exchanges second user's Redeemable tokens for watermelon (943ms)
tx ->  4ZFA8cQPVqhaARF3N2yGqvMJfmPR5BG92P9kj974UTNRwWFCW8DjqXuZkbzciHaKWPPhiULvmbqf8pBrEByvM7SL
----------------------------------------------------------
poolUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
poolUsdcAccount.owner publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
poolUsdcAccount.amount ->  0
idoAuthorityUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
idoAuthorityUsdcAccount.owner publickey ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
totalPoolUsdc ->  31,001,021
----------------------------------------------------------

  ✔ Withdraws total USDC from pool account (463ms)
tx ->  WYyxt6VdajfnvukpZSFwhiqupYhrw1XaYkS4HaSeAMUSFzTTy56MnVau5DfGv6AMJ5Pf4Yj2YPx2ZA3fmC4fFEd
----------------------------------------------------------
userUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
userUsdcAccount.owner publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
userUsdcAccount.amount ->  2,000,000
totalPoolUsdc ->  31,001,021
----------------------------------------------------------

----------------------------------------------------------
provider.wallet.publicKey (= My Wallet) ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
watermelonIdoAmount ->  5,000,000
usdcMintAccount programId (= Solana Token Program ID. Fixed Value) ->  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
usdcMintAccount associatedProgramId (Fixed Value) ->  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL
usdcMintAccount Public Key (= Mint Address) ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
watermelonMintAccount programId (= Solana Token Program ID) ->  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
watermelonMintAccount associatedProgramId ->  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL
watermelonMintAccount Public Key (= Mint Address) ->  Gk9ZNBaJvY5JCSJvuc5LM9mnLMLa9E2xBNP1bx9pxB6W
idoAuthorityUsdc Public Key ->  7oHqefwzrCLZrmRUvLhu1G4haY9QLX9B3bjtMMYHd8op
idoAuthorityWatermelon Public Key ->  4U8RXaAVoFQgy9o76mvcPvGehzAbVaKFnHTdp6yiqGCm
userUsdcAccount.mint publickey ->  CTHTqStM2KqfiwouEW3ad7W1DAKJzivRE4XSa96XcBQ3
userUsdcAccount.owner publickey ->  HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
----------------------------------------------------------

  ✔ Withdraws USDC from the escrow account after waiting period is over (471ms)


9 passing (23s)

✨  Done in 28.52s.
*/
