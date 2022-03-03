// Source: https://github.com/solana-labs/solana-program-library/blob/bbbf250a67777a3dea8717648bf1b78d72fa1a8c/token/js/examples/create_mint_and_transfer_tokens.ts
// Docs: https://github.com/solana-labs/solana-program-library/tree/bbbf250a67777a3dea8717648bf1b78d72fa1a8c/token/js/src/instructions
const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {
    // Connect to cluster
    // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const connection = new web3.Connection(web3.clusterApiUrl('http://localhost:8899'), 'confirmed');

    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = web3.Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    const toWallet = web3.Keypair.generate();

    // Create new token mint
    const mint = await createMint(connection, fromWallet, fromWallet.publicKey, null, 9);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet.publicKey);

    // Mint 1 new token to the "fromTokenAccount" account we just created
    let signature = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    );
    console.log('mint tx:', signature);

    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    );
    console.log('transfer tx:', signature);
})();
/*
% node <THIS JS FILE>
fromWallet Publickey ->  5b14DdMF2HuXEHCpjUQQnupZJW4LtvsUhFL3Vs4LcBHR
toWallet Publickey ->  LzSU5qwoAQd8CJwbcqHgtZqBtpzWsxGPwjc9Y7aj1FY
Signature -> 27bWC2Bdagk1PxczcenPf13fsXxYmJ8ZP3YygAmUPJLe27ySi4XksryJFBfHRE4hYtwrJxzo43BzC4dCMRyzHDAx
*/
