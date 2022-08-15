import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';
import { sleep } from 'sleep';

export const initializeWallets = async(connection: any) => {
  const secretKey1 = new Uint8Array(JSON.parse(fs.readFileSync('./app/assets/keys/taker1.key.json', 'utf8')));
  const taker1 = Keypair.fromSecretKey(secretKey1);

  const secretKey2 = new Uint8Array(JSON.parse(fs.readFileSync('./app/assets/keys/taker2.key.json', 'utf8')));
  const taker2 = Keypair.fromSecretKey(secretKey2);

  return [taker1, taker2];
};