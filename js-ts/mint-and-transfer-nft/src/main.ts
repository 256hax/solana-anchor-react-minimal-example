import fs from 'fs';
import { Keypair, PublicKey } from '@solana/web3.js';
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


  // --- Resoponse ---
  let uploadImageTx: string = ''; // Arweave Image Tx ID
  let uploadMetadataTx: string; // Arweave Metadata Tx ID
  let nftAddressMint: string; // Solana NFT One Supply Master Edition Address
  let nftAddressMintMultipleSupply: string;  // Solana NFT Multiple Supply Master Edition Address
  let editionAddressMint: string; // Solana NFT Edition Address


  // --- Arweave ---
  console.log('\n--- Upload Image to Arweave ---')
  try {
    uploadImageTx = await uploadImage(arweave);
    console.log('uploadImageTx =>', uploadImageTx);
    await _sleep(2000); // 1000 == 1 sec
  } catch(e) {
    console.log(e);
    console.log('If "Unable to upload transaction", try to change Arweave cluster.');
    return;
  }

  console.log('\n--- Upload Metadata to Arweave ---')
  const uploadImageTxStatus = await arweave.transactions.getStatus(uploadImageTx);

  if(uploadImageTxStatus.status == 200) { // 200: Exist data in Arweave
    uploadMetadataTx = await uploadMetadata(arweave, uploadImageTx, keypair);
    console.log('uploadMetadataTx =>', uploadMetadataTx);
    await _sleep(2000); // 1000 == 1 sec
  } else {
    console.log('Error: Arweave Transaction ID not found. Try to change Arweave cluster.')
    console.log('uploadImageTxStatus =>', uploadImageTxStatus);
    return;
  }


  // --- Solana ---
  console.log('\n--- Mint NFT on Solana ---')
  maxSupply = 1;
  const uploadMetadataTxStatus = await arweave.transactions.getStatus(uploadMetadataTx);

  if(uploadMetadataTxStatus.status == 200) {
    nftAddressMint = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
    console.log('NFT Address =>', nftAddressMint);
    await _sleep(2000); // 1000 == 1 sec
  } else {
    console.log('Error: Arweave Transaction ID not found. Try to change Arweave cluster.')
    console.log('uploadMetadataTxStatus =>', uploadMetadataTxStatus);
    return;
  }


  console.log('\n--- Transfer NFT to Someone ---')
  const nftAddressMintIsValid = PublicKey.isOnCurve(nftAddressMint);

  if(nftAddressMintIsValid) {
    await transferNft(connection, keypair, nftAddressMint); // Do not remove "await"
    await _sleep(2000); // 1000 == 1 sec
  } else {
    console.log('Error: Solana NFT Address Not Found.');
    return;
  }


  console.log('\n--- Mint Edition from Master Edition ---')

  console.log('\n Mint Master Edition(Multiple Supply)')
  maxSupply = 3;
  nftAddressMintMultipleSupply = await mintNft(connection, keypair, arweave, uploadMetadataTx, maxSupply);
  console.log('Master Edition Address(Original NFT) =>', nftAddressMintMultipleSupply);
  await _sleep(2000); // 1000 == 1 sec

  console.log('\n Mint Edition(Copy NFT from Master Edition)')
  const nftAddressMintMultipleSupplyStatus = PublicKey.isOnCurve(nftAddressMintMultipleSupply);
  if(nftAddressMintMultipleSupplyStatus){
    editionAddressMint = await mintEdition(connection, keypair, nftAddressMintMultipleSupply);
    console.log('Edition Address(Copy NFT) =>', editionAddressMint);
  } else {
    console.log('Error: Solana NFT Address Not Found.');
    return;
  }
};

main();

/*
% ts-node <THIS FILE>

--- Upload Image to Arweave ---
0% complete, 0/3
33% complete, 1/3
66% complete, 2/3
100% complete, 3/3
uploadImageTx => vrbvM9QDygSkbJY5fTNOFxsBXwLU1ZLeNO6UcTprT7E

--- Upload Metadata to Arweave ---
100% complete, 1/1
uploadMetadataTx => sK2Gx5XummSlanObPa840u81ryH_yf-4S0V2bSsu8kc

--- Mint NFT on Solana ---
mint => Do3S7KCX74i6n5X8BsDwFrQctQkWrrCQAUf2meadaG2V
metadata => 97qYBjWCQdyAgUfZYUNmYHj76JdLdKwLMCin1qHDUfiY
edition => 3mf55ojFb15hiQJLd5xsA7b4r2CxEPuiYFWJL4rcMfTz
NFT Address => Do3S7KCX74i6n5X8BsDwFrQctQkWrrCQAUf2meadaG2V

--- Transfer NFT to Someone ---
fromWallet.publicKey     => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
toWallet.publicKey       => HbQp5rXWPyhrrttZ5KcFdTexST1BeMgm46MFcc76TBfL
fromTokenAccount.address => G2XrrS2LQjTmTaqkhXK4o5XNH1A8jn5CqHJpKaNWnBx3
toTokenAccount.address   => 6pN82ouB1Dt9koVTBq53F7mgXBPcEk2Ga6Cwj6VtRaaN
mint address             => Do3S7KCX74i6n5X8BsDwFrQctQkWrrCQAUf2meadaG2V
transfer tx              => 3CHjw8pKKqCYDZRFsh5rmfT3AhaS2gY86ZHZtCJUQmegq6bJCj9JWZ3wU9okxPqhhLyUgJwBDQkTbWZRCAWcFR7K

--- Mint Edition from Master Edition ---

 Mint Master Edition(Multiple Supply)
mint => 34oLbyhPzHyAc76FY7eLoisuuYgafR5RTp4AKL18QD95
metadata => CZnMcJUT9sNZi1Xz5mveTS19UbHXQS5J7LtaX8JX1gdY
edition => Danp9nef675WueCndgQEYDTtciwpZPGKx5tovUfDkrQm
Master Edition Address(Original NFT) => 34oLbyhPzHyAc76FY7eLoisuuYgafR5RTp4AKL18QD95

 Mint Edition(Copy NFT from Master Edition)
mint => BLyQHToRkAcNyhQjZVrrk9by3Xd555CaorB5rr9w7WQW
metadata => CnX9G2zHyE4pFVdkfwYLx5VK6tg5a9w2FXLQTAoH1rMV
edition => FQVoiHrNBy6cki87xk86anvHohMzMVgNB6jhCN5SdS27
Edition Address(Copy NFT) => BLyQHToRkAcNyhQjZVrrk9by3Xd555CaorB5rr9w7WQW
*/
