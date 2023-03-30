import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import {
  createMint,
  createAccount,
  createAssociatedTokenAccount,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ---------------------------------------------------
  //  Payer
  // ---------------------------------------------------
  const payer = Keypair.generate();

  // ---------------------------------------------------
  //  Airdrop
  // ---------------------------------------------------
  let latestBlockhash = await connection.getLatestBlockhash();
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  console.log('owner =>', payer.publicKey.toString());

  // ---------------------------------------------------
  //  Create ATA using createAssociatedTokenAccount
  // ---------------------------------------------------
  // Ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createAssociatedTokenAccount

  // const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC Token in Devnet
  const mint = await createMint(
    connection, // connection
    payer, // payer
    payer.publicKey, // mintAuthority
    null, // freezeAuthority
    9 // decimals
  );

  // createAccount using ASSOCIATED_TOKEN_PROGRAM_ID.
  const ata = await createAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint
    payer.publicKey, // owner
  );

  console.log('ata =>', ata.toString());
  console.log('ASSOCIATED_TOKEN_PROGRAM_ID =>', ASSOCIATED_TOKEN_PROGRAM_ID.toString());
  
  // ---------------------------------------------------
  //  Create ATA using createMint
  // ---------------------------------------------------
  // ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createAccount
  const mint2 = await createMint(
    connection, // connection
    payer, // payer
    payer.publicKey, // mintAuthority
    null, // freezeAuthority
    9 // decimals
  );

  // createAccount using TOKEN_PROGRAM_ID.
  const ata2 = await createAccount(
    connection, // connection,
    payer, // payer
    mint2, // mint
    payer.publicKey, // owner
  );

  console.log('ata2 =>', ata2.toString());
  console.log('TOKEN_PROGRAM_ID =>', TOKEN_PROGRAM_ID.toString());
};

main();

/*
% ts-node <THIS FILE>
owner => 9U8ZLA6jdLPSet6zm3fNB1yt3tNQufJrzjHtX8yyLwwW
ata => 3rgM2MxWbNrVZo6QBUGXxsPbGQ1xajhskR1Ux6Wpcvbe
ASSOCIATED_TOKEN_PROGRAM_ID => ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL
ata2 => etWvc85VD3heS7wziHUKeuqkiQJu9S8XsPyxHR9xan7
TOKEN_PROGRAM_ID => TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
*/