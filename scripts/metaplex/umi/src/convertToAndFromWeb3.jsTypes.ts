// Docs: https://github.com/metaplex-foundation/umi/blob/main/docs/web3js-adapters.md
// Lib
import * as dotenv from 'dotenv';

// Solana
import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  Instruction,
  keypairIdentity,
  publicKey,
  WrappedInstruction,
} from '@metaplex-foundation/umi';
import {
  fromWeb3JsInstruction,
  toWeb3JsInstruction,
} from '@metaplex-foundation/umi-web3js-adapters';

// ----------------------------------------------------
//  Setup
// ----------------------------------------------------
dotenv.config();

const endpoint = process.env.ENDPOINT;
if (!endpoint) throw new Error('endpoint not found.');
const umi = createUmi(endpoint);

// Set Payer
const payerSecretKey = process.env.PAYER_SECRET_KEY;
if (!payerSecretKey) throw new Error('payerSecretKey not found.');
const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
const payerKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
umi.use(keypairIdentity(payerKeypair));

// ------------------------------------------
//  Wallet
// ------------------------------------------
const payer = Keypair.generate();
const taker = Keypair.generate();
const referenceKeypair = umi.eddsa.generateKeypair();

// ------------------------------------------
//  Convert To and From Solana web3.js
// ------------------------------------------
// // For public keys.
// fromWeb3JsPublicKey(myWeb3JsPublicKey);
// toWeb3JsPublicKey(myUmiPublicKey);

// // For keypairs.
// fromWeb3JsKeypair(myWeb3JsKeypair);
// toWeb3JsKeypair(myUmiKeypair);

// // For transactions.
// fromWeb3JsTransaction(myWeb3JsTransaction);
// toWeb3JsTransaction(myUmiTransaction);
// fromWeb3JsLegacyTransaction(myLegacyWeb3JsTransaction);
// toWeb3JsLegacyTransaction(myUmiTransaction);

// // For transaction messages.
// fromWeb3JsMessage(myWeb3JsTransactionMessage);
// toWeb3JsMessage(myUmiTransactionMessage);
// toWeb3JsMessageFromInput(myUmiTransactionInput);

// ------------------------------------------
//  Instructions
// ------------------------------------------
const myWeb3JsInstruction = SystemProgram.transfer({
  fromPubkey: payer.publicKey,
  toPubkey: taker.publicKey,
  lamports: LAMPORTS_PER_SOL * 0.001,
});

const myUmiInstruction: Instruction = {
  keys: [
    {
      pubkey: referenceKeypair.publicKey,
      isSigner: true,
      isWritable: false,
    },
  ],
  data: Buffer.from('This memo using no library(=vanilla)', 'utf-8'),
  programId: publicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
};

fromWeb3JsInstruction(myWeb3JsInstruction);
toWeb3JsInstruction(myUmiInstruction);

console.log('fromWeb3JsInstruction => %o', fromWeb3JsInstruction);
console.log('toWeb3JsInstruction => %o', toWeb3JsInstruction);

/*
% ts-node src/convertToAndFromWeb3.js.ts
fromWeb3JsInstruction => <ref *1> [Function: fromWeb3JsInstruction] {
  [length]: 1,
  [name]: 'fromWeb3JsInstruction',
  [prototype]: { [constructor]: [Circular *1] }
}
toWeb3JsInstruction => <ref *1> [Function: toWeb3JsInstruction] {
  [length]: 1,
  [name]: 'toWeb3JsInstruction',
  [prototype]: { [constructor]: [Circular *1] }
}
*/