// Ref: https://github.com/metaplex-foundation/js#uploadmetadata
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import fs from 'fs';
import { sleep } from 'sleep';

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./assets/id.json', 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  // let airdropSignature = await connection.requestAirdrop(
  //   wallet.publicKey,
  //   LAMPORTS_PER_SOL,
  // );

  // const latestBlockHash = await connection.getLatestBlockhash();

  // await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature: airdropSignature,
  // });

  // sleep(5); // Wait for airdrop confirmation.

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  if (balance >= LAMPORTS_PER_SOL) {
    console.log('wallet balance =>', balance);
  } else {
    throw Error('Failed to airdrop. Adjust sleep time, use custom RPC or use your wallet.');
  }

  // ------------------------------------
  //  Make Metaplex
  // ------------------------------------
  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // ------------------------------------
  //  Mint NFT
  // ------------------------------------
  // Ref: MetaplexFile: https://github.com/metaplex-foundation/js#metaplexfile
  // 
  // const buffer = fs.readFileSync('./assets/my-file.txt');
  // const file = toMetaplexFile(buffer, 'my-file.txt');
  // 
  const buffer = fs.readFileSync('./assets/my-image.png');
  const file = toMetaplexFile(buffer, 'my-image.png');

 const { uri, metadata } = await metaplex
    .nfts()
    .uploadMetadata({
      name: 'My NFT Metadata',
      description: 'My description',
      image: file,
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