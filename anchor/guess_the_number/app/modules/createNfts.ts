import { Metaplex, keypairIdentity, bundlrStorage, mockStorage, toMetaplexFile, toMetaplexFileFromBrowser, toBigNumber } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';
import { sleep } from 'sleep';

export const createNfts = async (metaplex: any) => {
  const bufferImage1 = fs.readFileSync('./app/assets/images/number_1.png');
  const fileImage1 = toMetaplexFile(bufferImage1, 'number_1.png');
  const { uri: uri1 } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Number 1 Metadata",
      description: "This is 1!",
      image: fileImage1,
    })
    .run();

  sleep.sleep(1); // 1 = 1sec. for too many request

  const { nft: nft1 } = await metaplex
    .nfts()
    .create({
      uri: uri1,
      name: "Number 1",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
    })
    .run();
  
  const bufferImage2 = fs.readFileSync('./app/assets/images/number_2.png');
  const fileImage2 = toMetaplexFile(bufferImage2, 'number_2.png');
  const { uri: uri2 } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Number 2 Metadata",
      description: "This is 2!",
      image: fileImage2,
    })
    .run();

  const { nft: nft2 } = await metaplex
    .nfts()
    .create({
      uri: uri2,
      name: "Number 2",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
    })
    .run();
 
  return [uri1, nft1, uri2, nft2];
};