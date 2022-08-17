import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, setAuthority, getAccount } from '@solana/spl-token';
import { KeypairIdentityDriver } from "@metaplex-foundation/js";

export const updateToOriginalOwner = async (
  connection: any,
  takerPublicKey: PublicKey,
  mint: PublicKey,
  payer: Keypair,
) => {
  const takerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    payer, // payer
    mint, // mint address
    takerPublicKey // owner
  );

  const nft = {
    json: {
      attributes: [
        {
          trait_type: "Orignal Owner",
          value: takerTokenAccount.address
        }
      ]
    }
  };

  const originalOwner = nft.json.attributes.find((a) => a.trait_type === "Orignal Owner");

  return originalOwner;
};
