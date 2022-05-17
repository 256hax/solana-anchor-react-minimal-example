import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import { arweaveCluster, initArweave } from './helpers/arweave';
import { uploadImage } from './modules/uploadImage';
import { uploadMetadata } from './modules/uploadMetadata';
import { solanaCluster, initSolana } from './helpers/solana';
import { mintNft } from './modules/mintNft';

const main = async() => {
  // --- Config Arweave ---
  const arweave = initArweave(arweaveCluster.testnet_redstone);

  // --- Config Solana ---
  const connection = initSolana(solanaCluster.devnet);
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./keys/solana.key.json', 'utf8')));
  const keypair = Keypair.fromSecretKey(secretKey);

  // --- Arweave ---
  const uploadImageTx = await uploadImage(arweave);
  console.log('uploadImageTx =>', uploadImageTx);

  const uploadMetadataTx = await uploadMetadata(arweave, uploadImageTx, keypair);
  console.log('uploadMetadataTx =>', uploadMetadataTx);

  // --- Solana ---
  // const uploadMetadataTx = '7-5rUVh6qE28258xuD-tGm1kT3zdWn0Kdoyt3-lyvp8'; // Stub
  const mintNftAddress = await mintNft(connection, keypair, arweave, uploadMetadataTx);
};

main();
