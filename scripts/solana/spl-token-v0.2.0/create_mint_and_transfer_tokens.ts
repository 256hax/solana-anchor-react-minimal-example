// Source: https://github.com/solana-labs/solana-program-library/blob/895747f29fd38fc61961ffc1bc5c73dab57bba1a/token/js/examples/create_mint_and_transfer_tokens.ts
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

export const main = async() => {
    // Connect to cluster
    let connection = new Connection('http://localhost:8899', 'confirmed');
    // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

    let latestBlockHash = await connection.getLatestBlockhash();

    // Wait for airdrop confirmation
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirdropSignature,
    });

    // Generate a new wallet to receive newly minted token
    const toWallet = Keypair.generate();

    // Create new token mint
    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9
    );

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey
    );

    // Mint 1 new token to the "fromTokenAccount" account we just created
    const signature_mint = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const signature_tx = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        []
    );

    console.log('fromWallet.publicKey     =>', fromWallet.publicKey.toString());
    console.log('toWallet.publicKey       =>', toWallet.publicKey.toString());
    console.log('fromTokenAccount.address =>', fromTokenAccount.address.toString());
    console.log('toTokenAccount.address   =>', toTokenAccount.address.toString());
    console.log('mint address             =>', mint.toString());

    console.log('mint tx                  =>', signature_mint);
    console.log('transfer tx              =>', signature_tx);
};

main();

/*
% ts-node <THIS FILE>
fromWallet.publicKey     => E8ruGTpYznxpDYN1NkJGhu1AqFdLMDdBHfgwkLAEDbgQ
toWallet.publicKey       => Autv5u8xDR5HE5eQvVUaB7EK5tYgEXGhSqTEs2ekbtMc
fromTokenAccount.address => 87i6GeegZipqEgKu5VVUHCCnhoZiQupSANGvtaXMGHQK
toTokenAccount.address   => 2zrGKH8G18RtDdHKESeQmuNwVbBtxTyUPUXT4yPAkRJg
mint address             => 4pBgXj5toMJuQtaoDucK2kNxuQkgF9faTTw5fwrS4rDq
mint tx                  => 5wK51k27m6kL61oGwTdDxc7LpUzD3zadNnhxue3DJqWQTJd4fzAGRx9UMukTN3XEbnsdSN4Fb2piqwgCBT2t6GNB
transfer tx              => 49XwFww2QNSfZ2mAJ6YRy9j8KMcShXNLf7SgwPJZvd3QLeBCVe5ayMoP2NUFoU8C3SmEbd9pLfGHzUDpNMxJLoMa
*/
