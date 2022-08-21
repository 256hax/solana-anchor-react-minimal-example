import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';

export const initializeWallets = async(
  secretKeyPath: string
): Promise<Keypair> => {
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(secretKeyPath, 'utf8')));
  const keypair = Keypair.fromSecretKey(secretKey);

  return keypair;
};