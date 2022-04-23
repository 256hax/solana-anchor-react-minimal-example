// For "Property 'arweaveWallet' does not exist on type 'Window'." error.
interface Window {
  arweaveWallet: any
}
declare var window: Window

export const Arconnect = () => {
  async function connectWallet() {
    if (window.arweaveWallet) {
      // Permissions: https://github.com/th8ta/ArConnect#permissions
      const response = await window.arweaveWallet.connect([
          'ACCESS_ADDRESS',
          'SIGN_TRANSACTION'
      ]);
      const address = await window.arweaveWallet.getActiveAddress();
      console.log('ArConnect Connected! Public Key:', address);
    } else {
      console.log("Couldn't find ArConnect on your browser.");
    }
  }

  async function disconnetWallet() {
    await window.arweaveWallet.disconnect();
    console.log('Disconnected!');
  }

  return(
    <div>
      <button onClick={connectWallet}>Connect to ArConnect</button>
      <button onClick={disconnetWallet}>Disconnect</button>
    </div>
  );
}
