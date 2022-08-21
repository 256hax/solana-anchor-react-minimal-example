import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";

export const eligibleWinner = async (
  metaplex: Metaplex,
  payerPublicKey: PublicKey,
  correctName: string,
): Promise<any> => {
  const nfts = await metaplex
    .nfts()
    .findAllByOwner(payerPublicKey)
    .run();

  const filteredNfts = nfts.filter(function (v) {
    return v.name == correctName && v.updateAuthorityAddress.toString() == payerPublicKey.toString();
  });
  
  return filteredNfts;
};