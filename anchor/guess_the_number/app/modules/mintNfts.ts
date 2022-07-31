import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';
import { sleep } from 'sleep';

export const mintNfts = async(metaplex: any) => {
  const bufferImage = fs.readFileSync('./app/assets/images/number1.png');
  const fileImage = toMetaplexFile(bufferImage, 'number1.png');
  const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
          name: "Number 1 Metadata",
          description: "My answer is 1!",
          image: fileImage,
      })
      .run();

  const { nft } = await metaplex
      .nfts()
      .create({
          uri: uri,
          name: "Number 1",
          sellerFeeBasisPoints: 500, // Represents 5.00%.
          maxSupply: toBigNumber(1),
      })
      .run();

  return [uri, nft];
};