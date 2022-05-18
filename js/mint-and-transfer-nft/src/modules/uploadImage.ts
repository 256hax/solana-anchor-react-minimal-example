import fs from 'fs';
import { uploadImageType } from '../types/arweave';
import { airdrop } from '../helpers/arweave';

export const uploadImage:uploadImageType = async(arweave) => {
  const key = JSON.parse(fs.readFileSync('./keys/arweave.key.json', 'utf-8'));

  // const address = await arweave.wallets.jwkToAddress(key);
  // airdrop(arweave, address);

  // Upload File
  const data = fs.readFileSync('./assets/irasutoya-art.png');

  // Transaction
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
