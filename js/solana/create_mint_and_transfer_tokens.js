// Source: https://github.com/solana-labs/solana-program-library/blob/bbbf250a67777a3dea8717648bf1b78d72fa1a8c/token/js/examples/create_mint_and_transfer_tokens.ts
// Docs: https://github.com/solana-labs/solana-program-library/tree/bbbf250a67777a3dea8717648bf1b78d72fa1a8c/token/js/src/instructions
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
    const signature_mint = await splToken.mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        web3.LAMPORTS_PER_SOL,
        []
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const signature_transfer = await splToken.transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        web3.LAMPORTS_PER_SOL,
        []
    );

    console.log('fromWallet.publicKey =>', fromWallet.publicKey.toString());
    console.log('toWallet.publicKey   =>', toWallet.publicKey.toString());
    console.log('mint tx              =>', signature_mint);
    console.log('transfer txx         =>', signature_transfer);
})();

/*
% node <THIS JS FILE>
fromWallet.publicKey => Cu8zkHdqqfhHRSutTxbyM5t4iYPM1NLxL9Koz6pUZp5V
toWallet.publicKey   => 8MqL5e8iZwrzP4CVbkNXZfm77VKxm6vUjaaUp78vA5Yf
mint tx              => 3FQikxc583Cnt4vv3RUfS6VhR5zPwXbhWyAUuV7cYMumJaMjLKTNHUTUzVLMUti7UNbDkTcUHa9U1RfjgULLhc7h
transfer txx         => 4jGURs2YZATrp7Ztxo5EhRTiDgGoLWjNHsWtEK4V5GzS63zYHe26Udnxx4WY61pNctqNFfQuxPKHfU8WEJXxzDxB
*/
