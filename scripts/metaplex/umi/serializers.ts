// Docs: https://github.com/metaplex-foundation/umi/blob/main/docs/serializers.md
// 
// Work in progress, I'm trying to clear for behavior.

import { utf8, base58, base64 } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const umi = createUmi('https://api.devnet.solana.com');

// Default behaviour: utf8 encoding and u32 (litte-endian) size.
const serializedString = umi.serializer.string().serialize('Hi');
console.log('serializedString =>', serializedString);

// Custom encoding: base58.
const serializedBase58 = umi.serializer.string({ encoding: base58 }).serialize('Hi');
console.log('serializedBase58 =>', serializedBase58);

const serializedBase58Other = base58.serialize('Hi');
console.log('serializedBase58Other =>', serializedBase58Other);

const serializedU64 = umi.serializer.u64().serialize(123);
console.log('serializedU64 =>', serializedU64);

// Custom size: 5 bytes.
const serializedCustomSizeByBytes = umi.serializer.string({ size: 5 }).serialize('Hi');
console.log('serializedCustomSizeByBytes =>', serializedCustomSizeByBytes);

// Custom size: variable.
const serializedCustomSizeByString = umi.serializer.string({ size: 'variable' }).serialize('Hi');
console.log('serializedCustomSizeByBytes =>', serializedCustomSizeByBytes);

const serializedUtf8 = utf8.serialize('Hi');
console.log('serializedUtf8 =>', serializedUtf8);

const serializedBase64 = base64.serialize('Hi');
console.log('serializedBase64 =>', serializedBase64);

/*
% ts-node <THIS FILE>
serializedString => Uint8Array(6) [ 2, 0, 0, 0, 72, 105 ]
serializedBase58 => Uint8Array(6) [ 2, 0, 0, 0, 3, 201 ]
serializedBase58Other => Uint8Array(2) [ 3, 201 ]
serializedU64 => Uint8Array(8) [
  123, 0, 0, 0,
    0, 0, 0, 0
]
serializedCustomSizeByBytes => Uint8Array(5) [ 72, 105, 0, 0, 0 ]
serializedCustomSizeByBytes => Uint8Array(5) [ 72, 105, 0, 0, 0 ]
serializedUtf8 => Uint8Array(2) [ 72, 105 ]
serializedBase64 => Uint8Array(1) [ 30 ]
*/