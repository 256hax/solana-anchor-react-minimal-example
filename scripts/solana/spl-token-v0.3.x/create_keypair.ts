// Source: https://docs.solana.com/developing/clients/javascript-api#connecting-to-a-wallet
import {Keypair} from "@solana/web3.js";
import * as fs from 'fs';

export const main = async() => {
  // There are two ways to obtain a Keypair:
  //
  // --- 1. Generate a new Keypair ---
  // let keypair = Keypair.generate();

  // or
  // --- 2. Obtain a Keypair using the secret key ---
  const secretKey = Uint8Array.from([
    202, 171, 192, 129, 150, 189, 204, 241, 142,  71, 205,
    2,  81,  97,   2, 176,  48,  81,  45,   1,  96, 138,
    220, 132, 231, 131, 120,  77,  66,  40,  97, 172,  91,
    245,  84, 221, 157, 190,   9, 145, 176, 130,  25,  43,
    72, 107, 190, 229,  75,  88, 191, 136,   7, 167, 109,
    91, 170, 164, 186,  15, 142,  36,  12,  23
  ]);

  const keypair = Keypair.fromSecretKey(secretKey);

  console.log('--- From hard coding ---');
  console.log('Keypair => ', keypair);
  console.log('Wallet Address => ', keypair.publicKey.toString());


  const secretKeyFromFile = new Uint8Array(JSON.parse(fs.readFileSync('../key.json', 'utf8')));
  const keypairFromFile = Keypair.fromSecretKey(secretKey);

  console.log('--- From file ---');
  console.log('Keypair => ', secretKeyFromFile);
  console.log('Wallet Address => ', keypairFromFile.publicKey.toString());
};

main();

/*
% ts-node <THIS JS FILE>
--- From hard coding ---
Keypair =>  Keypair {
  _keypair: {
    publicKey: Uint8Array(32) [
       91, 245,  84, 221, 157, 190,   9, 145,
      176, 130,  25,  43,  72, 107, 190, 229,
       75,  88, 191, 136,   7, 167, 109,  91,
      170, 164, 186,  15, 142,  36,  12,  23
    ],
    secretKey: Uint8Array(64) [
      202, 171, 192, 129, 150, 189, 204, 241, 142,  71, 205,
        2,  81,  97,   2, 176,  48,  81,  45,   1,  96, 138,
      220, 132, 231, 131, 120,  77,  66,  40,  97, 172,  91,
      245,  84, 221, 157, 190,   9, 145, 176, 130,  25,  43,
       72, 107, 190, 229,  75,  88, 191, 136,   7, 167, 109,
       91, 170, 164, 186,  15, 142,  36,  12,  23
    ]
  }
}
Wallet Address =>  7By5EKRWGRKD5eQSh582u3QPcyuYRi7Me5UHzJ4hvru4
--- From file ---
Keypair =>  Uint8Array(64) [
   42,  10,  22,  97, 116, 115, 107,  57, 226, 247,  40,
  179, 216,  11, 216,   9, 110, 233, 110, 240,  85,  78,
  144, 173, 253,  79,  75,  12, 175, 216,  43, 214, 245,
  164,  74, 111,  54, 131, 150,  17, 113,  31,   4,  20,
  159,  81, 221,  64, 109, 212, 188,  82, 203, 134, 242,
   13, 210, 177,  22,   8, 166,  44, 126, 233
]
Wallet Address =>  7By5EKRWGRKD5eQSh582u3QPcyuYRi7Me5UHzJ4hvru4
*/
