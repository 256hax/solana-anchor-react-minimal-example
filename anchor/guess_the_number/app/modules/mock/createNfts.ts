import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, setAuthority, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const createNfts = async (connection: any, payer: Keypair) => {
  const uri1 = 'https://example.com/image/1'; // not use

  // use token instead of nft for stub
  const nft1 = await createMint(
    connection, // connection
    payer, // payer
    payer.publicKey, // mintAuthority
    null, // freezeAuthority
    0 // decimals
  );

  const uri2 = 'https://example.com/image/2'; // not use

  // use token instead of nft for stub
  const nft2 = await createMint(
      connection, // connection
      payer, // payer
      payer.publicKey, // mintAuthority
      null, // freezeAuthority
      0 // decimals
  );

  return [uri1, nft1, uri2, nft2];
};