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
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

dotenv.config();

// -------------------------------
//  payer
// -------------------------------
const secret = process.env.PAYER_SECRET_KEY;
if (!secret) throw new Error('secret not found.');
const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));

// -------------------------------
//  RPC
// -------------------------------
// Replace with QuickNode RPC in .env file.
const QUICKNODE_RPC = process.env.ENDPOINT;
if (!QUICKNODE_RPC) throw new Error('QUICKNODE_RPC not found.');
const connection = new Connection(QUICKNODE_RPC);
// const connection = new Connection('https://api.devnet.solana.com'); // <= Too many request error.
// const connection = new Connection('http://127.0.0.1:8899', 'confirmed'); // <= invalid instruction data error.

async function createAddressLookupTable() {
  // Step 1 - Get a lookup table address and create lookup table instruction
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: await connection.getSlot(),
    });

  // Step 2 - Log Lookup Table Address
  console.log('Lookup Table Address:', lookupTableAddress.toBase58());

  // Step 3 - Fetch Latest Blockhash
  let latestBlockhash = await connection.getLatestBlockhash();

  // Step 4 - Generate Transaction Message
  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [lookupTableInst],
  }).compileToV0Message();
  const transaction = new VersionedTransaction(messageV0);

  console.log('messageV0 =>', messageV0);

  // Step 5 - Sign your transaction with the required `Signers`
  transaction.sign([payer]);

  // Step 6 - Send our v0 transaction to the cluster
  const signature = await connection.sendTransaction(transaction, {
    maxRetries: 5,
  });

  // Step 7 - Confirm Transaction
  const confirmation = await connection.confirmTransaction({
    signature: signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  if (confirmation.value.err) {
    throw new Error('Transaction not confirmed.');
  }

  console.log('signature =>', signature);
}

createAddressLookupTable();

/*
ts-node createAddressLookupTable.ts
(node:53799) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Lookup Table Address: 7b6pc8wU8VkoS9bB9wX24nf5z9BnyQCD9GZ81j329Fva
messageV0 => MessageV0 {
  header: {
    numRequiredSignatures: 1,
    numReadonlySignedAccounts: 0,
    numReadonlyUnsignedAccounts: 2
  },
  staticAccountKeys: [
    PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    PublicKey [PublicKey(7b6pc8wU8VkoS9bB9wX24nf5z9BnyQCD9GZ81j329Fva)] {
      _bn: <BN: 61e2735e1ac9cb62f2627966713b9f2934f352a5c9c657dfbb8fe66d0a36d72b>
    },
    PublicKey [PublicKey(AddressLookupTab1e1111111111111111111111111)] {
      _bn: <BN: 277a6af97339b7ac88d1892c90446f50002309266f62e53c118244982000000>
    },
    PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    }
  ],
  recentBlockhash: 'DKYj5rnEsmLht6z8WJouwCrdcgGx392vqbGc8zgJijni',
  compiledInstructions: [
    {
      programIdIndex: 2,
      accountKeyIndexes: [Array],
      data: <Buffer 00 00 00 00 75 08 88 11 00 00 00 00 fc>
    }
  ],
  addressTableLookups: []
}
signature => KBoDSdEEyZebshbLNJZHZ9FF8kXUpCdMrmmT8sZRGFALGsH6ggdBTZNqYdCz2hjSPs3jvkvmMVyhgXCsiE6wAH8
*/
