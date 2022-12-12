// Source: https://solanacookbook.com/references/offline-transactions.html#sign-transaction
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

  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  let latestBlockhash = await connection.getLatestBlockhash();
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
    aliceKeypair.publicKey // who the token account is for
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

  // Serialize the transaction and convert to base64 to return it
  const serializedTransaction = transaction.serialize({
    // We will need Alice to deserialize and sign the transaction
    requireAllSignatures: false,
  });
  const transactionBase64 = serializedTransaction.toString("base64");

  console.log('\n transaction =>', transaction);
  console.log('\n serializedTransaction =>', serializedTransaction);
  console.log('\n transactionBase64 =>', transactionBase64);
  
  return transactionBase64;

  // The caller of this can convert it back to a transaction object:
  const recoveredTransaction = Transaction.from(
    Buffer.from(transactionBase64, "base64")
  );
};

main();

/*
% ts-node <THIS FILE>

 transaction => Transaction {
  signatures: [
    { signature: null, publicKey: [PublicKey] },
    {
      signature: <Buffer 7a 18 2f 32 e4 29 61 6b 67 92 ff 79 40 6e d4 f4 27 ac e0 4f 34 a8 40 80 06 a6 f7 ac 7c bb 9e 56 b0 71 6b 18 8c a7 84 13 98 fd 54 63 a9 8f a5 30 b4 6e ... 14 more bytes>,
      publicKey: [PublicKey]
    }
  ],
  feePayer: PublicKey {
    _bn: <BN: f19b27aaf6b14efd0f68f9e1d0faf030c1d0d6f8a647e8000ef4ba9594406cca>
  },
  instructions: [
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 02 00 00 00 80 96 98 00 00 00 00 00>
    },
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 0c 40 42 0f 00 00 00 00 00 06>
    }
  ],
  recentBlockhash: '2f2DbzNg4bwmAa1eBSUW9BYU9FheMaiLQZDm4KnmSpEA',
  lastValidBlockHeight: 24246,
  nonceInfo: undefined,
  _message: undefined,
  _json: undefined
}

 serializedTransaction => <Buffer 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 342 more bytes>

 transactionBase64 => AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6GC8y5Clha2eS/3lAbtT0J6zgTzSoQIAGpvesfLueVrBxaxiMp4QTmP1UY6mPpTC0bnUS/b3zTtKVc/78lBIMAgADBvGbJ6r2sU79D2j54dD68DDB0Nb4pkfoAA70upWUQGzK3zDmygmBwaZ37tb3y0ayqkQsqbehChDklLrepLm2lE9S0YQQFlSeKCvalCTmkVayYfOjuzKzrrTI8GIy9QvYLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFP/ju2xJjVsqwlMs+ggGGc4bKtdmjsPIcfe9L8m0n9YG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqRiZIlKsrz0HIsVvF3JxkhMgYLV6R+eDh8qn87K2EEJfAgMCAAEMAgAAAICWmAAAAAAABQQCBAIBCgxAQg8AAAAAAAY=
*/