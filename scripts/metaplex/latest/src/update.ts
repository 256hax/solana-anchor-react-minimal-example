// Ref: https://github.com/metaplex-foundation/js#update
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // --- Airdrop ---
  let airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
  });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);
  // --- End Airdrop ---


  // Ref:
  //  bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: 'https://api.devnet.solana.com',
          timeout: 60000,
      }));

  const { uri } = await metaplex
      .nfts()
      .uploadMetadata({
          name: "My NFT Metadata",
          description: "My description",
          image: "https://placekitten.com/200/300",
      })
      .run();

  // Ref:
  //  The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
  .nfts()
  .create({
      uri: uri,
      name: "My NFT",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: 1,
  })
  .run();

  const { nft: updatedNft } = await metaplex
      .nfts()
      .update(nft, { name: "My Updated Name" })
      .run();

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.address.toString());
};

main();