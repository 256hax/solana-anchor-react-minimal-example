import fs from 'fs';
import { uploadMetadataType } from '../types/arweave';
import { airdrop, getArweaveTransactionUrl } from '../helpers/arweave';
import { initMetadata } from '../helpers/metadata';

export const uploadMetadata: uploadMetadataType = async(arweave, uploadImageTx, keypair) => {
  const key = JSON.parse(fs.readFileSync('./keys/arweave.key.json', 'utf-8'));
  const address = await arweave.wallets.jwkToAddress(key);

  // airdrop(arweave, address);

  // Upload File
  const solanaCreatorsAddress = keypair.publicKey.toString();
  const data = {
    ...initMetadata,
    image: getArweaveTransactionUrl(arweave.api.config, uploadImageTx),
    properties: {
      creators: [
        {
          address: solanaCreatorsAddress, // Not your Arweave wallet address
          share: 100,
        }
      ]
    }
  };
  const dataJson =  JSON.stringify(data);

  // Transaction
  const transaction = await arweave.createTransaction({ data: dataJson }, key);
  // transaction.addTag('Content-Type', 'application/json');
  await arweave.transactions.sign(transaction, key);

  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }

  return transaction.id;
};
