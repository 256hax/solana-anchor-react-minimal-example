//Docs: https://github.com/metaplex-foundation/umi/blob/main/docs/transactions.md

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import {
  keypairIdentity,
  transactionBuilder,
  WrappedInstruction,
  publicKey,
  createSignerFromKeypair,
  TransactionBuilder,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { addMemo } from '@metaplex-foundation/mpl-toolbox';

const main = async () => {
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
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  // ----------------------------------------------------
  //  Create Instructions
  // ----------------------------------------------------
  // Create Instructions using no library(=vanilla).
  const referenceKeypair = umi.eddsa.generateKeypair();
  const referenceSigner = createSignerFromKeypair(umi, referenceKeypair);

  const instructionsVanilla: WrappedInstruction = {
    bytesCreatedOnChain: 300,
    instruction: {
      // This is add keys example. You can remove it.
      keys: [
        {
          pubkey: publicKey(referenceKeypair.publicKey),
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from('This memo using no library(=vanilla)', 'utf-8'),
      programId: publicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    },
    signers: [umi.payer, referenceSigner],
  };

  // Create Instructions using Metaplex Toolbox.
  const instructionsMplToolbox: TransactionBuilder = addMemo(umi, {
    memo: 'This memo using Metaplex Toolbox',
  });

  // Add instructions to Transaction Builder.
  let builder = transactionBuilder()
    // .add(instructionsVanilla)
    .add(instructionsMplToolbox);

  // ----------------------------------------------------
  //  Send a Transaction
  // ----------------------------------------------------
  const result = await builder.sendAndConfirm(umi);

  console.log('builder => %o', builder);
  console.log('signature =>', bs58.encode(result.signature));
};

main();

/*
ts-node src/transactionBuilder.ts
(node:18623) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Server responded with 429 Too Many Requests.  Retrying after 500ms delay...
Server responded with 429 Too Many Requests.  Retrying after 1000ms delay...
Server responded with 429 Too Many Requests.  Retrying after 2000ms delay...
Server responded with 429 Too Many Requests.  Retrying after 4000ms delay...
builder => TransactionBuilder {
  items: [
    {
      bytesCreatedOnChain: 300,
      instruction: {
        keys: [ [Object], [length]: 1 ],
        data: <Buffer 54 68 69 73 20 6d 65 6d 6f 20 75 73 69 6e 67 20 6e 6f 20 6c 69 62 72 61 72 79 28 3d 76 61 6e 69 6c 6c 61 29 2e>,
        programId: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
      },
      signers: [
        {
          publicKey: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
          secretKey: [Uint8Array],
          signMessage: [AsyncFunction],
          signTransaction: [AsyncFunction],
          signAllTransactions: [AsyncFunction]
        },
        {
          publicKey: 'HfLw1wk1mRExgM8XuvFkRKgbiZuG67U5kjr2UMuNjuWt',
          secretKey: [Uint8Array],
          signMessage: [AsyncFunction],
          signTransaction: [AsyncFunction],
          signAllTransactions: [AsyncFunction]
        },
        [length]: 2
      ]
    },
    {
      instruction: {
        keys: [ [length]: 0 ],
        programId: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
        data: Uint8Array(36) [
          32,
          0,
          0,
          0,
          84,
          104,
          105,
          115,
          32,
          109,
          101,
          109,
          111,
          32,
          117,
          115,
          105,
          110,
          103,
          32,
          77,
          101,
          116,
          97,
          112,
          108,
          101,
          120,
          32,
          84,
          111,
          111,
          108,
          98,
          111,
          120,
          [BYTES_PER_ELEMENT]: 1,
          [length]: 36,
          [byteLength]: 36,
          [byteOffset]: 0,
          [buffer]: ArrayBuffer { byteLength: 36 }
        ]
      },
      signers: [ [length]: 0 ],
      bytesCreatedOnChain: 0
    },
    [length]: 2
  ],
  options: {}
}
signature => 3a3AwaxEUoKWPcpzmL1pmuBcNDZdejEtXNhZNUSApECeS1Rs2mXcYxNxfKYvxcEQoBKz1H8jzgj8BE79NewteABD
*/
