import './App.css';
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

const payer = Keypair.generate();
const toAccount = Keypair.generate();

// Ref: https://docs.phantom.app/integrating/detecting-the-provider
const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

console.log("Payer PublicKey: ", payer.publicKey.toString());
console.log("To PublicKey: ", toAccount.publicKey.toString());

function App() {
  const provider = getProvider();
  const connection = new Connection('http://127.0.0.1:8899');

  async function airdrop() {
    const wallet = payer.publicKey;

    const airdropSignature = await connection.requestAirdrop(
        wallet,
        LAMPORTS_PER_SOL,
    );

    try {
      await connection.confirmTransaction(airdropSignature);
      console.log("Payer got an 1 SOL!");
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  async function balance() {
    const balance = await connection.getBalance(payer.publicKey);
    console.log("Payer Balance(lamports): ", balance);
  }

  async function transfer() {
    const transaction = new Transaction();
    transaction.add(SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: LAMPORTS_PER_SOL * 0.1,
    }));

    try {
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer], // signers
      );
      console.log('Sent! Signature: ', signature);
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={airdrop}>1. Airdrop 1 SOL (lamports:1000000000)</button>
        <button onClick={balance}>2. Balance</button>
        <button onClick={transfer}>3. Send 0.1 SOL</button>
      </header>
    </div>
  );
}

export default App;
