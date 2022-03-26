// Source:
//  RS: https://github.com/solana-labs/solana-program-library/blob/b7a3fc62431fcd00001df625aaa61a29ce7d1e29/token/program/src/instruction.rs
//  TS: https://github.com/solana-labs/solana-program-library/blob/b7a3fc62431fcd00001df625aaa61a29ce7d1e29/token/js/examples/create_mint_and_transfer_tokens.ts
// Docs: https://solanacookbook.com/references/token.html#what-do-i-need-to-get-started-with-spl-tokens
const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {
    // Connect to cluster
    // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const connection = new web3.Connection('http://localhost:8899', 'confirmed');

    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = web3.Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, web3.LAMPORTS_PER_SOL);

    let fromTokenAccountBalance = null;
    let toTokenAccountBalance = null;

    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    const toWallet = web3.Keypair.generate();

    // Create new token mint
    const mint = await splToken.createMint(
        connection,             // connection,
        fromWallet,             // payer,
        fromWallet.publicKey,   // authority,
        null,                   // freeze_authority???
        9                       // decimals
    );

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,             // connection: Connection,
        fromWallet,             // payer: Signer,
        mint,                   // mint: PublicKey,
        fromWallet.publicKey    // owner: PublicKey,
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
     const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,             // connection: Connection,
        fromWallet,             // payer: Signer,
        mint,                   // mint: PublicKey,
        toWallet.publicKey      // owner: PublicKey,
    );

    console.log('\n--- Create token Account ---');
    fromTokenAccountBalance = await connection.getTokenAccountBalance(fromTokenAccount.address);
    toTokenAccountBalance = await connection.getTokenAccountBalance(toTokenAccount.address);
    console.log('fromTokenAccountBalance =>', fromTokenAccountBalance.value.amount);
    console.log('toTokenAccountBalance =>', toTokenAccountBalance.value.amount);

    // Mint 1 new token to the "fromTokenAccount" account we just created
    // Source: https://github.com/solana-labs/solana-program-library/blob/664ad292ac8855f8bf3e4414bc522b248f474927/token/js/test/e2e/mint.test.ts#L39
    const signature_mint = await splToken.mintTo(
        connection,                 // Connection
        fromWallet,                 // Payer
        mint,                       // Mint Address
        fromTokenAccount.address,   // Destination Address
        fromWallet.publicKey,       // Mint Authority
        web3.LAMPORTS_PER_SOL,      // Mint Amount
        []                          // Signers???
    );

    console.log('\n--- Mint token to fromTokenAccont ---');
    fromTokenAccountBalance = await connection.getTokenAccountBalance(fromTokenAccount.address);
    toTokenAccountBalance = await connection.getTokenAccountBalance(toTokenAccount.address);
    console.log('fromTokenAccountBalance =>', fromTokenAccountBalance.value.amount);
    console.log('toTokenAccountBalance =>', toTokenAccountBalance.value.amount);

    // Transfer the new token to the "toTokenAccount" we just created
    // Source: https://github.com/solana-labs/solana-program-library/blob/664ad292ac8855f8bf3e4414bc522b248f474927/token/js/test/e2e/transfer.test.ts#L73
    const signature_transfer = await splToken.transfer(
        connection,                 // Connection
        fromWallet,                 // Payer
        fromTokenAccount.address,   // From Address
        toTokenAccount.address,     // To Address
        fromWallet.publicKey,       // Authority
        web3.LAMPORTS_PER_SOL,      // Transfer Amount
        []                          // Signers???
    );

    console.log('\n--- Transfer token from fromTokenAccont to toTokenAccount ---');
    fromTokenAccountBalance = await connection.getTokenAccountBalance(fromTokenAccount.address);
    toTokenAccountBalance = await connection.getTokenAccountBalance(toTokenAccount.address);
    console.log('fromTokenAccountBalance =>', fromTokenAccountBalance.value.amount);
    console.log('toTokenAccountBalance =>', toTokenAccountBalance.value.amount);

    console.log('\n--- from --------------------------------------------------');
    console.log('fromWallet       =>', fromWallet.publicKey.toString());
    console.log('fromTokenAccount =>', fromTokenAccount.address.toString());
    console.log('\n--- to --------------------------------------------------');
    console.log('toWallet         =>', toWallet.publicKey.toString());
    console.log('toTokenAccount   =>', toTokenAccount.address.toString());
    console.log('\n--- tx --------------------------------------------------');
    console.log('mint tx          =>', signature_mint);
    console.log('transfer tx      =>', signature_transfer);
})();

/*
% node <THIS JS FILE>
--- Create token Account ---
fromTokenAccountBalance => 0
toTokenAccountBalance => 0

--- Mint token to fromTokenAccont ---
fromTokenAccountBalance => 1000000000
toTokenAccountBalance => 0

--- Transfer token from fromTokenAccont to toTokenAccount ---
fromTokenAccountBalance => 0
toTokenAccountBalance => 1000000000

--- from --------------------------------------------------
fromWallet       => 3sNCtZ1uCkB8aYLoevWMmwvAKGTzhvTyXMGtWConttNN
fromTokenAccount => Cw5ZRcyTS3XY9xxD8sGJb7CqmsjoV4hh6CNdQXrS7JQx

--- to --------------------------------------------------
toWallet         => 2YsiitU9zSriF2o6Hfo3NWAtiQuG4Lurv4T89dMtXY1Z
toTokenAccount   => 9efSeNoq87uQsX7A37NyS3MqfrFizFiTcYPb4D4vUpYH

--- tx --------------------------------------------------
mint tx          => 3CQdtMu7QEzoscHoFFUT11rFHjdDLUzn53e9PefpLgVpb84G6KUQhrYBaZs1w2FmE9LcVy2CDWM7nhXAbkj6cfJD
transfer tx      => NhMSPL6KD6H6K2hzeHxoeuiTQx5j6j43HaYors33KjT95wQRDZFdnBSXDDwMmsK4G97MGSHNCsD795LRWAUMqjD
*/
