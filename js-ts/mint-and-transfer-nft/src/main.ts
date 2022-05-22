import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import { arweaveCluster, initArweave } from './helpers/arweave';
import { uploadImage } from './modules/uploadImage';
import { uploadMetadata } from './modules/uploadMetadata';
import { solanaCluster, initSolana } from './helpers/solana';
import { mintNft } from './modules/mintNft';
import { transferNft } from './modules/transferNft';
import { mintEdition } from './modules/mintEdition';

const main = async() => {
  const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Config Arweave ---
  const arweave = initArweave(arweaveCluster.testnet);


  // --- Config Solana ---
  const connection = initSolana(solanaCluster.devnet);
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('./keys/solana.key.json', 'utf8')));
  const keypair = Keypair.fromSecretKey(secretKey);
  let maxSupply: number;


  // --- Stub ---
  // const uploadMetadataTx = 'yKVqBc07-ebllukkU_8GtfuK4CARds_Q_g9sKAynUg4';
  // const nftAddressMint = 'HVGfUEAQa2savpas6LEoBQ64KkTfBtiG55pWwstM8B47';
  // const nftAddressMintMultipleSupply = '6EGepQSWaSCVrZNiwMNvMzMu6zRLsbr35cK1TX5pb7GF';


  // --- Arweave ---
  console.log('\n--- Upload Image to Arweave ---')
  const uploadImageTx = await uploadImage(arweave);
  console.log('uploadImageTx =>', uploadImageTx);
  await _sleep(2000); // 1000 == 1 sec


  console.log('\n--- Upload Metadata to Arweave ---')
  const uploadMetadataTx = await uploadMetadata(arweave, uploadImageTx, keypair);
  console.log('uploadMetadataTx =>', uploadMetadataTx);
  await _sleep(2000); // 1000 == 1 sec


  // --- Solana ---
  console.log('\n--- Mint NFT on Solana ---')
  maxSupply = 1;
  const nftAddressMint = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
  console.log('NFT Address =>', nftAddressMint);
  await _sleep(2000); // 1000 == 1 sec


  console.log('\n--- Transfer NFT to Someone ---')
  const transferNftTx = await transferNft(connection, keypair, nftAddressMint);
  await _sleep(2000); // 1000 == 1 sec


  console.log('\n--- Mint Edition from Master Edition ---')
  console.log('\n Mint Master Edition(Multiple Supply)')
  maxSupply = 3;
  const nftAddressMintMultipleSupply = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
  console.log('Master Edition Address(Original NFT) =>', nftAddressMintMultipleSupply);
  await _sleep(2000); // 1000 == 1 sec

  console.log('\n Mint Edition(Copy NFT from Master Edition)')
  const editionAddressMint = await mintEdition(connection, keypair, nftAddressMintMultipleSupply);
  console.log('Edition Address(Copy NFT) =>', editionAddressMint);
};

main();

/*
% ts-node <THIS FILE>

--- Upload Image to Arweave ---
0% complete, 0/3
33% complete, 1/3
66% complete, 2/3
100% complete, 3/3
uploadImageTx => HyohvURBv-Vy5eWen4JzItfO05qE-RbRSioAr_Ib90g

--- Upload Metadata to Arweave ---
100% complete, 1/1
uploadMetadataTx => TEmp0-ldEHNi11hE1-NFkW0DuYcyQKb-ih3E2Cvp4JY

--- Mint NFT on Solana ---
mint => 5eGi4q4MxkYqb3CimfAchaWSoeDC8vCcGWUR45NRoaZE
metadata => 4AFzWun8xd3L3TTCxVWrhW6g1CpDQyVyBee4KJSc7kRW
edition => B8KPSJ2eu4x8Wsk5A3aejTbyvQaAnpzFbexYXAoX2cu7
NFT Address => 5eGi4q4MxkYqb3CimfAchaWSoeDC8vCcGWUR45NRoaZE

--- Transfer NFT to Someone ---
fromWallet.publicKey     => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
toWallet.publicKey       => 2bwx4y3MshhuT3FCyfjTF1BhjJLzB9Sqw6awqwLVLgSP
fromTokenAccount.address => 2fgPWdQjrNhU2gtyh4EpZ9Q6KdxUKG2VF5W51fYn7c42
toTokenAccount.address   => 4omgCY2HNV1T8odUbPpMVF2ZX9WpdcDyVvnYL1MBQoYj
mint address             => 5eGi4q4MxkYqb3CimfAchaWSoeDC8vCcGWUR45NRoaZE
transfer tx              => 5QBMUYb7ggzKT95EKTbrnR1amAyvEZuXP3hm6sfxTPpr98PgeSb8msWGpUdTC1UrHpLFwhs5mmhE8pf7EdPmHYms

--- Mint Edition from Master Edition ---

 Mint Master Edition(Multiple Supply)
mint => AvXJvB6FUS8s7T67K5wBQFPRXU2RfMtNSztuo9tBYgoc
metadata => 6f2TAdG34FK4Yod1tCtnXazLuvw4htBHTZXFZuuU8NRw
edition => 5YGCcL4u1cXmB8qgPZqTLjiNV4JXioJSbJt1Ln7NJ2Dx
Master Edition Address(Original NFT) => AvXJvB6FUS8s7T67K5wBQFPRXU2RfMtNSztuo9tBYgoc

 Mint Edition(Copy NFT from Master Edition)
mint => 2pzXnzdv8mTCgUUXr1yLztQ4DH3NjvZPaHYJj1bWMy4v
metadata => AcxkYkEAxB6zFkMMgKSW9L7dGNqXYshpRcWNGGzDZeUP
edition => HN4xccXtbTsiBiFYhUZ7EgsyrDfGZxc5yKK6jwYejxKA
Edition Address(Copy NFT) => 2pzXnzdv8mTCgUUXr1yLztQ4DH3NjvZPaHYJj1bWMy4v
*/
