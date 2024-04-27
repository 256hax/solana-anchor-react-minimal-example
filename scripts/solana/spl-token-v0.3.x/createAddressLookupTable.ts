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
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

dotenv.config();

// -------------------------------
//  Wallet
// -------------------------------
const secret = process.env.PAYER_SECRET_KEY;
if (!secret) throw new Error('secret not found.');
const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));

const taker = Keypair.generate();

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
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: await connection.getSlot(),
    });

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.001,
  });

  let latestBlockhash = await connection.getLatestBlockhash();

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: [lookupTableInst, transferInstruction],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  transaction.sign([payer]);

  const signature = await connection.sendTransaction(transaction);

  console.log('payer =>', payer.publicKey.toString());
  console.log('taker =>', taker.publicKey.toString());
  console.log('Lookup Table Address:', lookupTableAddress.toBase58());
  console.log('messageV0 =>', messageV0);
  console.log('transaction length', transaction.serialize().length, 'bytes');
  console.log('signature =>', signature);
}

createAddressLookupTable();

/*
ts-node createAddressLookupTable.ts

(node:92802) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
payer => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
taker => FSmQLyzFipe7Mrn69BN9xHbzgVsKsULHuRZG7aiSd7tr
Lookup Table Address: FcsncC9j3H56VF7aGjXYqk1cb4SQg4hMxnSwYMLdSDFN
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
    PublicKey [PublicKey(FcsncC9j3H56VF7aGjXYqk1cb4SQg4hMxnSwYMLdSDFN)] {
      _bn: <BN: d9345e9bda14e4c175a401da1e0fbb0c1196547c47df95a243ca75873432ce79>
    },
    PublicKey [PublicKey(FSmQLyzFipe7Mrn69BN9xHbzgVsKsULHuRZG7aiSd7tr)] {
      _bn: <BN: d69d57df743b7e7b474cae7529c294f4fa36a3ded6beb150168964219624c1a7>
    },
    PublicKey [PublicKey(AddressLookupTab1e1111111111111111111111111)] {
      _bn: <BN: 277a6af97339b7ac88d1892c90446f50002309266f62e53c118244982000000>
    },
    PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    }
  ],
  recentBlockhash: 'FtZjpLZaUD4Fs2DjgcB3sNMsfwXTuva42sB1trtF2KD6',
  compiledInstructions: [
    {
      programIdIndex: 3,
      accountKeyIndexes: [Array],
      data: <Buffer 00 00 00 00 76 43 95 11 00 00 00 00 fe>
    },
    {
      programIdIndex: 4,
      accountKeyIndexes: [Array],
      data: <Buffer 02 00 00 00 40 42 0f 00 00 00 00 00>
    }
  ],
  addressTableLookups: []
}
transaction length 301 bytes
signature => 3VNRDL4WwYgfy9bHhhbHKFJAiMYUKG2e6ATZWPdmJPuaKf88dy73vviwFVdgVQDCNokewzWZmrQemJPEjyof3Dkn
*/
