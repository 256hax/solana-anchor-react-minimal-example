// Source: https://github.com/solana-labs/solana-program-library/blob/895747f29fd38fc61961ffc1bc5c73dab57bba1a/token/js/examples/create_mint_and_transfer_tokens.ts
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  setAuthority,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export const main = async () => {
  // Connect to cluster
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ---------------------------------------------------
  //  Wallet
  // ---------------------------------------------------
  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();

  // Generate a new wallet to receive newly minted token
  const toWallet = Keypair.generate();

  // ---------------------------------------------------
  //  Airdrop
  // ---------------------------------------------------
  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL
  );

  let latestBlockhash = await connection.getLatestBlockhash();

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: fromAirdropSignature,
  });

  // ---------------------------------------------------
  //  Create Token
  // ---------------------------------------------------
  // Create new token mint
  const mint = await createMint(
    connection, // connection
    fromWallet, // payer
    fromWallet.publicKey, // mintAuthority
    null, // freezeAuthority
    9 // decimals
  );

  // ---------------------------------------------------
  //  Get ATA for Transfer
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  //  Mint Token
  // ---------------------------------------------------
  // Mint 1 new token to the "fromTokenAccount" account we just created
  const signatureMint = await mintTo(
    connection, // connection
    fromWallet, // payer
    mint, // mint
    fromTokenAccount.address, // destination
    fromWallet.publicKey, // authority
    1000000000, // amount
    [] // signer(s)
  );

  // ---------------------------------------------------
  //  Transfer Token
  // ---------------------------------------------------
  // Transfer the new token to the "toTokenAccount" we just created
  const signatureTransfer = await transfer(
    connection, // connection
    fromWallet, // payer
    fromTokenAccount.address, // source
    toTokenAccount.address, // destination
    fromWallet.publicKey, // owner
    1000000000, // amount
    [] // signer
  );

  // ---------------------------------------------------
  //  Set Authority
  // ---------------------------------------------------
  // Set new authority for Mint Account
  // https://solana-labs.github.io/solana-program-library/token/js/modules.html#setAuthority
  const randomWallet = Keypair.generate();

  const mintRandAuthSignature = await setAuthority(
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
  const tokenAccRandAuthSignature = await setAuthority(
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

  console.log('signatureMint              =>', signatureMint);
  console.log('signatureTransfer          =>', signatureTransfer);
  console.log('randomWallet.publicKey     =>', randomWallet.publicKey.toString());
  console.log('mintRandAuthSignature      =>', mintRandAuthSignature);
  console.log('tokenAccRandAuthSignature  =>', tokenAccRandAuthSignature);
};

main();

/*
% ts-node <THIS FILE>
fromWallet.publicKey       => GQ2QcR28FDZBhET8q9SWfUpcmWATSULKM8s4WjUUptYX
toWallet.publicKey         => 5naKLmvpULi47LnabrQAy6VmjWgtSqtetiyEA6TaBP7F
fromTokenAccount.address   => 2vZomP2EnGHrpcvkH7J4jEFBQamySnmhaRQ4sR6vagTq
toTokenAccount.address     => Dkm58gSdx7DKwXhp6awKMAgMfjeAdYXTS5XzC1UQ27iE
mint address               => 2uxnmbLxWMLSyLwy3W3UxoPWiL4niaZNP649HG5D9crU
signatureMint              => 2FACkeVohThVWZjeJEDF38Wm3SLxpCBXvtdkfu1WDV2kMxxnGHobUmVp1QQp3WCLkTEXsUtYaKES4kniwa2mRK5
signatureTransfer          => 58sfSATFFMjWfyQGncCKS4KJuoLkyKAzacTm1fq7ow9NxuMnBWmsBrnawy1fCp88pYDwCVyP5Rf9VrxfikKKCwce
randomWallet.publicKey     => DbzhhZxodiorBdqTgUDammynuxFNdYpWGW7BUFyG5ZiA
mintRandAuthSignature      => 4DKFEPNdnqNcR2ZFWhdjXSvwxAggnhe1jm4GfcgCAoN1HXLAyQBQFMx9SCt7uGSUsCE9VBKwMsawWmyjjiwW33tQ
tokenAccRandAuthSignature  => 4WvhfHeAmheBoBbbo31MZpB61MaRrYFribKYuVXZDdEQr3CvH8Xi1oDEd69kbXMvyFVVknTW8ThBLSoRFRKHrcvs
*/
