// Ref: https://docs.solana.com/developing/clients/javascript-api#connecting-to-a-wallet
const {Keypair} = require("@solana/web3.js");

// There are two ways to obtain a Keypair:
//
// --- 1. Generate a new Keypair ---
// let keypair = Keypair.generate();

// or
// --- 2. Obtain a Keypair using the secret key ---
let secretKey = Uint8Array.from([
  202, 171, 192, 129, 150, 189, 204, 241, 142,  71, 205,
  2,  81,  97,   2, 176,  48,  81,  45,   1,  96, 138,
  220, 132, 231, 131, 120,  77,  66,  40,  97, 172,  91,
  245,  84, 221, 157, 190,   9, 145, 176, 130,  25,  43,
  72, 107, 190, 229,  75,  88, 191, 136,   7, 167, 109,
  91, 170, 164, 186,  15, 142,  36,  12,  23
]);

let keypair = Keypair.fromSecretKey(secretKey);

console.log('Keypair -> ', keypair);
console.log('Wallet Address -> ', keypair.publicKey.toString());
/*
% node keypair.js
Keypair ->  Keypair {
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
Wallet Address ->  7By5EKRWGRKD5eQSh582u3QPcyuYRi7Me5UHzJ4hvru4
*/
