import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, setAuthority, getAccount } from '@solana/spl-token';
import { KeypairIdentityDriver } from "@metaplex-foundation/js";

export const updateToOriginalOwner = async (
  takerPublicKey: PublicKey,
  mint: PublicKey,
  payer: Keypair,
) => {
  const nft = {
    json: {
      attributes: [
        {
          trait_type: "Original Owner",
          value: takerPublicKey
        }
      ]
    }
  };

  const originalOwner = nft.json.attributes.find((a) => a.trait_type === "Original Owner");

  return originalOwner.value;
};