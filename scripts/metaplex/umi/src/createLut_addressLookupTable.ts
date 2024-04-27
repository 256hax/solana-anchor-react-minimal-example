// Docs:
//   https://developers.metaplex.com/toolbox#spl-address-lookup-table
//   https://github.com/metaplex-foundation/umi/blob/main/docs/transactions.md#using-address-lookup-tables

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import { keypairIdentity, transactionBuilder } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createLut, addMemo } from '@metaplex-foundation/mpl-toolbox';

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
  //  Create Address Lookup Table
  // ----------------------------------------------------
  const authority = umi.payer;
  const addressA = umi.eddsa.generateKeypair().publicKey;
  const addressB = umi.eddsa.generateKeypair().publicKey;

  const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' });
  const [lutBuilder, lut] = await createLut(umi, {
    authority,
    recentSlot,
    addresses: [addressA, addressB],
  });
  await lutBuilder.sendAndConfirm(umi);

  lutBuilder.setAddressLookupTables([lut]);

  // ----------------------------------------------------
  //  Add Instructions
  // ----------------------------------------------------
  const builder = transactionBuilder().add(
    addMemo(umi, { memo: 'Hello world!' })
  );

  lutBuilder.add(addMemo(umi, { memo: 'Hello world!' }));

  const result = await lutBuilder.sendAndConfirm(umi);

  console.log('addressA =>', addressA.toString());
  console.log('addressB =>', addressB.toString());
  console.log('lut =>', lut);
  console.log('lutBuilder => %o', builder);
  console.log('signature =>', bs58.encode(result.signature));
};

main();

/*
ts-node src/createLut_addressLookupTable.ts
(node:4298) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Server responded with 429 Too Many Requests.  Retrying after 500ms delay...
Server responded with 429 Too Many Requests.  Retrying after 1000ms delay...
Server responded with 429 Too Many Requests.  Retrying after 2000ms delay...
Server responded with 429 Too Many Requests.  Retrying after 4000ms delay...
Server responded with 429 Too Many Requests.  Retrying after 500ms delay...
addressA => B92Z3mx8q1KKnJxE9aZmdCYYLrwkAz8Aj9B7Ws5Q6wwk
addressB => 99QfPYYCDZGVNSiAJpwA21HFja8c5JrWjKQMJoSdS4Eb
lut => {
  publicKey: 'J133NRdP1P3VLgpYCYcNsS8VTnw1fW7p48626M6rpHyy',
  addresses: [
    'B92Z3mx8q1KKnJxE9aZmdCYYLrwkAz8Aj9B7Ws5Q6wwk',
    '99QfPYYCDZGVNSiAJpwA21HFja8c5JrWjKQMJoSdS4Eb'
  ]
}
lutBuilder => TransactionBuilder {
  items: [
    {
      instruction: {
        keys: [ [length]: 0 ],
        programId: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
        data: Uint8Array(16) [
          12,
          0,
          0,
          0,
          72,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33,
          [BYTES_PER_ELEMENT]: 1,
          [length]: 16,
          [byteLength]: 16,
          [byteOffset]: 0,
          [buffer]: ArrayBuffer { byteLength: 16 }
        ]
      },
      signers: [ [length]: 0 ],
      bytesCreatedOnChain: 0
    },
    [length]: 1
  ],
  options: {}
}
signature => 2CU5oSt9y8WTa2nMgqbyfGDiWEsMm8gf3Uukd6Yf31JiNfM39oPS8jU18ygmByL4MCYDcHney17sdBNHb18qQWge
*/
