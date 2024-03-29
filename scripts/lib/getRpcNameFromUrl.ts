// Get RPC Name
// 
// Args:
//  connectionRpc: RPC URL(Connection.rpcEndpoint from @solana/web3.js)
// Return:
//  RPC Name: string
import { Connection, clusterApiUrl } from "@solana/web3.js";

export const getRpcNameFromUrl = (
  connectionRpc: any
): (string | undefined) => {
  const devnet = 'https://api.devnet.solana.com';
  const testnet = 'https://api.testnet.solana.com';
  const mainnetBeta = 'https://api.mainnet-beta.solana.com/'; // It need slash end of the URL.

  switch(connectionRpc) {
    case devnet: {
      return 'Devnet';
    }
    case testnet: {
      return 'Testnet';
    }
    case mainnetBeta: {
      return 'Mainnet-Beta';
    }
  }
}

export const main = () =>{
  let connection: Connection;
  let rpc: any;

  connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  rpc = getRpcNameFromUrl(connection.rpcEndpoint);
  console.log(rpc);

  connection = new Connection(clusterApiUrl('testnet'), 'confirmed');
  rpc = getRpcNameFromUrl(connection.rpcEndpoint);
  console.log(rpc);

  connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  rpc = getRpcNameFromUrl(connection.rpcEndpoint);
  console.log(rpc);
}

main();