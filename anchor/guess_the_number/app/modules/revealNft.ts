import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";

export const revealNft = async (
  metaplex: Metaplex,
  mint: PublicKey,
  attributes: any,
  correctName: string,
) => {
  const nft = await metaplex.nfts().findByMint(mint).run();

  const { uri: newUri } = await metaplex
    .nfts()
    .uploadMetadata({
      ...nft.json,
      name: correctName,
      attributes
    })
    .run();

  const { nft: updatedNft } = await metaplex
    .nfts()
    .update(nft, {
      name: correctName,
      uri: newUri
    })
    .run();

  const prize = updatedNft.json.attributes.find(
    (a: any) => a.trait_type === "Prize(SOL)"
  );

  return [updatedNft.json.name, prize.value];
};