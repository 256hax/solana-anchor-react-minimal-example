import React, { useState, useContext } from 'react';
import { actions, utils, programs, NodeWallet} from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { arTransactionIdContext } from '../providers/ArTransactionId';

export function MintNft() {
  const { valArTransactionId } = useContext(arTransactionIdContext);

  async function testDeleteLater(){
    console.log(valArTransactionId);
  }

  return (
    <button onClick={testDeleteLater}>test</button>
  );
}
