// Ref: https://github.com/metaplex-foundation/js#uploadmetadata
import { Metaplex, keypairIdentity, bundlrStorage, useMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // airdrop
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
  // End airdrop

  
  // Ref:
  //  bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }));

  // Ref:
  //  MetaplexFile: https://github.com/metaplex-foundation/js#metaplexfile
  const file = useMetaplexFile('The content of my file', 'my-file.txt');

  const { uri, metadata } = await metaplex.nfts().uploadMetadata({
      name: "My NFT",
      image: await file,
  });

  console.log(metadata.image);
  console.log(uri);
};

main();

/*
% ts-node <THIS FILE>
https://arweave.net/Ki9skgYNSjCH70Ni1VT60s0eJQ2zuAu5uf1KrMAIa10
https://arweave.net/VsZwNEUQ4y48uLEznvyIrOfYjWFGAomMizIfiz43ZuE
*/