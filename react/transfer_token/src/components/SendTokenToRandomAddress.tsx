import React, { FC, useCallback, useState } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Keypair, Transaction, PublicKey } from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';

// --- Custom Transaction for Solana Wallet Adapter ---
// Use following instead of @solana/spl-token. Customize Signer instructions for Solana Wallet Adapter.
import { getOrCreateAssociatedTokenAccount } from '../modules/getOrCreateAssociatedTokenAccount';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
  phantom: any
}
declare var window: Window


export const SendTokenToRandomAddress: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  // Taker
  const takerPublicKey = Keypair.generate().publicKey;
  const [valueTakerPublicKey, setTakerPublicKey] = useState<string>(takerPublicKey.toString());
  // Token
  const [valueTokenAddress, setTokenAddress] = useState<string>('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
  const [valueAmount, setAmount] = useState<string>('1');

  // Ref: https://stackoverflow.com/questions/70224185/how-to-transfer-custom-spl-token-by-solana-web3-js-and-solana-sol-wallet-ad/
  const createAta = useCallback(async () => {
    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError();
      const takerPublicKey = new PublicKey(valueTakerPublicKey);
      const mint = new PublicKey(valueTokenAddress);

      // --- Get or Create ATA ---
      // Create ATA if it doesn't exist.
      // Note: It's different "getOrCreateAssociatedTokenAccount" of @solana/spl-token.
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

      console.log('payerTokenAddress =>', payerTokenAccount.address.toString());
      console.log('takerTokenAddress =>', takerTokenAccount.address.toString());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(`Transaction failed: ${error.message}`);
    }
  }, [publicKey, sendTransaction, connection]);


  const transferToken = useCallback(async () => {
    if (!publicKey || !signTransaction) throw new WalletNotConnectedError();
    const takerPublicKey = new PublicKey(valueTakerPublicKey);
    const mint = new PublicKey(valueTokenAddress);

    // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically.
    let account
    try {
      // --------------------------------------------------
      //  Get ATA
      // --------------------------------------------------
      // We can check value of ATA before create ATA if you need.
      const payerTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
      );

      // We can check value of ATA before create ATA if you need.
      const takerTokenAccount = await getAssociatedTokenAddress(
        mint,
        takerPublicKey,
      );
      
      // --------------------------------------------------
      //  Create Transfer Instruction
      // --------------------------------------------------
      // Ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createTransferInstruction
      const transaction = new Transaction().add(
        createTransferInstruction(
          payerTokenAccount, // source
          takerTokenAccount, // destination
          publicKey, // owner
          Number(valueAmount),  // amount
          [], // multiSigners
          TOKEN_PROGRAM_ID // programId
        )
      );

      // --------------------------------------------------
      //  Transaction
      // --------------------------------------------------
			const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      const signed = await signTransaction(transaction);
      const tx = await connection.sendRawTransaction(signed.serialize());

      console.log('tx =>', tx);
    } catch (error: any) {
      console.log(`Transaction failed: ${error.message}`);
    }
  }, [publicKey, sendTransaction, connection]);


  const createAtaAndTransfer = useCallback(async () => {
    if (!publicKey || !signTransaction) throw new WalletNotConnectedError();
    const takerPublicKey = new PublicKey(valueTakerPublicKey);
    const payerPublicKey = publicKey;
    const mint = new PublicKey(valueTokenAddress);

    try {
      // --------------------------------------------------
      //  Get ATA
      // --------------------------------------------------
      const payerTokenAccount = await getAssociatedTokenAddress(
        mint,
        payerPublicKey,
      );

      const takerTokenAccount = await getAssociatedTokenAddress(
        mint,
        takerPublicKey,
      );

      // --------------------------------------------------
      //  Get ATA Info
      // --------------------------------------------------
      // Return: Exist data: created ATA, Null: doesn't exist ATA (not created)
      const payerAccountInfo = await connection.getAccountInfo(payerTokenAccount);
      const takerAccountInfo = await connection.getAccountInfo(takerTokenAccount);

      // --------------------------------------------------
      //  Create ATA Instructions if doesn't exist
      // --------------------------------------------------
      let transaction = new Transaction();

      if(!payerAccountInfo || !payerAccountInfo.data) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payerPublicKey, // payer
            payerTokenAccount, // associatedToken
            payerPublicKey, // owner
            mint, // mint
          )
        );
      }

      if(!takerAccountInfo || !takerAccountInfo.data) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payerPublicKey, // payer
            takerTokenAccount, // associatedToken
            takerPublicKey, // owner
            mint, // mint
          )
        );
      }

      // --------------------------------------------------
      //  Create Trasfer Instruction
      // --------------------------------------------------
      transaction.add(
        createTransferInstruction(
          payerTokenAccount, // source
          takerTokenAccount, // destination
          payerPublicKey, // owner
          Number(valueAmount),  // amount
          [], // multiSigners
          TOKEN_PROGRAM_ID // programId
        )
      );

      // --------------------------------------------------
      //  Transaction
      // --------------------------------------------------
      const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      const signed = await signTransaction(transaction);
      const tx = await connection.sendRawTransaction(signed.serialize());

      console.log('tx =>', tx);
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
          2. Transfer Details
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
            Amount(Lamport):
          </span>
          <input
            value={valueAmount}
            onChange={event => setAmount(event.target.value)}
          />
        </div>
      </div>

      <div>
        <h2>
          3. Create ATA
        </h2>
        <div className='submit'>
          <p>
            You need to create Payer/Taker ATA(Associated Token Address) first.
          </p>
          <button onClick={createAta} disabled={!publicKey}>
            Execute
          </button>
        </div>
      </div>

      <div>
        <h2>
          4. Transfer Token
        </h2>
        <div className='submit'>
          <p>
            Transfer token from Payer ATA to Taker ATA.
          </p>
          <button onClick={transferToken} disabled={!publicKey}>
            Execute
          </button>
        </div>
      </div>

      <hr />

      <div>
        <h2>
          extra. Create ATA & Transfer
        </h2>
        <div className='submit'>
          <p>
          Create ATA and Transfer Token in One Transaction.
          </p>
          <button onClick={createAtaAndTransfer} disabled={!publicKey}>
            Execute
          </button>
        </div>
      </div>

    </div>
  );
};