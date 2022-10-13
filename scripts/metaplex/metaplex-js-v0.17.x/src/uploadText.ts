// Ref: https://github.com/metaplex-foundation/js#uploadmetadata
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';

const main = async () => {
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


  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // Ref: MetaplexFile: https://github.com/metaplex-foundation/js#metaplexfile
  // const file = toMetaplexFile('The content of my file', 'my-file.txt');
  const file = toMetaplexFile('file-content', 'filename.jpg', {
    uniqueName: 'my-unique-aws-key',
  });

  const { uri, metadata } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "My NFT Metadata",
      description: "My description",
      image: await file,
    });

  console.log('uri =>', uri);
  console.log('metadata =>', metadata);
};

main();

/*
% ts-node <THIS FILE>
uri => https://arweave.net/3wOD48yTpf_ypatJVsQSXHWBr-Qa3LB3hTvKpUXtgcM
metadata => {
  name: 'My NFT Metadata',
  description: 'My description',
  image: 'https://arweave.net/nj7fwpJmXjj-xB8jvyJw4zf4ogtVjTlVadFXK5usXgk'
}
*/