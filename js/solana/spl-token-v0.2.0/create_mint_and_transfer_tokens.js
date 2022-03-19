// Source:
//  TS: https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/create_mint_and_transfer_tokens.ts
//  RS: https://github.com/solana-labs/solana-program-library/blob/master/token/program/src/instruction.rs
const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {
    // Connect to cluster
    // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const connection = new web3.Connection('http://localhost:8899', 'confirmed');

    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = web3.Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, web3.LAMPORTS_PER_SOL);

    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    const toWallet = web3.Keypair.generate();

    // Create new token mint
    const mint = await splToken.createMint(connection, fromWallet, fromWallet.publicKey, null, 9);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet.publicKey);

    // Mint 1 new token to the "fromTokenAccount" account we just created
    // Source: https://github.com/solana-labs/solana-program-library/blob/664ad292ac8855f8bf3e4414bc522b248f474927/token/js/test/e2e/mint.test.ts#L39
    const signature_mint = await splToken.mintTo(
        connection,                 // Connection
        fromWallet,                 // Payer
        mint,                       // Mint Address
        fromTokenAccount.address,   // From Address
        fromWallet.publicKey,       // Mint Authority
        web3.LAMPORTS_PER_SOL,      // Mint Ammount
        []                          // perhaps Signers?
    );

    // Transfer the new token to the "toTokenAccount" we just created
    // Source: https://github.com/solana-labs/solana-program-library/blob/664ad292ac8855f8bf3e4414bc522b248f474927/token/js/test/e2e/transfer.test.ts#L73
    const signature_transfer = await splToken.transfer(
        connection,                 // Connection
        fromWallet,                 // Payer
        fromTokenAccount.address,   // From Address
        toTokenAccount.address,     // To Address
        fromWallet.publicKey,       // Authority
        web3.LAMPORTS_PER_SOL,      // Transfer Amount
        []                          // perhaps Signers?
    );

    console.log('--- from --------------------------------------------------');
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
--- from --------------------------------------------------
fromWallet       => Z9me2QDfvxBVNfD6yKdStXQv29F2yB1zQXJoTYMem6w
fromTokenAccount => 9wz1pVht29oHYNfzdiHMR3W8fPqC48y9BkEFqhQfnVxZ

--- to --------------------------------------------------
toWallet         => 553KUYff3GahKATRaekqPwZingv5hPpcxAe8R58Q2f1s
toTokenAccount   => 6SnuSHL89t59qCRzdW2YNbPHAnNc8EnXKAPkiWzpy3wk

--- tx --------------------------------------------------
mint tx          => 2neZuisRqgHdbqCukeaVZddpx31mGKaqxKZinTTdyH7TdMgnEwKJPf7cAbRKya3bmoriJo7SsNiRouSZ1ujBAqgp
transfer tx      => 62dRZdhc1KDwzady3c1rDhNYEgmgfwuH4ABatgQ91ZPeuaBcJVVuTXWA6ZZsyipznuXnuohrBDr7x2bxrLHEzzY7
*/