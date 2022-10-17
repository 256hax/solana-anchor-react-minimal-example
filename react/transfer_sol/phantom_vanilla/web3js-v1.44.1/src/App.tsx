import './App.css';
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Buffer } from 'buffer';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare var window: Window

// For "Buffer is not defined" error.
// @ts-ignore
window.Buffer = Buffer;

const toAccount = Keypair.generate();

// Ref: https://docs.phantom.app/integrating/detecting-the-provider
const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  // window.open("https://phantom.app/", "_blank");
};

function App() {
  const provider = getProvider();
  const connection = new Connection('http://127.0.0.1:8899');

  async function connectWallet() {
    try {
        const resp = await window.solana.connect();
        console.log("Conneted! Public Key: ", resp.publicKey.toString());
    } catch (err) {
        console.log(err);
        // => { code: 4001, message: 'User rejected the request.' }
    }
  }

  async function disconnectWallet() {
    window.solana.disconnect();
    window.solana.on('disconnect', () => console.log("Disconnected!"));
  }

  async function airdrop() {
    const wallet = window.solana.publicKey;

    const airdropSignature = await connection.requestAirdrop(
        wallet,
        LAMPORTS_PER_SOL,
    );

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    console.log('Airdropped! Check your balance after 1 minute.');
    
  }

  async function balance() {
    const balance = await connection.getBalance(window.solana.publicKey);
    console.log("Payer Balance(lamports): ", balance);
  }

  /*
    [Transaction Step]
    1. Transaction Config
    2. Transaction Sign
    3. Send Transaction
    4. Confirm Transaction
  */
  async function transfer() {
    const provider = await getProvider();

    // 1. Transaction Config
    const transaction = new Transaction();
    transaction.add(SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: LAMPORTS_PER_SOL * 0.1,
    }));
    transaction.feePayer = window.solana.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    try {
      // 2. Transaction Sign
      const signed = await provider.signTransaction(transaction);
      console.log("Signed!: ", signed);

      // 3. Send Transaction
      const signature = await connection.sendRawTransaction(signed.serialize());
      console.log("Signature: ", signature);

      // 4. Confirm Transaction
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>1. Connect to Wallet</button>
        <button onClick={airdrop}>2. Airdrop 1 SOL (lamports:1000000000)</button>
        <button onClick={balance}>3. Balance</button>
        <button onClick={transfer}>4. Send 0.1 SOL</button>
        <button onClick={disconnectWallet}>5. Disconnect</button>
      </header>
    </div>
  );
}

export default App;
