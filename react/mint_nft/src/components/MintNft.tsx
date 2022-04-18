import React, { useState, useContext } from 'react';
import { actions, utils, programs, NodeWallet} from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, BN, IdlAccounts, AnchorProvider, getProvider } from "@project-serum/anchor";
import { arTransactionIdContext } from '../providers/ArTransactionId';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare var window: Window

// const connection = new Connection('http://127.0.0.1:8899', 'confirmed'); // Localnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // Devnet

export function MintNft() {
  async function getProvider() {
    const wallet = window.solana;

    const provider = new AnchorProvider(
      connection, wallet, { commitment: 'processed' }
    );
    return provider;
  }

  async function sendTransaction() {
    const provider = await getProvider();

    // Note:
    //  Uploaded Arweave data need to comply Token Metadata Starndard.
    //  Details: https://docs.metaplex.com/token-metadata/specification
    //  Data Example: arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E

    // --- Localnet ---
    // const uri = 'http://127.0.0.1:1984/'; // Localnet

    // --- Testnet ---
    // const uri = 'https://testnet.redstone.tools/';
    // const txId = 'vUOW3yPQiLBnVhU1XpyBeHeraxP9C4_OLkioHMCxhQY';

    // --- Mainnet ---
    const uri = 'https://arweave.net/';
    const txId = '3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E';
    console.log(provider.wallet);

    const mintNFTResponse = await actions.mintNFT({
      connection,
      wallet: provider.wallet.publicKey,
      uri: uri + txId,
      maxSupply: 1
    });

    console.log('mintNFTResponse =>', mintNFTResponse);
    console.log('mint =>', mintNFTResponse.mint.toString());
    console.log('metadata =>', mintNFTResponse.metadata.toString());
    console.log('edition =>', mintNFTResponse.edition.toString());
  }

  return(
    <div>
      <button onClick={sendTransaction}>Mint NFT</button>
    </div>
  );
}
