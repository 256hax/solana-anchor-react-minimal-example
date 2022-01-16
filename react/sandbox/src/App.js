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

    let transaction = new web3.Transaction();
    // Ref: https://project-serum.github.io/anchor/ts/modules/web3.html#TransferParams
    const tx_instructions = web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: web3.LAMPORTS_PER_SOL * 0.1,
    });
    transaction.add(tx_instructions);
    console.log(transaction);

    try {
      const signature = await provider.send(
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
        <button onClick={connectWallet}>Connect to Wallet</button>
        <button onClick={airdrop}>Airdrop 1 SOL (lamports:1000000000)</button>
        <button onClick={balance}>Balance</button>
        <button onClick={transfer}>Send 0.1 SOL</button>
        <button onClick={disconnectWallet}>Disconnect</button>
      </header>
    </div>
  );
}

export default App;
