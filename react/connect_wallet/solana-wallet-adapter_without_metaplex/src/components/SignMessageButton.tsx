import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BraveWalletAdapter, MathWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TokenPocketWalletAdapter, TrustWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
	WalletModalProvider,
	WalletDisconnectButton,
	WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

// Sign Message
import bs58 from 'bs58';
import { sign } from 'tweetnacl';


export const SignMessageButton = () => {
	const { publicKey, signMessage } = useWallet();

	// Ref: https://github.com/solana-labs/wallet-adapter/blob/master/FAQ.md#how-can-i-sign-and-verify-messages
	const runSignMessage = async () => {
		try {
			// `publicKey` will be null if the wallet isn't connected
			if (!publicKey) throw new Error('Wallet not connected!');
			// `signMessage` will be undefined if the wallet doesn't support it
			if (!signMessage) throw new Error('Wallet does not support message signing!');

			// Encode anything as bytes
			const message = new TextEncoder().encode('Hello, world!');
			// Sign the bytes using the wallet
			const signature = await signMessage(message);
			// Verify that the bytes were signed using the private key that matches the known public key
			if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');

			alert(`Message signature: ${bs58.encode(signature)}`);
		} catch (error: any) {
			alert(`Signing failed: ${error?.message}`);
		}
	};

	return (
		<>
			<button onClick={runSignMessage}>Sign Message</button>
		</>
	);
};