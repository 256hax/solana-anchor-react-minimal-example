// Ref: https://github.com/metaplex-foundation/js#findallbyowner
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const owenerPublicKey = new PublicKey("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd");
  const myNfts = await metaplex
    .nfts()
    .findAllByOwner(owenerPublicKey)
    .run();

  console.log(myNfts);
};

main();