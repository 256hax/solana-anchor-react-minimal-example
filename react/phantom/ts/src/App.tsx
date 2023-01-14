import './App.css';
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { v4 as uuidv4 } from 'uuid';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
  phantom: any
}
declare var window: Window

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

  // Ref: https://docs.phantom.app/solana/integrating-phantom/extension-and-in-app-browser-web-apps/signing-a-message
  const signMessage = async () => {
    // -------------------------------------
    //  Get Nonce from Backend
    // -------------------------------------
    // Do not generate in frontend
    const nonce = uuidv4();

    // -------------------------------------
    //  Sign Message in Frontend
    // -------------------------------------
    const provider = window.phantom?.solana;

    const message = nonce;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");

    // Post signature to backend
    const postSignature = bs58.encode(signedMessage.signature);

    // -------------------------------------
    //  Verify Sign Message to Backend
    // -------------------------------------
    //  Do not verify in frontend
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message), // Message
      bs58.decode(postSignature), // Signature
      signedMessage.publicKey.toBuffer() // PublicKey
    );

    console.log('verified =>', verified); // true: verified, false: verify failed
  }

  const disconnectWallet = async () => {
    window.solana.disconnect();
    window.solana.on('disconnect', () => console.log("Disconnected!"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>Connect to Wallet</button>
        <button onClick={signMessage}>Sign Message</button>
        <button onClick={disconnectWallet}>Disconnect</button>
      </header>
    </div>
  );
}

export default App;