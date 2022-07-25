// Ref: https://github.com/metaplex-foundation/js#findbymint
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const mintAddress = new PublicKey("BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1");

  const nft = await metaplex.nfts().findByMint(mintAddress).run();

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.address.toString());
  console.log('NFT metadataAddress =>', nft.metadataAddress.toString());
  console.log('NFT Image =>', nft.uri);
};

main();