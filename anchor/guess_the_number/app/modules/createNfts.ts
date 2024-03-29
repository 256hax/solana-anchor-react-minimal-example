import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';
import { sleep } from 'sleep';

export const createNfts = async (
  metaplex: Metaplex,
  metadata: any,
): Promise<PublicKey> => {
  const bufferImage = fs.readFileSync(metadata.filePath);
  const fileImage = toMetaplexFile(bufferImage, metadata.fileName);
  const { uri: uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: metadata.name,
      description: metadata.description,
      image: fileImage,
    });

  sleep(1); // 1 = 1sec. Avoid for too many request

  const { nft: nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: metadata.name,
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
    });
  
  sleep(1); // 1 = 1sec. Avoid for too many request

  const mintAddress = nft.mint.address;

  return mintAddress;
};