import { Keypair, PublicKey } from '@solana/web3.js';

export type setRewardType = {
  (
    connection: any,
    payerWallet: Keypair,
  ): Promise<string>
};