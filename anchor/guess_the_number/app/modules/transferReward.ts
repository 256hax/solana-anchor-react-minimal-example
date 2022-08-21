import { bundlrStorage, keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import axios from 'axios';

export const transferReward = async (
  payer: Keypair,
  winnerNfts: any,
) => {
  const winnerNftsLength = winnerNfts.length;
  const randomNumber = Math.floor(Math.random() * winnerNftsLength);

  const metadataUri = winnerNfts[randomNumber].uri;

  const response = await axios.get(metadataUri);
  
  const originalOwner = response.data.attributes.find(
    (a: any) => a.trait_type === "Original Owner"
  );
  console.log(originalOwner.value);

};