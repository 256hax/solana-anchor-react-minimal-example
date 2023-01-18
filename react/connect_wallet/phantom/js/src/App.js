import './App.css';

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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>1. Connect to Wallet</button>
        <button onClick={disconnectWallet}>2. Disconnect</button>
      </header>
    </div>
  );
}

export default App;
