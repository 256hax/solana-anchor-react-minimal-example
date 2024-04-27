// Docs:
//  https://solana.com/docs/advanced/lookup-tables

// Lib
import * as dotenv from 'dotenv';

// Solana
import {
  AddressLookupTableProgram,
  Connection,
  SystemProgram,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
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
  const lookupTableAddress = new PublicKey(
    '7b6pc8wU8VkoS9bB9wX24nf5z9BnyQCD9GZ81j329Fva'
  );

  // add addresses to the `lookupTableAddress` table via an `extend` instruction
  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: payer.publicKey,
    authority: payer.publicKey,
    lookupTable: lookupTableAddress,
    addresses: [
      payer.publicKey,
      SystemProgram.programId,
      // list more `publicKey` addresses here
    ],
  });

  // Send this `extendInstruction` in a transaction to the cluster
  // to insert the listing of `addresses` into your lookup table with address `lookupTableAddress`

  let latestBlockhash = await connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [extendInstruction],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([payer]);

  const signature = await connection.sendTransaction(transaction);

  const confirmation = await connection.confirmTransaction({
    signature: signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  if (confirmation.value.err) throw new Error('Transaction not confirmed.');

  console.log('Lookup Table Address:', lookupTableAddress.toBase58());
  console.log('messageV0 =>', messageV0);
  console.log('signature =>', signature);
}

createAddressLookupTable();

/*
ts-node createExtendLookupTable.ts
(node:80973) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
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
  recentBlockhash: 'BXSsedrqQSiFzwedb7HZXW6CCz1vQGbRnrbLuaxjDT5s',
  compiledInstructions: [
    {
      programIdIndex: 2,
      accountKeyIndexes: [Array],
      data: <Buffer 02 00 00 00 02 00 00 00 00 00 00 00 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 00 00 00 00 00 00 ... 26 more bytes>
    }
  ],
  addressTableLookups: []
}
signature => 3DKQikyE4q9F8tsEWqq9LudKLt9eF9YNaeSx56LRVbygkuWruFgnzqCJvdJRoGCzCUDYxvxwWgbnfuuFYST7ohuL
*/
