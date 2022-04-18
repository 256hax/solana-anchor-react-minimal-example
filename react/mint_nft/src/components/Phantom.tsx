// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare var window: Window

export function Phantom() {
  async function connectWallet() {
    try {
        const resp = await window.solana.connect();
        console.log("Phantom Connected! Public Key: ", resp.publicKey.toString());
    } catch (err) {
        console.log(err);
        // => { code: 4001, message: 'User rejected the request.' }
    }
  }

  async function disconnectWallet() {
    window.solana.disconnect();
    window.solana.on('disconnect', () => console.log("Disconnected!"));
  }

  return(
    <div>
      <button onClick={connectWallet}>Connect to Phantom</button>
      <button onClick={disconnectWallet}>Disconnect</button>
    </div>
  );
}
