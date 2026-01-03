// Docs:
//  https://www.quicknode.com/guides/solana-development/accounts-and-data/how-to-use-lookup-tables-on-solana
//  https://solana.com/docs/advanced/lookup-tables

// Lib
import * as dotenv from 'dotenv';

// Solana
import {
  AddressLookupTableProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';

async function main() {
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

  // Set Taker
  const taker = Keypair.generate();

  // Set LUT Address
  const lookupTableAddress = new PublicKey(
    'DztivjShDbPkguVMDAGjEumgWYjUED4dcAmkaLn3LQ1P'
  );

  // ----------------------------------------------------
  //  Add Lookup Addresses to LUT
  // ----------------------------------------------------
  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: payer.publicKey,
    authority: payer.publicKey,
    lookupTable: lookupTableAddress,
    addresses: [
      payer.publicKey,
      taker.publicKey,
      SystemProgram.programId,
      // list more `publicKey` addresses here
    ],
  });

  // ----------------------------------------------------
  //  Create Some Instructions if you need it
  // ----------------------------------------------------
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.0001,
  });

  // ----------------------------------------------------
  //  Create Versioned Transactions
  // ----------------------------------------------------
  const addressLookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value;
  if (!addressLookupTableAccount)
    throw new Error('addressLookupTableAccount not found.');

  let latestBlockhash = await connection.getLatestBlockhash();

  // You can add instructions to LUT.
  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [extendInstruction, transferInstruction],
  }).compileToV0Message([addressLookupTableAccount]);

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([payer]);

  // ----------------------------------------------------
  //  Send a Transaction
  // ----------------------------------------------------
  const signature = await connection.sendTransaction(transaction);

  // Check confirmation.
  const confirmation = await connection.confirmTransaction({
    signature: signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  if (confirmation.value.err) throw new Error('Transaction not confirmed.');

  console.log('payer =>', payer.publicKey.toString());
  console.log('taker =>', taker.publicKey.toString());
  console.log(
    'SystemProgram.programId, =>',
    SystemProgram.programId.toString()
  );
  console.log('Lookup Table Address =>', lookupTableAddress.toBase58());
  console.log('addressLookupTableAccount =>', addressLookupTableAccount);
  console.log('messageV0 =>', messageV0);
  console.log('transaction length', transaction.serialize().length, 'bytes');
  console.log('signature =>', signature);
}

main();

/*
ts-node createExtendLookupTable.ts

(node:98595) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
taker => M3QE4yVKmuuxWpn9cFphdH2MThBuDgGuvLES56hk9Gt
SystemProgram.programId, => 11111111111111111111111111111111
Lookup Table Address => DztivjShDbPkguVMDAGjEumgWYjUED4dcAmkaLn3LQ1P
addressLookupTableAccount => AddressLookupTableAccount {
  key: PublicKey [PublicKey(DztivjShDbPkguVMDAGjEumgWYjUED4dcAmkaLn3LQ1P)] {
    _bn: <BN: c120d51ca0e5701635d842e864600b1526afa0b24ccb68b8de926fbe327d36ca>
  },
  state: {
    deactivationSlot: 18446744073709551615n,
    lastExtendedSlot: 295020616,
    lastExtendedSlotStartIndex: 0,
    authority: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    addresses: [
      [PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)]]
    ]
  }
}
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
    PublicKey [PublicKey(DztivjShDbPkguVMDAGjEumgWYjUED4dcAmkaLn3LQ1P)] {
      _bn: <BN: c120d51ca0e5701635d842e864600b1526afa0b24ccb68b8de926fbe327d36ca>
    },
    PublicKey [PublicKey(M3QE4yVKmuuxWpn9cFphdH2MThBuDgGuvLES56hk9Gt)] {
      _bn: <BN: 5225492b7f5bf6b486c15f637b954f1b26306f8722eea452e372e91b9b16691>
    },
    PublicKey [PublicKey(AddressLookupTab1e1111111111111111111111111)] {
      _bn: <BN: 277a6af97339b7ac88d1892c90446f50002309266f62e53c118244982000000>
    },
    PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    }
  ],
  recentBlockhash: 'BsmpqBgs97EZE2psPMnKwikcPx5M5BraK5911JKKcmu',
  compiledInstructions: [
    {
      programIdIndex: 3,
      accountKeyIndexes: [Array],
      data: <Buffer 02 00 00 00 03 00 00 00 00 00 00 00 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 05 22 54 92 b7 f5 ... 58 more bytes>
    },
    {
      programIdIndex: 4,
      accountKeyIndexes: [Array],
      data: <Buffer 02 00 00 00 40 42 0f 00 00 00 00 00>
    }
  ],
  addressTableLookups: []
}
transaction length 396 bytes
signature => 2VhPMxnWKrZBqh9SXkFbF41axdyaMc28xnU8h6KHBY4JNgiKzuTBXe8dus8Rp7obBBFN4St8BaUvFLdr9pmzMkqr
*/
