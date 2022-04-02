// Ref:
import { actions, utils, programs, NodeWallet} from '@metaplex/js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';

const run = async () => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // const connection = new Connection('http://localhost:8899', 'confirmed');

  // const keypair = Keypair.generate();
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('../key.json', 'utf8')));
  const keypair = Keypair.fromSecretKey(secretKey);

  const feePayerAirdropSignature = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(feePayerAirdropSignature);

  // const uri = 'http://127.0.0.1:1984/';
  const uri = 'https://testnet.redstone.tools/';
  const txId = 'vUOW3yPQiLBnVhU1XpyBeHeraxP9C4_OLkioHMCxhQY'; // Replace your Transction ID in Arweave

  const mintNFTResponse = await actions.mintNFT({
    connection,
    wallet: new NodeWallet(keypair),
    uri: uri + txId,
    maxSupply: 1
  });

  console.log('mintNFTResponse =>', mintNFTResponse);
  console.log('mint =>', mintNFTResponse.mint.toString());
  console.log('metadata =>', mintNFTResponse.metadata.toString());
  console.log('edition =>', mintNFTResponse.edition.toString());
};

run();

/*
Blockchain Network
- Arweave: testnet.redstone.tools
- Solana: devnet
- Metaplex Program: devnet

STEP 1: Upload metadata to Arweave(testnet.redstone.tools).
STEP 2: Get Transaction ID and replace "txId" value in this file.
STEP3 : Run
% ts-node <THIS FILE>

mintNFTResponse => {
  txId: 'Go9gUJ7u5tvn2VDMhNccsMHgpFaEuL3ZfyXGSE5e4oQUEnjzazgXqEuvcZAu8XnCy3iYi2tV7HQetQLx4sdXNMN',
  mint: PublicKey {
    _bn: <BN: 415f5271e4040451a78804578b821057982e1da719aea3453b6069cfff9c3052>
  },
  metadata: PublicKey {
    _bn: <BN: 2bedd1cb3600e03c352afe530362a4b6ca34380c2e1659e12d467a066d84affa>
  },
  edition: PublicKey {
    _bn: <BN: 6f7169d6cf85f1a8dba5e784d3b2cfa64426bfc0869bad144f2d226758c0766b>
  }
}
mint => 5QBocWX648HNpMmDF2FWxikmkM8iQDe8V85MkJ7sWk1X
metadata => 3xUrsJevPXsXmtFUEv2s3Jk2wwTybFJBTKMu4AJmFGCH
edition => 8W2ZMfdvimswTZCwPZSDVJY95NkRJnw3pPtuKD4xUp6e
*/
