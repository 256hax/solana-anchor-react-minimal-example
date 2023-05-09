import * as bs58 from "bs58";
import {
  Keypair,
} from "@solana/web3.js";

// ------------------------------------
//  Uint8Array to Base58
// ------------------------------------
const secretKeyUint8Array: Uint8Array = new Uint8Array([
  144, 238, 56, 119, 33, 196, 70, 120, 42, 135, 214,
  122, 86, 168, 224, 206, 106, 31, 92, 161, 155, 164,
  182, 96, 46, 12, 116, 31, 29, 26, 103, 114, 112,
  163, 217, 203, 8, 61, 129, 137, 116, 163, 237, 226,
  118, 79, 92, 255, 12, 125, 182, 109, 174, 41, 131,
  18, 55, 61, 238, 68, 33, 65, 215, 45
]);
const toBase58 = bs58.encode(secretKeyUint8Array);
console.log('toBase58 =>', toBase58);

// ------------------------------------
//  Base58 to Uint8Array
// ------------------------------------
const secretKeyBase58 = '3u4caiG9kSfRSySL9a17tJBUPHdAMkapQrKQeDmHZ9oQeh6LgSKyZMgoicpp9eqZ1Z41Gzom6iputb8b2i9DJweC';
// Read KeyPair from secret key.
const keypair = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
console.log('toUint8Array =>', keypair.secretKey);