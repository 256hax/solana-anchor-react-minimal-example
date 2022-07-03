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
  const buffer = fs.readFileSync('./assets/irasutoya-art.png');
  const file = useMetaplexFile(buffer, 'my-file.png');

  const { uri, metadata } = await metaplex.nfts().uploadMetadata({
      name: "My NFT",
      image: await file,
  });

  console.log('TX =>', uri);
  console.log('Image File =>', metadata.image);
};

main();

/*
% ts-node <THIS FILE>
https://arweave.net/Sjdt-DqouZarwEQ6XwY7FPkS3Ku3WwpuI_pq1d366SA
https://arweave.net/wpLOwSdFi26o6oyxwrWe9corGrXdTwBV0sqn1yrFasQ
*/