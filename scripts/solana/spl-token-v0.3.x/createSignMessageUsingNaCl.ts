// Ref: https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-sign-and-verify-messages-with-wallets
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8 } from 'tweetnacl-util';
import { v4 as uuidv4 } from 'uuid';

export const main = async () => {
  // [Hint]
  // Use signMessage method by Phantom when you implement to frontend.
  // Look at following signMessage function:
  // https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/react/phantom/ts/src/App.tsx

  const keypair = Keypair.fromSecretKey(
    Uint8Array.from([
      174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
      222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
      15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
      121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
    ])
  );

  // -----------------------------------------------
  //  Message
  // -----------------------------------------------
  // Normally, generate message(e.g. nonce) from backend server.
  const nonce = uuidv4();
  const messageString = nonce;

  // -----------------------------------------------
  //  Sign Message
  // -----------------------------------------------
  // Normally, sign message using wallet app(e.g. Phantom) in frontend.
  const messageBytes = decodeUTF8(messageString);
  const signedMessageSignature = nacl.sign.detached(messageBytes, keypair.secretKey);
  
  const postSignature = bs58.encode(signedMessageSignature);

  // -----------------------------------------------
  //  Verify Signature
  // -----------------------------------------------
  // Normally, verify signature in backend server.
  const verified = nacl.sign.detached.verify(
    decodeUTF8(messageString), // Message
    bs58.decode(postSignature), // Signature
    keypair.publicKey.toBytes() // PublicKey
  );

  console.log('keypair.publicKey =>', keypair.publicKey.toBase58());
  console.log('messageString =>', messageString);
  console.log('messageBytes =>', messageBytes);
  console.log('messageEncode =>', encodeUTF8(messageBytes));
  console.log('signedMessageSignature =>', signedMessageSignature);
  console.log('postSignature =>', postSignature);
  console.log('decodeUTF8(nonce) =>', decodeUTF8(nonce));
  console.log('verified =>', verified);
};

main();

/*
% ts-node <THIS FILE>
keypair.publicKey => 24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p
messageString => 6c88b06d-7b64-41fd-b767-1e023e56f663
messageBytes => Uint8Array(36) [
  54, 99,  56, 56, 98,  48, 54, 100,  45,
  55, 98,  54, 52, 45,  52, 49, 102, 100,
  45, 98,  55, 54, 55,  45, 49, 101,  48,
  50, 51, 101, 53, 54, 102, 54,  54,  51
]
messageEncode => 6c88b06d-7b64-41fd-b767-1e023e56f663
signedMessageSignature => Uint8Array(64) [
   80, 113, 210,  75, 192,   8, 138, 220, 44, 124,  79,
   96,  61, 180,  36,  61, 115,  34,  23,  9, 241, 163,
  205,  96, 160, 222, 225,  18, 188, 232, 20, 211, 204,
  167, 167, 171,  16, 196, 202, 232, 199, 50, 164, 248,
  153, 116,  33, 214,  96,  14, 110, 123,  8,  52,  91,
   40, 123, 235, 123, 119, 177, 187,  37, 10
]
postSignature => 2cHUWcBxpRy33sofL1pXhtfr5NYw2qxwARD447Qqn2BwePdVHcEN5xbY4RNTNMX5W97bsJ5TBpvGqk9ZkkRyrB6R
decodeUTF8(nonce) => Uint8Array(36) [
  54, 99,  56, 56, 98,  48, 54, 100,  45,
  55, 98,  54, 52, 45,  52, 49, 102, 100,
  45, 98,  55, 54, 55,  45, 49, 101,  48,
  50, 51, 101, 53, 54, 102, 54,  54,  51
]
verified => true
*/