import React, { useState } from 'react';
import Arweave from 'arweave';

// For "Property 'arweaveWallet' does not exist on type 'Window'." error.
interface Window {
  arweaveWallet: any
}
declare var window: Window

export function UploadMetadata() {
  const [transactionId, setTransactionId] = useState('not yet sent');
  const [blockId, setBlockId] = useState('not yet mined');

  // Metadata
  const [valueName, setName] = useState('');
  const [valueSymbol, setSymbol] = useState('');
  const [valueDescription, setDescription] = useState('');
  const [valueSellerFeeBasisPoints, setSellerFeeBasisPoints] = useState('');
  const [valueImage, setImage] = useState('');
  const [valueExternalUrl, setExternalUrl] = useState('');
  const [valueCollectionName, setCollectionName] = useState('');
  const [valueCollectionFamily, setCollectionFamily] = useState('');
  const [valueAttributes0TraitType, setAttributes0TraitType] = useState('');
  const [valueAttributes0Value, setAttributes0Value] = useState('');
  const [valuePropertiesFiles0Uri, setPropertiesFiles0Uri] = useState('');
  const [valuePropertiesFiles0Type, setPropertiesFiles0Type] = useState('');
  const [valuePropertiesFiles1Uri, setPropertiesFiles1Uri] = useState('');
  const [valuePropertiesFiles1type, setPropertiesFiles1type] = useState('');
  const [valuePropertiesFiles1cdn, setPropertiesFiles1cdn] = useState('');
  const [valuePropertiesFilesCategory, setPropertiesFilesCategory] = useState('');
  const [valuePropertiesCreatorsAddress, setPropertiesCreatorsAddress] = useState('');
  const [valuePropertiesCreatorsVerified, setPropertiesCreatorsVerified] = useState('');
  const [valuePropertiesCreatorsShare, setPropertiesCreatorsShare] = useState('');
  // End Metadata

  const arweave = Arweave.init({
      host: '127.0.0.1',
      port: 1984,
      protocol: 'http'
      // --- If you need testnet ---
      // host: 'testnet.redstone.tools',
      // port: 443,
      // protocol: 'https'
  });

  async function getBalance() {
    const address = await window.arweaveWallet.getActiveAddress();
    const balance = await arweave.wallets.getBalance(address);
    const ar = arweave.ar.winstonToAr(balance);

    console.log(ar, 'AR');
  }

  async function airdrop() {
    const address = await window.arweaveWallet.getActiveAddress();
    // 100 AR = 100000000000000 Winston
    const response = await arweave.api.get('mint/' + address + '/100000000000000');
    console.log(response);
  }

  async function sendTransaction() {
    // Token Metadata Standard: https://docs.metaplex.com/token-metadata/Versions/v1.0.0/nft-standard
    const inputMetadata = {
      name: valueName,
      symbol: valueSymbol,
      description: valueDescription,
      seller_fee_basis_points: valueSellerFeeBasisPoints,
      image: valueImage,
      external_url: valueExternalUrl,
      collection: {
        name: valueCollectionName,
        family: valueCollectionFamily,
      },
      attributes: {
        trait_type: valueAttributes0TraitType,
        value: valueAttributes0Value,
      },
      properties: {
        files: [
          {
            uri: valuePropertiesFiles0Uri,
            type: valuePropertiesFiles0Type,
          },
          {
            uri: valuePropertiesFiles1Uri,
            type: valuePropertiesFiles1type,
            cdn: valuePropertiesFiles1cdn,
          }
        ],
        category: valuePropertiesFilesCategory,
        creators: [
          {
            address: valuePropertiesCreatorsAddress,
            verified: valuePropertiesCreatorsVerified,
            share: valuePropertiesCreatorsShare,
          }
        ]
      }
    };

    const data = JSON.stringify(inputMetadata);

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
    const tx_api_get_base64  = await arweave.api.get('/tx/' + transactionId + '/data');
    console.log('Base64 Data =>', tx_api_get_base64.data);

    const tx_api_get_decoded = await arweave.api.get('/' + transactionId);
    console.log('Decoded Data =>', tx_api_get_decoded.data);
  }

  return (
    <div>
      <div>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={airdrop}>Airdrop(Mint Balance)</button>
      </div>
      <div>
        <input defaultValue="valueName" onChange={event => setName(event.target.value)} />
        <input defaultValue="valueSymbol" onChange={event => setSymbol(event.target.value)} />
        <input defaultValue="valueDescription" onChange={event => setDescription(event.target.value)} />
        <input defaultValue="valueSellerFeeBasisPoints" onChange={event => setSellerFeeBasisPoints(event.target.value)} />
        <input defaultValue="valueImage" onChange={event => setImage(event.target.value)} />
        <input defaultValue="valueExternalUrl" onChange={event => setExternalUrl(event.target.value)} />
        <input defaultValue="valueCollectionName" onChange={event => setCollectionName(event.target.value)} />
        <input defaultValue="valueCollectionFamily" onChange={event => setCollectionFamily(event.target.value)} />
        <input defaultValue="valueAttributes0TraitType" onChange={event => setAttributes0TraitType(event.target.value)} />
        <input defaultValue="valueAttributes0Value" onChange={event => setAttributes0Value(event.target.value)} />
        <input defaultValue="valuePropertiesFiles0Uri" onChange={event => setPropertiesFiles0Uri(event.target.value)} />
        <input defaultValue="valuePropertiesFiles0Type" onChange={event => setPropertiesFiles0Type(event.target.value)} />
        <input defaultValue="valuePropertiesFiles1Uri" onChange={event => setPropertiesFiles1Uri(event.target.value)} />
        <input defaultValue="valuePropertiesFiles1type" onChange={event => setPropertiesFiles1type(event.target.value)} />
        <input defaultValue="valuePropertiesFiles1cdn" onChange={event => setPropertiesFiles1cdn(event.target.value)} />
        <input defaultValue="valuePropertiesFilesCategory" onChange={event => setPropertiesFilesCategory(event.target.value)} />
        <input defaultValue="valuePropertiesCreatorsAddress" onChange={event => setPropertiesCreatorsAddress(event.target.value)} />
        <input defaultValue="valuePropertiesCreatorsVerified" onChange={event => setPropertiesCreatorsVerified(event.target.value)} />
        <input defaultValue="valuePropertiesCreatorsShare" onChange={event => setPropertiesCreatorsShare(event.target.value)} />
      </div>
      <div>
        <button onClick={sendTransaction}>Send Transaction</button>
        <button onClick={mineTransaction}>Mine Transaction</button>
        <button onClick={getTransaction}>Get Transaction</button>
        <button onClick={getTransactionData}>Get Transaction Data</button>
        <div>
          Sent Transaction:
          <div>Transaction ID: {transactionId}
            <a href={'http://127.0.0.1:1984/tx/' + transactionId} target="_blank">[tx]</a>
            <a href={'http://127.0.0.1:1984/' + transactionId} target="_blank">[data]</a>
          </div>
          <div>Block ID: {blockId}</div>
        </div>
      </div>
    </div>
  );
}
