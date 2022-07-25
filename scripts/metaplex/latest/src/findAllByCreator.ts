// Ref: https://github.com/metaplex-foundation/js#findallbycreator
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const creatorPublicKey = new PublicKey("Dq89Qd6D37GWPQqoqNNwtk1tZuny4DbRfdymHV2W1Y2q");
  const myNfts = await metaplex
      .nfts()
      .findAllByOwner(creatorPublicKey)
      .run();

  console.log(myNfts);
};

main();