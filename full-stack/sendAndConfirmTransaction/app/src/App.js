import './App.css';
import { Connection } from '@solana/web3.js';
import { Provider, web3 } from '@project-serum/anchor';

const { Keypair } = web3;
const payer = Keypair.generate();
const toAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}

console.log("Payer PublicKey: ", payer.publicKey.toString());
console.log("To PublicKey: ", toAccount.publicKey.toString());

function App() {
  async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    const wallet = window.solana;

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function airdrop() {
    const provider = await getProvider();
    const connection = provider.connection;
    const wallet = payer.publicKey;

    const airdropSignature = await connection.requestAirdrop(
        wallet,
        web3.LAMPORTS_PER_SOL,
    );

    try {
      await connection.confirmTransaction(airdropSignature);
      console.log("Payer got an 1 SOL!");
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  async function balance() {
    const provider = await getProvider();
    const connection = provider.connection;
    const balance = await connection.getBalance(payer.publicKey);
    console.log("Payer Balance(lamports): ", balance);
  }

  async function transfer() {
    const provider = await getProvider();
    const connection = provider.connection;

    const transaction = new web3.Transaction();
    transaction.add(web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: web3.LAMPORTS_PER_SOL * 0.1,
    }));

    try {
      // Ref: https://project-serum.github.io/anchor/ts/modules/web3.html#sendAndConfirmTransaction
      const signature = await web3.sendAndConfirmTransaction(
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
