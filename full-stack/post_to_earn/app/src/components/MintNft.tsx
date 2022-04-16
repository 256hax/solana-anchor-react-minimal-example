import React, { useState, useContext } from 'react';
import { actions, utils, programs, NodeWallet} from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, BN, IdlAccounts, AnchorProvider } from "@project-serum/anchor";
import { arTransactionIdContext } from '../providers/ArTransactionId';

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare var window: Window

export function MintNft() {
  async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, 'processed');
    const wallet = window.solana;

    const provider = new AnchorProvider(
      connection, wallet, { commitment: 'processed' }
    );
    return provider;
  }

  return(
    <> </>
  );
}
