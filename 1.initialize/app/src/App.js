import './App.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import idl from './idl.json';

const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);


function App() {
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

  async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, opts.preflightCommitment);
    const wallet = window.solana;

    const provider = new Provider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  async function sendTransaction() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    try {
      // Call function of programs/initialize/src/lib.rs
      const tx = await program.rpc.initialize();
      console.log("Sent! Signature: ", tx);
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>1. Connect to Wallet</button>
        <button onClick={sendTransaction}>2. Send</button>
        <button onClick={disconnectWallet}>3. Disconnect</button>
      </header>
    </div>
  );
}

export default App;
