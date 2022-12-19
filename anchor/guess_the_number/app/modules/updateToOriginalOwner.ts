import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";

export const updateToOriginalOwner = async (
  metaplex: Metaplex,
  takerPublicKey: PublicKey,
  mint: PublicKey,
) => {
  const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

  const { uri: newUri } = await metaplex
    .nfts()
    .uploadMetadata({
      ...nft.json,
      attributes: [
        {
          trait_type: "Original Owner",
          value: takerPublicKey.toString()
        }
      ]
    });

  await metaplex
    .nfts()
    .update({
      nftOrSft: nft,
      uri: newUri
    });
  const updatedNft = await metaplex.nfts().refresh(nft);

  const originalOwner = updatedNft.json.attributes.find((a: any) => a.trait_type === "Original Owner");

  return originalOwner.value;
};