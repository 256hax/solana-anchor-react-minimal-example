// Ref: https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-sign-and-verify-messages-with-wallets
import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';
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
  const messageString = uuidv4();

  // -----------------------------------------------
  //  Sign Message
  // -----------------------------------------------
  // Normally, sign message using wallet app(e.g. Phantom) in frontend.
  const messageBytes = decodeUTF8(messageString);
  const signedMessageSignature = nacl.sign.detached(messageBytes, keypair.secretKey);
  
  const postSignature = base58.encode(signedMessageSignature);

  // -----------------------------------------------
  //  Verify Signature
  // -----------------------------------------------
  // Normally, verify signature in backend server.
  const verified = nacl.sign.detached.verify(
    messageBytes, // Message
    base58.decode(postSignature), // Signature
    keypair.publicKey.toBytes() // PublicKey
  );

  console.log('keypair.publicKey =>', keypair.publicKey.toBase58());
  console.log('messageString =>', messageString);
  console.log('messageBytes =>', messageBytes);
  console.log('messageEncode =>', encodeUTF8(messageBytes));
  console.log('signedMessageSignature =>', signedMessageSignature);
  console.log('postSignature =>', postSignature);
  console.log('verified =>', verified);
};

main();

/*
% ts-node <THIS FILE>
keypair.publicKey => 24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p
messageString => bcb1e7f1-e9d0-438b-9612-4a0460526a98
messageBytes => Uint8Array(36) [
   98, 99,  98, 49, 101, 55, 102, 49, 45,
  101, 57, 100, 48,  45, 52,  51, 56, 98,
   45, 57,  54, 49,  50, 45,  52, 97, 48,
   52, 54,  48, 53,  50, 54,  97, 57, 56
]
messageEncode => bcb1e7f1-e9d0-438b-9612-4a0460526a98
signedMessageSignature => Uint8Array(64) [
  198,  93, 152, 210, 246, 174, 244,  55, 162,  40, 101,
   23, 123,  36, 253,  49,  54, 220, 241, 232,  11, 110,
  237,  40,  12,  87,  49, 216, 160, 138,  63,  24, 216,
    4, 141,   0,   1, 142, 255, 233,  71,  79, 159, 239,
  178,   6,  67,  96, 158, 194, 102, 163,  68,  82,  92,
   16, 166, 100,   6, 196,  18, 187,  25,  12
]
postSignature => 4y2WALCJTLmqmpEppRJ8KSUCERPNQ7P8PBWUXhevBizsWQRHCoMuMyGtaoQubSwoRhVZmVaF6CQkLum9tnkbMmP1
verified => true
*/