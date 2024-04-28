// Docs: https://solana-labs.github.io/solana-web3.js/classes/AddressLookupTableProgram.html#closeLookupTable

// Lib
import * as dotenv from 'dotenv';

// Solana
import {
  AddressLookupTableProgram,
  Connection,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';

async function main() {
  dotenv.config();

  // -------------------------------
  //  RPC
  // -------------------------------
  // Replace with QuickNode RPC in .env file.
  const endopoint = process.env.ENDPOINT;
  if (!endopoint) throw new Error('endopoint not found.');
  const connection = new Connection(endopoint);
  // const connection = new Connection('https://api.devnet.solana.com'); // <= Too many request error.
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed'); // <= invalid instruction data error.

  // -------------------------------
  //  Account
  // -------------------------------
  const secret = process.env.PAYER_SECRET_KEY;
  if (!secret) throw new Error('secret not found.');
  const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));

  const lookupTableAddress = new PublicKey(
    'DztivjShDbPkguVMDAGjEumgWYjUED4dcAmkaLn3LQ1P'
  );

  // -------------------------------
  //  Create a Close LUT Instruction
  // -------------------------------
  const closeInstruction = AddressLookupTableProgram.closeLookupTable({
    authority: payer.publicKey,
    lookupTable: lookupTableAddress,
    recipient: payer.publicKey,
  });

  // -------------------------------
  //  Create Versioned Transactions
  // -------------------------------
  const addressLookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value;
  if (!addressLookupTableAccount)
    throw new Error('addressLookupTableAccount not found.');

  let latestBlockhash = await connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [closeInstruction],
  }).compileToV0Message([addressLookupTableAccount]);

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([payer]);

  // -------------------------------
  //  Send a Transaction
  // -------------------------------
  const signature = await connection.sendTransaction(transaction);

  // Check confirmation.
  const confirmation = await connection.confirmTransaction({
    signature: signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  if (confirmation.value.err) throw new Error('Transaction not confirmed.');

  console.log('recipient =>', payer.publicKey.toString());
  console.log('Lookup Table Address=>', lookupTableAddress.toBase58());
  console.log('signature =>', signature);
}

main();

/*
ts-node src/addressLookupTable/4_closeLookupTable.ts
(node:39057) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
recipient => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
Lookup Table Address=> DztivjShDbPkguVMDAGjEumgWYjUED4dcAmkaLn3LQ1P
signature => 4ci1TtDmtVm8maTQEFfVJtaxgV1Sg7gtTTAt6Hr8aK6MnTNLjR4ZzH1fPKG6XgE849k4FHn81qYM1S4UicdVNyQk
*/
