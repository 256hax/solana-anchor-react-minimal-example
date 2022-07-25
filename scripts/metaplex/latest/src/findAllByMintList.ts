// Ref: https://github.com/metaplex-foundation/js#findallbymintlist
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const mintA = new PublicKey("51xeBTXTHK7MHv5Po3zW68rAgTAMv7KCXzz62xQfsQVP");
  const mintB = new PublicKey("BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1");

  const [nftA, nftB] = await metaplex
      .nfts()
      .findAllByMintList([mintA, mintB])
      .run();
 
  console.log('nftA =>', nftA);
  console.log('nftB =>', nftB);
};

main();