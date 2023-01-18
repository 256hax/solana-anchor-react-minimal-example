import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React, { FC, useCallback } from 'react';
import { sign } from 'tweetnacl';

export const SignMessageButton: FC = () => {
  const { publicKey, signMessage } = useWallet();

  const onClick = useCallback(async () => {
    // e.g. nonce
    const message = 'Hello, world!';

    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error('Wallet not connected!');
      // `signMessage` will be undefined if the wallet doesn't support it
      if (!signMessage) throw new Error('Wallet does not support message signing!');

      // Encode anything as bytes
      const messageByte = new TextEncoder().encode(message);
      // Sign the bytes using the wallet
      const signature = await signMessage(messageByte);
      // Verify that the bytes were signed using the private key that matches the known public key
      if (!sign.detached.verify(messageByte, signature, publicKey.toBytes())) throw new Error('Invalid signature!');

      console.log(`Message signature: ${bs58.encode(signature)}`);
    } catch (error: any) {
      console.log(`Signing failed: ${error?.message}`);
    }
  }, [publicKey, signMessage]);

  return signMessage ? (<button onClick={onClick} disabled={!publicKey}>Sign Message</button>) : null;
};