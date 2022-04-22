import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare let window: Window;

function App() {
  const connectWallet = async () => {
    try {
        const resp = await window.solana.connect();
        console.log("Conneted! Public Key: ", resp.publicKey.toString());
    } catch (err) {
        console.log(err);
        // => { code: 4001, message: 'User rejected the request.' }
    }
  };

  const disconnectWallet = async () => {
    window.solana.disconnect();
    window.solana.on('disconnect', () => console.log("Disconnected!"));
  };

  const sendTransaction = async () => {
    // const connection = new Connection('http://localhost:8899', 'processed');
    const connection = new Connection(
      'http://localhost:8899',
      {
        commitment: 'processed',
        confirmTransactionInitialTimeout: 120 // sec
      }
    );

    const wallet = window.solana;
    const toAccount = Keypair.generate();

    let transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer(
        {
          fromPubkey: wallet.publicKey,
          toPubkey: toAccount.publicKey,
          lamports: LAMPORTS_PER_SOL * 0.1,
        }
      )
    );

    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;


    // TODO: Fix following error when sendTransaction.
    // Uncaught (in promise) Error: failed to get recent blockhash: TypeError: Network request failed
    const { signature } = await wallet.signAndSendTransaction(transaction);
    const tx = await connection.confirmTransaction(signature);
    console.log(tx);


  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>Connect to Wallet</button>
        <button onClick={disconnectWallet}>Disconnect</button>
        <button onClick={sendTransaction}>Send Transaction (TODO: fix error)</button>
      </header>
    </div>
  );
}

export default App;
