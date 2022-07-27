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

    // Set new authority for Mint Account
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#setAuthority
    const randomWallet = Keypair.generate();

    const mint_rand_auth_tx = await setAuthority(
        connection, // connection
        fromWallet, // payer
        mint, // account
        fromWallet.publicKey, // currentAuthority
        0, // authorityType. MintTokens = 0, FreezeAccount = 1, AccountOwner = 2, CloseAccount = 3
        randomWallet.publicKey, // newAuthority
        [fromWallet], // multiSigners
        {}, // (Optional) confirmOptions
        TOKEN_PROGRAM_ID, // ProgramId
    );

    // Set new authority for Token Account
    // https://solana-labs.github.io/solana-program-library/token/js/modules.html#setAuthority
    const token_acc_rand_auth_tx = await setAuthority(
        connection, // connection
        fromWallet, // payer
        fromTokenAccount.address, // account
        fromWallet.publicKey, // currentAuthority
        2, // authorityType. MintTokens = 0, FreezeAccount = 1, AccountOwner = 2, CloseAccount = 3
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
    console.log('mint_rand_auth_tx          =>', mint_rand_auth_tx);
    console.log('token_acc_rand_auth_tx     =>', token_acc_rand_auth_tx);
};

main();

/*
% ts-node <THIS FILE>
fromWallet.publicKey       => CSyFrHrGa1XRxphmXE9EtJzUgGBpm1bX166PGSFKwnM4
toWallet.publicKey         => 5e4LFx4o5nJA9gaweE1iKEC1aL5ELMY7oAsbNZKuvadG
fromTokenAccount.address   => AEQmpEmT9MmMTDAfx7jv76Vqv8d3ZaRn6rzpQcRZNJ5K
toTokenAccount.address     => 7txFE1FvcrfNzoMcjZeA5uxFc95iwQ7nvBNZSNqeo3Zk
mint address               => 5482WN9J8je5qvDg8SRkeST8uAAuR4qXPC76HkqQTkvd
mint tx                    => 3twy8ntB5fPH6Tqw8NiXRJDybSKx28ZcV2zoGhN6QEjcu88fnLbSJ4vgYZUvrLmzcBdBnsw8HoJHQrLCkBMzjj7f
transfer tx                => 3CQ1mvJDgNWAYefcqJfmm2Gj1CRow27qKDDzidTcGe3WhWNSBWv5FAcjz6G5SpSvYwSeSxVZf2XKNAUY2Ygo7jMd
randomWallet.publicKey     => 2QB6vsBPtPBw4ukeHgjBhBZbRRr97sosaronGUb2uJ6Y
mint_rand_auth_tx          => 44UgTv2AiPVBkong3tmLnJhY8JE9BoD2bVwpAzqHpWD6WbU2aREYkcNjEVAo5zzKS8NoNGRt6cUUZbhcR28k26Sj
token_acc_rand_auth_tx     => 3MZ2h9vceZ4V1qe1RA812uKNRfQQaBxrHa2HyJG3RE6HvN1phmp8pJ15Nh9GdCkteg9naT4i9bFTcgocw1sNAuWj
*/
