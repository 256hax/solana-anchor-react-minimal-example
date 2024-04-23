// Docs:
//  https://www.quicknode.com/guides/solana-development/accounts-and-data/how-to-use-lookup-tables-on-solana
//  https://solana.com/docs/advanced/lookup-tables
//  https://github.com/solana-developers/web3-examples/blob/main/address-lookup-tables/tests/test.ts

// Lib
import * as dotenv from 'dotenv';

// Solana
import {
  AddressLookupTableProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

dotenv.config();

// -------------------------------
//  Setup
// -------------------------------
const secret = process.env.PAYER_SECRET_KEY;
if (!secret) throw new Error('secret not found.');
const SIGNER_WALLET = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));

const DESTINATION_WALLET = Keypair.generate();
//const LOOKUP_TABLE_ADDRESS = new PublicKey(""); // We will add this later

// Replace with QuickNode RPC in .env file.
const QUICKNODE_RPC = process.env.ENDPOINT;
if (!QUICKNODE_RPC) throw new Error('QUICKNODE_RPC not found.');
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

// const SOLANA_CONNECTION = new Connection('https://api.devnet.solana.com'); // <= Too many request error.
// const SOLANA_CONNECTION = new Connection('http://127.0.0.1:8899', 'confirmed'); // <= invalid instruction data error.


async function createAndSendV0Tx(txInstructions: TransactionInstruction[]) {
  // Step 1 - Fetch Latest Blockhash
  let latestBlockhash = await SOLANA_CONNECTION.getLatestBlockhash('finalized');
  console.log(
    '   ✅ - Fetched latest blockhash. Last valid height:',
    latestBlockhash.lastValidBlockHeight
  );

  // Step 2 - Generate Transaction Message
  const messageV0 = new TransactionMessage({
    payerKey: SIGNER_WALLET.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: txInstructions,
  }).compileToV0Message();
  console.log('   ✅ - Compiled transaction message');
  const transaction = new VersionedTransaction(messageV0);

  // Step 3 - Sign your transaction with the required `Signers`
  transaction.sign([SIGNER_WALLET]);
  console.log('   ✅ - Transaction Signed');

  // Step 4 - Send our v0 transaction to the cluster
  const txid = await SOLANA_CONNECTION.sendTransaction(transaction, {
    maxRetries: 5,
  });
  console.log('   ✅ - Transaction sent to network');

  // Step 5 - Confirm Transaction
  const confirmation = await SOLANA_CONNECTION.confirmTransaction({
    signature: txid,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  if (confirmation.value.err) {
    throw new Error('   ❌ - Transaction not confirmed.');
  }
  console.log(
    '🎉 Transaction succesfully confirmed!',
    '\n',
    `https://explorer.solana.com/tx/${txid}?cluster=devnet`
  );
}


async function createLookupTable() {
  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  // const latestBlockhash = await SOLANA_CONNECTION.getLatestBlockhash();
  // const signatureAirdrop = await SOLANA_CONNECTION.requestAirdrop(
  //   SIGNER_WALLET.publicKey,
  //   LAMPORTS_PER_SOL
  // );
  // await SOLANA_CONNECTION.confirmTransaction({
  //   blockhash: latestBlockhash.blockhash,
  //   lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  //   signature: signatureAirdrop,
  // });

  // Step 1 - Get a lookup table address and create lookup table instruction
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: SIGNER_WALLET.publicKey,
      payer: SIGNER_WALLET.publicKey,
      recentSlot: await SOLANA_CONNECTION.getSlot(),
    });

  // Step 2 - Log Lookup Table Address
  console.log('Lookup Table Address:', lookupTableAddress.toBase58());

  // Step 3 - Generate a transaction and send it to the network
  createAndSendV0Tx([lookupTableInst]);
}

createLookupTable();

/*
ts-node createAddressLookupTable.ts
(node:50253) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Lookup Table Address: 9ihS8eqZpuJnSJerjxA8oQQh44bNJe7q1riCFKHR9Nfg
   ✅ - Fetched latest blockhash. Last valid height: 282293408
   ✅ - Compiled transaction message
   ✅ - Transaction Signed
   ✅ - Transaction sent to network
🎉 Transaction succesfully confirmed!
 https://explorer.solana.com/tx/5EPr8GVd93tbQsGkpvr9So1KxjuofhJDRjB8iDm8cSj5ygr8814JxaaQF5DiAhibEzv2daui8kERgvmk1q5z7bnF?cluster=devnet
*/