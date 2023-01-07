import * as anchor from "@coral-xyz/anchor";

import {
  Keypair,
  PublicKey,
  Connection,
  SystemProgram,
} from "@solana/web3.js";

export const main = async() => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const secretKey = Uint8Array.from([42,10,22,97,116,115,107,57,226,247,40,179,216,11,216,9,110,233,110,240,85,78,144,173,253,79,75,12,175,216,43,214,245,164,74,111,54,131,150,17,113,31,4,20,159,81,221,64,109,212,188,82,203,134,242,13,210,177,22,8,166,44,126,233]);
  const keypair = Keypair.fromSecretKey(secretKey);
  const wallet = new anchor.Wallet(keypair);

  const provider = new anchor.AnchorProvider(
    connection, wallet, { commitment: 'confirmed' },
  );
  anchor.setProvider(provider);

  console.log('provider.wallet.publicKey =>', provider.wallet.publicKey.toString());
  // @ts-ignore
  console.log('provider.wallet.payer =>', provider.wallet.payer);
};

main();

/*
% ts-node <THIS FILE>
provider.wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
provider.wallet.payer => Keypair {
  _keypair: {
    publicKey: Uint8Array(32) [
      245, 164,  74, 111,  54, 131, 150,  17,
      113,  31,   4,  20, 159,  81, 221,  64,
      109, 212, 188,  82, 203, 134, 242,  13,
      210, 177,  22,   8, 166,  44, 126, 233
    ],
    secretKey: Uint8Array(64) [
       42,  10,  22,  97, 116, 115, 107,  57, 226, 247,  40,
      179, 216,  11, 216,   9, 110, 233, 110, 240,  85,  78,
      144, 173, 253,  79,  75,  12, 175, 216,  43, 214, 245,
      164,  74, 111,  54, 131, 150,  17, 113,  31,   4,  20,
      159,  81, 221,  64, 109, 212, 188,  82, 203, 134, 242,
       13, 210, 177,  22,   8, 166,  44, 126, 233
    ]
  }
}
*/