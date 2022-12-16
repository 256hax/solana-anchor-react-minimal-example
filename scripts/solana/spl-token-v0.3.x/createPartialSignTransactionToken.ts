// Ref: https://solanacookbook.com/references/offline-transactions.html#sign-transaction
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  createMint,
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import base58 from "bs58";

/* The transaction:
 * - sends 0.01 SOL from Alice to Bob
 * - sends 1 token from Bob to Alice
 * - is partially signed by Bob, so Alice can approve + send it
 */

export const main = async () => {
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // ------------------------------------------------------------------------
  //  Account
  // ------------------------------------------------------------------------
  // [Devnet]
  // const alicePublicKey = new PublicKey("5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8");
  // 
  // [Localnet]
  const aliceKeypair = Keypair.generate();
  const bobKeypair = Keypair.fromSecretKey(
    base58.decode(
      "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
    )
  );
  console.log('aliceKeypair.publicKey =>', aliceKeypair.publicKey.toString());
  console.log('bobKeypair.publicKey =>', bobKeypair.publicKey.toString());

  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  let latestBlockhash: any;

  latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropAlice = await connection.requestAirdrop(aliceKeypair.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropAlice,
  });

  latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropBob = await connection.requestAirdrop(bobKeypair.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropBob,
  });

  // ------------------------------------------------------------------------
  //  Token Account
  // ------------------------------------------------------------------------
  // [Devnet]
  // const tokenAddress = new PublicKey(
  //   "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  // );
  // const bobTokenAddress = await getAssociatedTokenAddress(
  //   tokenAddress,
  //   bobKeypair.publicKey
  // );

  // [Localnet]
  const tokenAddress = await createMint(
    connection, // connection
    bobKeypair, // payer
    bobKeypair.publicKey, // mintAuthority
    null, // freezeAuthority
    6 // decimals
  );
  const bobTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    bobKeypair, // Bob pays the fee to create it
    tokenAddress, // which token the account is for
    bobKeypair.publicKey // who the token account is for
  );


  // Alice may not have a token account, so Bob creates one if not
  const aliceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    bobKeypair, // Bob pays the fee to create it
    tokenAddress, // which token the account is for
    aliceKeypair.publicKey // who the token account is for
  );

  // Get the details about the token mint
  const tokenMint = await getMint(connection, tokenAddress);

  const signatureMint = await mintTo(
    connection, // connection
    bobKeypair, // payer
    tokenAddress, // mint
    bobTokenAccount.address, // destination
    bobKeypair.publicKey, // authority
    1000000, // amount
    [] // signer(s)
  );

  console.log('bobTokenAccount =>', bobTokenAccount.address.toString());
  console.log('aliceTokenAccount =>', aliceTokenAccount.address.toString());
  
  // ------------------------------------------------------------------------
  //  Create Transaction
  // ------------------------------------------------------------------------
  // Get a recent blockhash to include in the transaction
  const { blockhash } = await connection.getLatestBlockhash("finalized");

  latestBlockhash = await connection.getLatestBlockhash();
  const transaction = new Transaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    // Alice pays the transaction fee
    feePayer: aliceKeypair.publicKey,
  });

  // Transfer 0.01 SOL from Alice -> Bob
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: aliceKeypair.publicKey,
      toPubkey: bobKeypair.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    })
  );

  // Transfer 1 token from Bob -> Alice
  transaction.add(
    createTransferCheckedInstruction(
      bobTokenAccount.address, // source
      tokenAddress, // mint
      aliceTokenAccount.address, // destination
      bobKeypair.publicKey, // owner of source account
      1 * 10 ** tokenMint.decimals, // amount to transfer
      tokenMint.decimals // decimals of token
    )
  );

  // Partial sign as Bob
  transaction.partialSign(bobKeypair);
  // transaction.partialSign(aliceKeypair);

  // ------------------------------------------------------------------------
  //  Serialize Transaction
  // ------------------------------------------------------------------------
  // Serialize the transaction and convert to base64 to return it
  const serializedTransaction = transaction.serialize({
    // We will need Alice to deserialize and sign the transaction
    requireAllSignatures: false,
  });
  const transactionBase64 = serializedTransaction.toString("base64");

  // You can send data to anywhere.
  // return transactionBase64;

  // ------------------------------------------------------------------------
  //  Recover Transaction
  // ------------------------------------------------------------------------
  // The caller of this can convert it back to a transaction object:
  const recoveredTransaction = Transaction.from(
    Buffer.from(transactionBase64, "base64")
  );

  // Partial sign as Alice
  recoveredTransaction.partialSign(aliceKeypair);
  
  const sig = await connection.sendRawTransaction(recoveredTransaction.serialize())
  console.log('signature =>', sig);
};

main();

/*
% ts-node <THIS FILE>
aliceKeypair.publicKey => EHDs9TSrqUzPff3r2kBcNkaZ4V5wUS5NZTZfua3znedM
bobKeypair.publicKey => G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
bobTokenAccount => 4M7JTyJLLoucwNtUj4uZoS4j5rfNvHzmves9GejVMKKH
aliceTokenAccount => FJh5vMsAQ81JoS441Zyzqdsq6jUF2iX2cS8jnN96cLaw
signature => 54m5Ff3iGXxVFytgZn19BfhmnJCQdGut69kx94BPJNvzoPU2HHhPrbEnndPynKAqTJbMasWsLWHEApbv9eyfzU4A
*/