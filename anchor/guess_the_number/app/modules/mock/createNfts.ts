import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, setAuthority, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const createNfts = async (connection: any, payer: Keypair) => {
  // use token instead of NFT for stub
  const fakeNft = await createMint(
      connection, // connection
      payer, // payer
      payer.publicKey, // mintAuthority
      null, // freezeAuthority
      0 // decimals
  );

  return fakeNft;
};