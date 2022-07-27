// Source: https://github.com/solana-labs/solana-program-library/blob/895747f29fd38fc61961ffc1bc5c73dab57bba1a/token/js/examples/create_mint_and_transfer_tokens.ts
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, setAuthority, TOKEN_PROGRAM_ID } from '@solana/spl-token';

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
        connection, // connection
        fromWallet, // payer
        fromWallet.publicKey, // mintAuthority
        null, // freezeAuthority
        9 // decimals
    );

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        fromWallet, // payer
        mint, // mint
        fromWallet.publicKey // owner
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
        connection, // connection
        fromWallet, // payer
        mint, // mint
        fromTokenAccount.address, // destination
        fromWallet.publicKey, // authority
        1000000000, // amount
        [] // signer(s)
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const signature_tx = await transfer(
        connection, // connection
        fromWallet, // payer
        fromTokenAccount.address, // source
        toTokenAccount.address, // destination
        fromWallet.publicKey, // owner
        1000000000, // amount
        [] // signer
    );

    // Set new authority
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#setAuthority
    const randomWallet = Keypair.generate();

    const signature_authority_tx = await setAuthority(
        connection, // connection
        // provider.wallet.publicKey, // payer
        fromWallet, // payer
        mint, // account
        fromWallet.publicKey, // currentAuthority
        0, // authorityType
        randomWallet.publicKey, // newAuthority
        [fromWallet], // multiSigners
        {}, // (Optional) confirmOptions
        TOKEN_PROGRAM_ID, // ProgramId
      );
  

    console.log('fromWallet.publicKey       =>', fromWallet.publicKey.toString());
    console.log('toWallet.publicKey         =>', toWallet.publicKey.toString());
    console.log('fromTokenAccount.address   =>', fromTokenAccount.address.toString());
    console.log('toTokenAccount.address     =>', toTokenAccount.address.toString());
    console.log('mint address               =>', mint.toString());

    console.log('mint tx                    =>', signature_mint);
    console.log('transfer tx                =>', signature_tx);
    console.log('randomWallet.publicKey     =>', randomWallet.publicKey.toString());
    console.log('signature_authority_tx     =>', signature_authority_tx);
};

main();

/*
% ts-node <THIS FILE>
fromWallet.publicKey       => EjnVvfwM5iF3ivzxsq3uGU2FpB9YbfZyVTULDg2XeVpt
toWallet.publicKey         => 5BTTb2Y1bWnSDG1mnVwgcufJxjAKJf8ia82kgsXLjk4
fromTokenAccount.address   => 74Qv22jMjKSD3YAPr9ivzYD6qiKNVPVtLshyHVsgtNNj
toTokenAccount.address     => 7ZiXyEVwMbXU9XpdMY4uyakHSFVwa8EKY9qdVZbKLMBa
mint address               => 5muWuFzrqmQZxeLDwug4xm1Thqu5dqKEjd1KQeYe91AD
mint tx                    => XVDwhywmGyo2KvSdygc8Vth3QfUMFGsQKbVcHwY4vzZYrVWtwXmZbriTX6qgJjY3S3Wf2DeAQa9Z7WijScxcyh9
transfer tx                => 3PMj74a9qAphZL2ZhdVHmG8xS9PFxjTxSYeAtDGbYMDFVGGyhDszoAcAWfSaMiZHMbCRpRkUVzCYvZFiJGGfz8mk
randomWallet.publicKey     => BVPGofCf7YUMwU4nK8a3nC8deX6i7vvaqVaU7tkxRnRi
signature_authority_tx     => 63hduoWh47DDYEVBHWVMKWokgVdJGp1u9pa8pTQCo9qbNBMLxPmTUY4HHhbFGYyvNEc8WWPNbTfgViEcGWWWVEzx
*/
