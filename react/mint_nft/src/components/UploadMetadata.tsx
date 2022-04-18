import React, { useState, useContext } from 'react';
import Arweave from 'arweave';
import { arTransactionIdContext } from '../providers/ArTransactionId';

// For "Property 'arweaveWallet' does not exist on type 'Window'." error.
interface Window {
  arweaveWallet: any
}
declare var window: Window

export function UploadMetadata() {
  const { valArTransactionId, setNewArTransactionId } = useContext(arTransactionIdContext);

  const [blockId, setBlockId] = useState('not yet mined');

  // Metadata - summary
  const [valueName, setName] = useState('');
  const [valueSymbol, setSymbol] = useState('');
  const [valueDescription, setDescription] = useState('');
  const [valueSellerFeeBasisPoints, setSellerFeeBasisPoints] = useState('');
  const [valueImage, setImage] = useState('');
  const [valueExternalUrl, setExternalUrl] = useState('');
  // Metadata - collection
  const [valueCollectionName, setCollectionName] = useState('');
  const [valueCollectionFamily, setCollectionFamily] = useState('');
  // Metadata - atrributes
  const [valueAttributes0TraitType, setAttributes0TraitType] = useState('');
  const [valueAttributes0Value, setAttributes0Value] = useState('');
  const [valuePropertiesFiles0Uri, setPropertiesFiles0Uri] = useState('');
  const [valuePropertiesFiles0Type, setPropertiesFiles0Type] = useState('');
  const [valuePropertiesFiles1Uri, setPropertiesFiles1Uri] = useState('');
  const [valuePropertiesFiles1type, setPropertiesFiles1type] = useState('');
  const [valuePropertiesFiles1cdn, setPropertiesFiles1cdn] = useState('');
  const [valuePropertiesFilesCategory, setPropertiesFilesCategory] = useState('');
  const [valuePropertiesCreatorsAddress, setPropertiesCreatorsAddress] = useState('');
  const [valuePropertiesCreatorsVerified, setPropertiesCreatorsVerified] = useState<boolean>(true);
  const [valuePropertiesCreatorsShare, setPropertiesCreatorsShare] = useState('');

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
    setNewArTransactionId(transaction.id);
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

    const transaction = await arweave.transactions.get(valArTransactionId);
    setBlockId(transaction.block);
  }

  async function getTransaction() {
    const transaction = await arweave.transactions.get(valArTransactionId);
    console.log(transaction);
  }

  async function getTransactionData() {
    const tx_api_get_base64 = await arweave.api.get('/tx/' + valArTransactionId + '/data');
    console.log('Base64 Data =>', tx_api_get_base64.data);

    const tx_api_get_decoded = await arweave.api.get('/' + valArTransactionId);
    console.log('Decoded Data =>', tx_api_get_decoded.data);
  }

  return (
    <div>
      <div>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={airdrop}>Airdrop(Mint Balance)</button>
      </div>

      <div>
        <fieldset>
          <p>
            <label>Name:
              <input type="text" defaultValue="SMB #1355" onChange={event => setName(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Symbol:
              <input type="text" defaultValue="SMB" onChange={event => setSymbol(event.target.value)} />
            </label>
          </p>
          <p>
            <label>description:
              <textarea defaultValue="SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity." onChange={event => setDescription(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Seller Fee Basis Points:
              <input type="text" defaultValue="500" onChange={event => setSellerFeeBasisPoints(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Image:
              <input type="text" defaultValue="https://arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4" onChange={event => setImage(event.target.value)} />
            </label>
          </p>
          <p>
            <label>External URL:
              <input type="text" defaultValue="https://solanamonkey.business/" onChange={event => setExternalUrl(event.target.value)} />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label>Collection Name:
              <input type="text" defaultValue="SMB Gen2" onChange={event => setCollectionName(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Collection Family:
              <input type="text" defaultValue="SMB" onChange={event => setCollectionFamily(event.target.value)} />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label>Attributes Trait Type:
              <input type="text" defaultValue="Attributes Count" onChange={event => setAttributes0TraitType(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Attributes Trait Value:
              <input type="text" defaultValue="2" onChange={event => setAttributes0Value(event.target.value)} />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label>Properties Files URI:
              <input type="text" defaultValue="https://arweave.net/wGChHSDTXTP9oAtTaYh9s8j1MRE0IPmYtH5greqWwZ4" onChange={event => setPropertiesFiles0Uri(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Properties Files Type:
              <input type="text" defaultValue="image/png" onChange={event => setPropertiesFiles0Type(event.target.value)} />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label>Properties Files URI:
              <input type="text" defaultValue="https://cdn.solanamonkey.business/gen2/1355.png" onChange={event => setPropertiesFiles1Uri(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Properties Files Type:
              <input type="text" defaultValue="image/png" onChange={event => setPropertiesFiles1type(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Properties Files CDN:
              <input type="text" defaultValue="true" onChange={event => setPropertiesFiles1cdn(event.target.value)} />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label>Properties Files Category:
              <input type="text" defaultValue="image" onChange={event => setPropertiesFilesCategory(event.target.value)} />
            </label>
          </p>
        </fieldset>
        <fieldset>
          <p>
            <label>Properties Creators Address:
              <input type="text" defaultValue="HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg" onChange={event => setPropertiesCreatorsAddress(event.target.value)} />
            </label>
          </p>
          <p>
            <label>Properties Creators Verified:
              <input type="checkbox" checked={valuePropertiesCreatorsVerified} onChange={event => setPropertiesCreatorsVerified(!valuePropertiesCreatorsVerified)} />
            </label>
          </p>
          <p>
            <label>Properties Creators Share:
              <input type="text" defaultValue="100" onChange={event => setPropertiesCreatorsShare(event.target.value)} />
            </label>
          </p>
        </fieldset>
      </div>

      <div>
        <button onClick={sendTransaction}>Send Transaction</button>
        <button onClick={mineTransaction}>Mine Transaction</button>
        <button onClick={getTransaction}>Get Transaction</button>
        <button onClick={getTransactionData}>Get Transaction Data</button>
        <div>
          Sent Transaction:
          <div>Transaction ID: {valArTransactionId}
            <a href={'http://127.0.0.1:1984/tx/' + valArTransactionId} target="_blank">[tx]</a>
            <a href={'http://127.0.0.1:1984/' + valArTransactionId} target="_blank">[data]</a>
          </div>
          <div>Block ID: {blockId}</div>
        </div>
      </div>
    </div>
  );
}
