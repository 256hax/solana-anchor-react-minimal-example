// ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createAccount
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createMint,
  createAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ------------------------------------------------------------------------
  //  Wallet
  // ------------------------------------------------------------------------
  const payer = Keypair.generate();

  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropAlice = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropAlice,
  });

  const mint = await createMint(
    connection, // connection
    payer, // payer
    payer.publicKey, // mintAuthority
    null, // freezeAuthority
    9 // decimals
  );

  const tokenAccount = await createAccount(
    connection, // connection,
    payer, // payer
    mint, // mint
    payer.publicKey, // owner
    undefined, // keypair
    undefined, // confirmOptions
    TOKEN_PROGRAM_ID, // programId
  );

  console.log('tokenAccount =>', tokenAccount.toString());
};

main();

/*
% ts-node <THIS FILE>
tokenAccount => GcHs4epSux2U2psVe2Y5s3aLGpLWrSYnTETGbsHt7vTC
*/

/*
Solana Explorer =>
  Token Account
  Address: GcHs4epSux2U2psVe2Y5s3aLGpLWrSYnTETGbsHt7vTC
  Mint: ADEXywsw97e4iJsSZT8Ygi4Jv4fiPL1Vj8ZkWtvWyQLw
  Owner:	3nP9ayc5PygSLV39NydSAv5oEX5ytiTjNXzpjz4NcTi4
  Token balance (tokens):	0
*/