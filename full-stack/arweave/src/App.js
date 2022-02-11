import './App.css';
import React, { useState } from 'react';
import Arweave from 'arweave';

function App() {
  // Get Transaction ID when sending.
  const [transactionId, setTransactionId] = useState('not yet sent');
  // Get sent Transaction's Block ID when mining.
  const [blockId, setBlockId] = useState('not yet mined');

  const arweave = Arweave.init({
      host: '127.0.0.1',
      port: 1984,
      protocol: 'http'
  });

  async function connectWallet() {
    if (window.arweaveWallet) {
      // Permissions: https://github.com/th8ta/ArConnect#permissions
      const response = await window.arweaveWallet.connect([
          'ACCESS_ADDRESS',
          'SIGN_TRANSACTION'
      ]);
      console.log('Connected!');
    } else {
      console.log("Couldn't find ArConnect on your browser.");
    }
  }

  async function disconnetWallet() {
    await window.arweaveWallet.disconnect();
    console.log('Disconnected!');
  }

  async function getAddress() {
    const address = await window.arweaveWallet.getActiveAddress();
    console.log(address);

    // or
    // const address = await arweave.wallets.jwkToAddress();
    // console.log(address);
  }

  async function getBalance() {
    const address = await window.arweaveWallet.getActiveAddress();
    const balance = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(balance);

    console.log(ar, 'AR');
  }

  async function airdrop() {
    const address = await window.arweaveWallet.getActiveAddress();
    const response = await arweave.api.get('mint/' + address + '/100000000000000');
    console.log(response);
  }

  async function sendTransaction() {
    const data = '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>';

    const transaction = await arweave.createTransaction({ data: data });
    await arweave.transactions.sign(transaction);
    setTransactionId(transaction.id);
    console.log('Transaction =>', transaction);

    const uploader = await arweave.transactions.getUploader(transaction);
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
  }

  async function mineTransaction() {
    const response = await arweave.api.get('mine/');
    console.log(response);

    const transaction = await arweave.transactions.get(transactionId);
    setBlockId(transaction.block);
  }

  async function getTransaction() {
    const transaction = await arweave.transactions.get(transactionId);
    console.log(transaction);
  }

  async function getTransactionData() {
    const tx_data = await arweave.transactions.getData(transactionId, {decode: true, string: true});
    console.log(tx_data);

    const tx_tags = await arweave.transactions.get(transactionId);
    tx_tags.get('tags').forEach(tag => {
      let key = tag.get('name', {decode: true, string: true});
      let value = tag.get('value', {decode: true, string: true});
      console.log(`${key} : ${value}`);
    });
  }


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button onClick={connectWallet}>Connect Wallet(ArConnect)</button>
          <button onClick={disconnetWallet}>Disconnect Wallet</button>
        </div>
        <div>
          <button onClick={getAddress}>Get Address</button>
          <button onClick={getBalance}>Get Balance</button>
          <button onClick={airdrop}>Airdrop(Mint Balance)</button>
        </div>
        <div>
          <button onClick={sendTransaction}>Send Transaction</button>
          <button onClick={mineTransaction}>Mine Transaction</button>
          <button onClick={getTransaction}>Get Transaction</button>
          <button onClick={getTransactionData}>Get Transaction Data</button>
          <div>
            Sent Transaction =>
            <div>Transaction ID: {transactionId}
              <a href={'http://127.0.0.1:1984/tx/' + transactionId} target="_blank">[tx]</a>
              <a href={'http://127.0.0.1:1984/' + transactionId} target="_blank">[data]</a>
            </div>
            <div>Block ID: {blockId}</div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
