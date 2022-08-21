import { Keypair, PublicKey } from '@solana/web3.js';

export type mintNftType = {
  (
    connection: any,
    payer: Keypair,
    takerPublicKey: PublicKey,
    mint: PublicKey,
  ): Promise<string>
};