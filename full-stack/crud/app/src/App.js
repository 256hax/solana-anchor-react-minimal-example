import './App.css';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider, web3, BN } from '@project-serum/anchor';
import { Buffer } from 'buffer';
import idl from './idl.json';

window.Buffer = Buffer; // for "Buffer is not defined"

const { SystemProgram, Keypair } = web3;
/* create an account  */
const crudAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  async function connectWallet() {
    try {
        const resp = await window.solana.connect();
        console.log("Connected! Public Key: ", resp.publicKey.toString());
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

  async function create() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const data = new BN(1234);

    try {
      // Call function of programs/initialize/src/lib.rs
      const tx = await program.rpc.create(data, {
        accounts: {
          crudAccount: crudAccount.publicKey,
          user: provider.wallet.publicKey.toString(),
          systemProgram: SystemProgram.programId,
        },
        signers: [crudAccount],
      });
      console.log("Sent! Signature: ", tx);
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  async function read() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    const account = await program.account.crudAccount.fetch(crudAccount.publicKey);
    console.log(account.data.toString());
  }

  async function update() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    const data = new BN(4321);

    try {
      // Call function of programs/initialize/src/lib.rs
      const tx = await program.rpc.update(data, {
        accounts: {
          crudAccount: crudAccount.publicKey,
        },
      });
      console.log("Sent! Signature: ", tx);
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  async function deleteDataMasking() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);

    try {
      // Call function of programs/initialize/src/lib.rs
      const tx = await program.rpc.delete({
        accounts: {
          crudAccount: crudAccount.publicKey,
        },
      });
      console.log("Sent! Signature: ", tx);
    } catch (err) {
      console.log("Transaction Error: ", err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>1. Connect to Wallet</button>
        <button onClick={create}>2. Create</button>
        <button onClick={read}>3. Read</button>
        <button onClick={update}>4. Update</button>
        <button onClick={deleteDataMasking}>5. Delete(Data Masking)</button>
        <button onClick={disconnectWallet}>6. Disconnect</button>
      </header>
    </div>
  );
}

export default App;
