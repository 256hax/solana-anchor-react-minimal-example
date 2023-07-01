import * as bs58 from "bs58";
import {
  Keypair,
} from "@solana/web3.js";

// ------------------------------------
//  Uint8Array to Base58
// ------------------------------------
const secretKeyUint8Array: Uint8Array = new Uint8Array([42,10,22,97,116,115,107,57,226,247,40,179,216,11,216,9,110,233,110,240,85,78,144,173,253,79,75,12,175,216,43,214,245,164,74,111,54,131,150,17,113,31,4,20,159,81,221,64,109,212,188,82,203,134,242,13,210,177,22,8,166,44,126,233]);
const toBase58 = bs58.encode(secretKeyUint8Array);
console.log('toBase58 =>', toBase58);

// ------------------------------------
//  Base58 to Uint8Array
// ------------------------------------
const secretKeyBase58 = 'qkT6L2d7CY3TP1idkij8UNhzwcfQJfdjvU8NMu4FKHokkPrTeXfhooeeqUsQr5rL8rhZrcroMr4T2CFxanvezgQ';
// Read KeyPair from secret key.
const keypair = Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
console.log('toUint8Array =>', keypair.secretKey);

// PublicKey: HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg