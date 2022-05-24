import { uploadImageType } from '../types/arweave';

export const uploadImage:uploadImageType = async(arweave, key, data) => {
  const transaction = await arweave.createTransaction({ data: data }, key);
  // transaction.addTag('Content-Type', 'image/png');
  await arweave.transactions.sign(transaction, key);

  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }

  return transaction.id;
};
