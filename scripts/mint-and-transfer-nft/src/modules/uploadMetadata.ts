import { uploadMetadataType } from '../types/arweave';
import { getArweaveTransactionUrl } from '../helpers/arweave';
import { initMetadata } from '../assets/metadata';

export const uploadMetadata: uploadMetadataType = async(arweave, key, uploadImageTx, solanaCreatorsAddress) => {
  // Upload File
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
