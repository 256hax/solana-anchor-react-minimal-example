import { bundlrStorage, keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import axios from 'axios';
import sleep from 'sleep';

export const pickupWinner = async (
  payer: Keypair,
  winnerNfts: any,
): Promise<PublicKey> => {
  // Count eligible NFTs(including noise)
  const winnerNftsLength = winnerNfts.length;

  let originalOwner;
  for(let i = 0; i < 30; i++) {
    // Get random number for array index
    const randomNumber = Math.floor(Math.random() * winnerNftsLength);
    const metadataUri = winnerNfts[randomNumber].uri;

    try {
      // Get metadata from Arweave
      const response = await axios.get(metadataUri);

      // Get "Original Owner" attributes
      originalOwner = response.data.attributes.find(
        (a: any) => a.trait_type === "Original Owner"
      );

      if(originalOwner && originalOwner != payer.publicKey) {
        return originalOwner.value;
      }
    } catch(e) {
      console.log(i, 'Not found Metadata. skip...');
    }

    sleep.sleep(1); // 1 = 1sec
  }

  return;
};