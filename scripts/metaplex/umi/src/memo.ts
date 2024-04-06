//Docs: https://developers.metaplex.com/toolbox

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import { keypairIdentity, transactionBuilder } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { addMemo } from '@metaplex-foundation/mpl-toolbox';

const memo = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = 'https://api.devnet.solana.com';
  const umi = createUmi(endpoint);

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');
  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  // ----------------------------------------------------
  //  Transaction
  // ----------------------------------------------------
  const builder = transactionBuilder()
    // .add(...) // Any instruction(s) here.
    .add(addMemo(umi, { memo: 'Hello world!' })); // Add a memo to the transaction.

  const result = await builder.sendAndConfirm(umi);

  console.log('builder =>', builder);
  console.log('signature =>', bs58.encode(result.signature));
};

memo();

/*
ts-node src/memo.ts

builder => TransactionBuilder {
  items: [ { instruction: [Object], signers: [], bytesCreatedOnChain: 0 } ],
  options: {}
}
signature => 2D7kEPX1YJ28n2txsRpTPQ8y7EaFsSM3DHeQqqDvoSJ7HM2car8VmkPtey5tSDqBmJwZVL5kCKGqEKwCEW5EHWBc
*/