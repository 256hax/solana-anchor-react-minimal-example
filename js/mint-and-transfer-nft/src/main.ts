import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import { arweaveCluster, initArweave } from './helpers/arweave';
import { uploadImage } from './modules/uploadImage';
import { uploadMetadata } from './modules/uploadMetadata';
import { solanaCluster, initSolana } from './helpers/solana';
import { mintNft } from './modules/mintNft';
import { transferNft } from './modules/transferNft';

const main = async() => {
  const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Config Arweave ---
  const arweave = initArweave(arweaveCluster.testnet);


  // --- Config Solana ---
  const connection = initSolana(solanaCluster.devnet);
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./keys/solana.key.json', 'utf8')));
  const keypair = Keypair.fromSecretKey(secretKey);


  // --- Arweave ---
  console.log('\n--- Upload Image to Arweave ---')
  const uploadImageTx = await uploadImage(arweave);
  console.log('uploadImageTx =>', uploadImageTx);
  await _sleep(1000); // 1000 == 1 sec

  console.log('\n--- Upload Metadata to Arweave ---')
  const uploadMetadataTx = await uploadMetadata(arweave, uploadImageTx, keypair);
  console.log('uploadMetadataTx =>', uploadMetadataTx);
  await _sleep(1000); // 1000 == 1 sec


  // --- Solana ---
  console.log('\n--- Mint NFT on Solana ---')
  // const uploadMetadataTx = 'yKVqBc07-ebllukkU_8GtfuK4CARds_Q_g9sKAynUg4'; // Stub
  const mintNftAddress = await mintNft(connection, keypair, arweave, uploadMetadataTx);
  console.log('mintNftAddress =>', mintNftAddress);
  await _sleep(1000); // 1000 == 1 sec

  console.log('\n--- Transfer NFT to Someone ---')
  // const mintNftAddress = 'HVGfUEAQa2savpas6LEoBQ64KkTfBtiG55pWwstM8B47'; // Stub
  const transferNftTx = await transferNft(connection, keypair, mintNftAddress);
};

main();

/*
% ts-node <THIS FILE>

--- Upload Image to Arweave ---
0% complete, 0/3
33% complete, 1/3
66% complete, 2/3
100% complete, 3/3
uploadImageTx => TNPNv4IMp-Yluiyfr5XPBe2ubog-vsbSLuNg5cH2Mjk

--- Upload Metadata to Arweave ---
100% complete, 1/1
uploadMetadataTx => N6Xs31rRbhVzyC7OrOTpxUHaj3hI2oSHRLi_-ed7IKs

--- Mint NFT on Solana ---
mintNFTResponse => {
  txId: '5dYP7QcKQ6ioMm71X9bGZBcmu8Jhfb7ma91M6pfAdupAhHrRS3B1ZRwQSCb88ERVXWSZX83ZjhJ5fJ66nNG6qwGX',
  mint: PublicKey {
    _bn: <BN: d0705452c6fcf2cb56e8b32489f5217769afd32c85038882da51b09a974cb7ff>
  },
  metadata: PublicKey {
    _bn: <BN: e28ab4de2ab1b2578052bd6b0fb33c203e76bda99b8ab8ad3a81343bdfbb91d6>
  },
  edition: PublicKey {
    _bn: <BN: 514d6344993a5dde77476a177a202c83be2c4c97102b5a271eb3511b36d9e11>
  }
}
mint => F2f9TXBKz8n4ru79yPAYhFeQcrqncMbm5qqZipTorhiE
metadata => GFKp83cNxuNPJbWdi5ZRpNLrjLbbEsaEt8ngLMUbEF2V
edition => LqU4eswFbeEyc4RVphdhpEVzwCxCAjEwA8CpvQtreyv
mintNftAddress => F2f9TXBKz8n4ru79yPAYhFeQcrqncMbm5qqZipTorhiE

--- Transfer NFT to Someone ---
fromWallet.publicKey     => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
toWallet.publicKey       => H7s58dVSoiiCk1vi8kAi2V6S5d82sQbJzK6qzmSAkJ5o
fromTokenAccount.address => A1KVhoM33vitRirPsnpR621VFdWiD6Sem5fJz93pVs9Q
toTokenAccount.address   => 9QzTPnP72TC8HLDuN2gKGFydrGAnXSRG9wqaCJxd5bsM
mint address             => F2f9TXBKz8n4ru79yPAYhFeQcrqncMbm5qqZipTorhiE
transfer tx              => vocKeff9TCK3EtcjSGpc61Ye5Y9kVG5pUPSkepYynpphBY2Pga9TsH5NsmgTWBztYRW81ZETRhu3rbwo7kz3BLH
*/
