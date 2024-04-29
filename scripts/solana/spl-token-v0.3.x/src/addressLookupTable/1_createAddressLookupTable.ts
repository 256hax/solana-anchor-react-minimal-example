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
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

async function createAddressLookupTable() {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  // Set Endpoint
  // Replace with QuickNode RPC in .env file.
  const endopoint = process.env.ENDPOINT;
  if (!endopoint) throw new Error('endopoint not found.');
  const connection = new Connection(endopoint);
  // const connection = new Connection('https://api.devnet.solana.com'); // <= Too many request error.
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed'); // <= invalid instruction data error.

  // Set Payer
  const secret = process.env.PAYER_SECRET_KEY;
  if (!secret) throw new Error('secret not found.');
  const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));

  // ----------------------------------------------------
  //  Create LUT Instructions
  // ----------------------------------------------------
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: await connection.getSlot(),
    });

  // ----------------------------------------------------
  //  Create Versioned Transactions
  // ----------------------------------------------------
  let latestBlockhash = await connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [lookupTableInst],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([payer]);

  // ----------------------------------------------------
  //  Send a Transaction
  // ----------------------------------------------------
  const signature = await connection.sendTransaction(transaction);

  const confirmation = await connection.confirmTransaction({
    signature: signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  if (confirmation.value.err) throw new Error('Transaction not confirmed.');

  console.log('payer =>', payer.publicKey.toString());
  console.log('Lookup Table Address =>', lookupTableAddress.toBase58());
  console.log('messageV0 =>', messageV0);
  console.log('transaction length', transaction.serialize().length, 'bytes');
  console.log('signature =>', signature);
}

createAddressLookupTable();

/*
ts-node createAddressLookupTable.ts
(node:98546) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
Lookup Table Address => EDZzUPDbU4pjAQKq9qWATUKVN4DbmUQrgqZ3LYSStRYy
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
    PublicKey [PublicKey(EDZzUPDbU4pjAQKq9qWATUKVN4DbmUQrgqZ3LYSStRYy)] {
      _bn: <BN: c46033e2cddeaf2a5c33aab4efc92bf1411d718d0641c36e2f985ae110600f06>
    },
    PublicKey [PublicKey(AddressLookupTab1e1111111111111111111111111)] {
      _bn: <BN: 277a6af97339b7ac88d1892c90446f50002309266f62e53c118244982000000>
    },
    PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    }
  ],
  recentBlockhash: 'BKKQyTYc2VPSiPaBZiX76LuZN2KwDQkpHgcLW9Vamzcu',
  compiledInstructions: [
    {
      programIdIndex: 2,
      accountKeyIndexes: [Array],
      data: <Buffer 00 00 00 00 ce a9 95 11 00 00 00 00 ff>
    }
  ],
  addressTableLookups: []
}
transaction length 252 bytes
signature => 3LrgEuKAkdQKMuHp9tQLdXZjLVqMy93rb74QSZ5AsmcVh7i6uQr5tszLFccP1wtGaswxJndYLBASnk73c9WyKGqN
*/
