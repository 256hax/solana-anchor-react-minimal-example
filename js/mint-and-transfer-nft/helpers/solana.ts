import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { clusterType } from '../types/solana';

export const solanaCluster = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
};

export const initSolana = (cluster: clusterType) => {
  const connection = new Connection(cluster, 'confirmed');

  return connection;
};

export const airdrop = async(connection: any, address: PublicKey) => {
  const aidropSignature = await connection.requestAirdrop(address, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(aidropSignature);

  const balance = await connection.getBalance(address);

  console.log('Done airdrop!');
  console.log('Balance =>', balance);
}
