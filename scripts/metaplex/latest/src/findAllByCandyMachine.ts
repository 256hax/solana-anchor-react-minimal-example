// Ref: https://github.com/metaplex-foundation/js#findallbycandymachine
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const candyMachinePublicKey = new PublicKey("ELvb8zc75Ko2ay62EDax6ydUBQBLUJtMusVZ56fKsv5y");
  const nfts = await metaplex.candyMachines().findMintedNfts(candyMachinePublicKey).run();

  console.log(nfts);
};

main();