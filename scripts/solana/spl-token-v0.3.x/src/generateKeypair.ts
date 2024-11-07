// Ref:
//  Tutorial: https://docs.solana.com/developing/clients/javascript-api#connecting-to-a-wallet
//  API: https://solana-labs.github.io/solana-web3.js/v1.x/classes/Keypair.html
import {Keypair} from '@solana/web3.js';
import * as fs from 'fs';

export const main = async() => {
  // --------------------------------------------
  //  Case1. Generate Random New Keypair
  // --------------------------------------------
  const keypair1 = Keypair.generate();

  // --------------------------------------------
  //  Case2-a. Generate Keypair from Secret Key
  // --------------------------------------------
  const secretKey = Uint8Array.from([
    42,10,22,97,116,115,107,57,226,247,40,179,216,11,216,9,110,233,110,240,85,78,144,173,253,79,75,12,175,216,43,214,245,164,74,111,54,131,150,17,113,31,4,20,159,81,221,64,109,212,188,82,203,134,242,13,210,177,22,8,166,44,126,233
  ]);
  // If you want to test, replace above key to your key(~/.config/solana/id.json).

  const keypair2a = Keypair.fromSecretKey(secretKey);

  // --------------------------------------------
  //  Case2-b. Generate Keypair from Key File
  // --------------------------------------------
  const secretKeyFromFile = new Uint8Array(JSON.parse(fs.readFileSync('../key.json', 'utf8')));
  const keypair2b = Keypair.fromSecretKey(secretKey);

  // --------------------------------------------
  //  Case3. Generate Keypair from Seed
  // --------------------------------------------
  // Generate a keypair from a 32 byte seed.
  const seed = 'hello world'.padEnd(32, '\0');
  const keypair3 = Keypair.fromSeed(new TextEncoder().encode(seed));

  console.log('keypair1 =>', keypair1.publicKey.toString());
  console.log('keypair2a =>', keypair2a.publicKey.toString());
  console.log('keypair2b =>', keypair2b.publicKey.toString());
  console.log('keypair3 =>', keypair3.publicKey.toString());
};

main();

/*
% ts-node <THIS JS FILE>
keypair1 => B9TbVhL4WmvLk8kt7GuxRKBC6BKbCHBNuwGrJ1oiojgK
keypair2a => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
keypair2b => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
keypair3 => 5c4zsmY5BgdwVpDkcwT1iqnjpViKSsWezXpuwH6f6TjP
*/
