import React, { useContext } from 'react';
import { actions } from '@metaplex/js';
import { clusterApiUrl, Connection, } from '@solana/web3.js';
import { AnchorProvider } from "@project-serum/anchor";
import { arTransactionIdContext } from '../providers/ArTransactionId';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare var window: Window

export const MintNft = () => {
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed'); // Localnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // Devnet

  const { valArTransactionId, setNewArTransactionId } = useContext(arTransactionIdContext);

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
    //  Uploading Arweave json data need to comply Token Metadata Starndard(Metaplex).
    //  Details: https://docs.metaplex.com/token-metadata/specification
    //  Example: https://arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E

    // const txId = valArTransactionId; // Use this

    // --- Localnet ---
    // const uri = 'http://127.0.0.1:1984/'; // Localnet

    // --- Testnet ---
    // Note: Tesnet powered by https://redstone.finance/
    const uri = 'https://testnet.redstone.tools/';
    const txId = 'vUOW3yPQiLBnVhU1XpyBeHeraxP9C4_OLkioHMCxhQY'; // Stub

    // --- Mainnet ---
    // const uri = 'https://arweave.net/';
    // const txId = '3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E'; // Can't use this(because creators addr doesn't match for you).

    const mintNftResponse = await actions.mintNFT({
      connection,
      wallet: provider.wallet, // It need to match your wallet and creators address of Metadata.
      uri: uri + txId,
      maxSupply: 1
    });

    console.log('mintNftResponse =>', mintNftResponse);
    console.log('mint =>', mintNftResponse.mint.toString());
    console.log('metadata =>', mintNftResponse.metadata.toString());
    console.log('edition =>', mintNftResponse.edition.toString());
  }

  return(
    <div>
      <button onClick={sendTransaction}>Mint NFT</button>
    </div>
  );
}
