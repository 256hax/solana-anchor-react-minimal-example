import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  createAccount,
  createAssociatedTokenAccount,
  closeAccount,
  createCloseAccountInstruction,
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
    payer.publicKey // owner
  );

  console.log('ata =>', ata.toString());

  // ---------------------------------------------------
  //  Create ATA using createMint
  // ---------------------------------------------------
  // Docs: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createAccount
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
    payer.publicKey // owner
  );

  console.log('ata2 =>', ata2.toString());

  // ---------------------------------------------------
  //  Close ATA
  // ---------------------------------------------------
  // Docs: https://solanacookbook.com/references/token.html#how-to-close-token-accounts
  // 1) use build-in function
  const signatureCloseAccount = await closeAccount(
    connection, // connection
    payer, // payer
    ata, // token account which you want to close
    payer.publicKey, // destination
    payer // owner of token account
  );
  console.log('signatureCloseAccount =>', signatureCloseAccount);

  // or
  // 2) compose by yourself
  let tx = new Transaction().add(
    createCloseAccountInstruction(
      ata2, // token account which you want to close
      payer.publicKey, // destination
      payer.publicKey // owner of token account
    )
  );

  const signatureCloseAccountInstruction = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log('signatureCloseAccountInstruction =>', signatureCloseAccountInstruction);
};

main();

/*
ts-node closeAssociatedTokenAccount.ts
owner => 72VVdX4qwJeF1gt8c2NEVsJaVnDnwLdDVebuKjKNqU8x
ata => 3W1UEooyGRE6Cwa9AoHLvRfZFbkwyEKFAyJEwF8kaJGV
ata2 => AU4nuvdvbx5WFSKtFCKQVEsKE73XknocXHsfbW6Poe9s
signatureCloseAccount => 4VjtMHitm5NTNHMB7dpstkfHyJ9qnSTckAn1DjuSCGF5k37HVvwF38oMMhGwna6z9FK1gVN8UwuNqjJzXk3mxD13
signatureCloseAccountInstruction => 3YxcJHCcxkwQs6geTd5hJxwxMrfNLr2cgBXTMhhG1KPKhL2cn61N3ziAqSbUsttuqZAok4Hhmig59NU6KhYtxTvz
*/
