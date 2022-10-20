import React, { FC, useCallback, useState } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// --- Custom Transaction for Solana Wallet Adapter ---
// Use following instead of @solana/spl-token
import { getOrCreateAssociatedTokenAccount } from '../modules/getOrCreateAssociatedTokenAccount';
import { createTransferInstruction } from '../modules/createTransferInstructions';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
  phantom: any
}
declare var window: Window

export const SendTokenToRandomAddress: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const takerPublicKey = Keypair.generate().publicKey;

  const [valueTakerPublicKey, setTakerPublicKey] = useState<string>(takerPublicKey.toString());
  const [valueTokenAddress, setTokenAddress] = useState<string>('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
  const [valueAmount, setAmount] = useState<string>('1');

  // Ref: https://stackoverflow.com/questions/70224185/how-to-transfer-custom-spl-token-by-solana-web3-js-and-solana-sol-wallet-ad/
  const transferToken = useCallback(async () => {
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError()
      const takerPublicKey = new PublicKey(valueTakerPublicKey);

      const mint = new PublicKey(valueTokenAddress);

      const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        publicKey, // payer publickey
        mint, // mint
        publicKey, // owner
        signTransaction, // useWallet signTransaction
      );

      const takerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, // connection
        publicKey, // payer publickey
        mint, // mint
        takerPublicKey, // owner
        signTransaction // useWallet signTransaction
      );

      const transaction = new Transaction().add(
        createTransferInstruction(
          payerTokenAccount.address, // source
          takerTokenAccount.address, // destination
          publicKey, // owner
          Number(valueAmount),  // amount
          [], // multiSigners
          TOKEN_PROGRAM_ID // programId
        )
      );

			const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      const signed = await signTransaction(transaction);

      const tx = await connection.sendRawTransaction(signed.serialize());

      console.log('payerTokenAddress => ', payerTokenAccount.address.toString());
      console.log('takerTokenAddress => ', takerTokenAccount.address.toString());
      console.log('tx => ', tx);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(`Transaction failed: ${error.message}`);
    }
  }, [publicKey, sendTransaction, connection]);

  return (
    <div className="main">

      <div>
        <h2>
          1. Mint Token
        </h2>
        <div>
          <p>
            Visit <a href="https://usdcfaucet.com/" target="_blank">USDC Faucet</a> then, select SOL and input your Wallet Address, you'll get 1 USDC Token for Devnet.
          </p>
          <p>
            USDC Token Address: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
          </p>
        </div>
      </div>

      <div>
        <h2>
          2. Send Token
        </h2>
        <div>
          <span className='input'>
            Taker Random Address (To Address):
          </span>
          <input
            value={valueTakerPublicKey}
            onChange={event => setTakerPublicKey(event.target.value)}
          />
        </div>
        <div>
          <span className='input'>
            Token Address (Mint Address):
          </span>
          <input
            value={valueTokenAddress}
            onChange={event => setTokenAddress(event.target.value)}
          />
        </div>
        <div>
          <span className='input'>
            Amount:
          </span>
          <input
            value={valueAmount}
            onChange={event => setAmount(event.target.value)}
          />
        </div>
        <div className='submit'>
          <button onClick={transferToken} disabled={!publicKey}>
            Send
          </button>
        </div>
      </div>
      
    </div>
  );
};