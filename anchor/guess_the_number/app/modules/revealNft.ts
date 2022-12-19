import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";

export const revealNft = async (
  metaplex: Metaplex,
  mint: PublicKey,
  attributes: any,
  correctName: string,
): Promise<[string, string]> => {
  const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

  const { uri: newUri } = await metaplex
    .nfts()
    .uploadMetadata({
      ...nft.json,
      name: correctName,
      attributes
    });

  await metaplex
    .nfts()
    .update({
      nftOrSft: nft,
      name: correctName,
      uri: newUri
    });
  const updatedNft = await metaplex.nfts().refresh(nft);

  const prize = updatedNft.json.attributes.find(
    (a: any) => a.trait_type === 'Prize(SOL)'
  );

  return [updatedNft.json.name, prize.value];
};