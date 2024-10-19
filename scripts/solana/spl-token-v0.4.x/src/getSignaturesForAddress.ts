// Ref: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getSignaturesForAddress
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey
} from '@solana/web3.js';

export const main = async() => {
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const publicKeyParent = new PublicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');
  const publicKeyATA = new PublicKey('Ck9BfLuAxJQeFf73uuaoNMevdHjDjp7vKye4z5zG4bqr');
  const resultParent = await connection.getSignaturesForAddress(publicKeyParent);
  const resultATA = await connection.getSignaturesForAddress(publicKeyATA);

  // From: HXtB... and To: HXtB... equal to ATA: Ck9B...
  console.log('resultParent =>', resultParent);
  console.log('resultATA =>', resultATA);
};

main();

/*
% ts-node <THIS JS FILE>
resultParent => [
  {
    blockTime: 1669011871,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5ZHnDvyFNird1uHixkCyMmQxov1YqcNSq6QyeyW1wJWEotZ7fYipmfMTTeTH5fdeMcNuuL4yjjmPPy3gR6HM3iLf',
    slot: 176993944
  },
  {
    blockTime: 1669009878,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '2CrwtALsazZLq4xMjiUcd3B6oieXB2po1gb4Ktjt3dVWL98e6rVGgjBduSmqZTbDXH43ZYjyKGWbTK7XYKkdrdUK',
    slot: 176988928
  },
  {
    blockTime: 1669009605,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '4eGMCN94qtvXgVX5eD988QrwmMgyusFgJujXaZmFmHptWi5nSJkbpvTreGT8dUKWowK6nKVgBZJz7y3kUygpQBra',
    slot: 176988227
  },
  {
    blockTime: 1669008805,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: 'VkyLtqRd3jz3wL9Ds3JsHjwmXYp57fUxDsweha4qkpYSYZ2jj6kEviehV5NnjbsmHuRGPUzXH2KAZJXfJkTEmY5',
    slot: 176986200
  },
  {
    blockTime: 1668955976,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '24BijFLBt9L91y44z6bvMsWrGyYucfod87EiEZ2ajpPU9xQnQVQkQMheU7rz5tdXRK6unPAAothF5qRbrzmeZT94',
    slot: 176852957
  },
  ... 19 more items
]
resultATA => [
  {
    blockTime: 1669011871,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5ZHnDvyFNird1uHixkCyMmQxov1YqcNSq6QyeyW1wJWEotZ7fYipmfMTTeTH5fdeMcNuuL4yjjmPPy3gR6HM3iLf',
    slot: 176993944
  },
  {
    blockTime: 1668955976,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '24BijFLBt9L91y44z6bvMsWrGyYucfod87EiEZ2ajpPU9xQnQVQkQMheU7rz5tdXRK6unPAAothF5qRbrzmeZT94',
    slot: 176852957
  },
  {
    blockTime: 1668955753,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '3yhFNezzeNY5UwdFnkymBwDqdZZUukrJGMSLFkQEivnBLkrn8LL877KYAgVJiqJSgVpTpCvccnMivJF6V3uhsFjw',
    slot: 176852400
  }
]
*/
