import Arweave from 'arweave';
import { clusterType } from '../types/arweave';

export const arweaveCluster = {
  localnet: {
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http',
  },
  testnet: {
    host: 'www.arweave.run',
    port: 443,
    protocol: 'https',
  },
  testnet_redstone: {
    host: 'testnet.redstone.tools', // Powered by RedStone Finance
    port: 443,
    protocol: 'https',
  },
  mainnet: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  },
};

export const initArweave = (cluster: clusterType) => {
  const arweave = Arweave.init({
    host: cluster.host,
    port: cluster.port,
    protocol: cluster.protocol,
  });

  return arweave;
};

/*
  args:
    arweave: Arweave.init<object>
    address: public key<string>
*/
export const airdrop = async(arweave: any, address: string) => {
  // 100_000_000_000_000 = 100 AR
  const amount = Number(100_000_000_000_000);
  await arweave.api.get('/mint/' + address + '/' + amount);

  const balance = await arweave.wallets.getBalance(address)

  console.log('Done airdrop!');
  console.log('Balance =>', balance);
};

/*
  Get Transaction URL via Arweave wallet
  args:
    arweaveApiConfig: arweave.api.config
    id: Arweave Transaction ID
  Note:
    console.log(arweave.api.config); =>
      host: "www.arweave.run"
      logger: ƒ log()
      logging: false
      port: 443
      protocol: "https"
      timeout: 20000
      [[Prototype]]: Object
*/
export const getArweaveTransactionUrl = (arweaveApiConfig: any, id: string): string => {
  const url =
    arweaveApiConfig.protocol + '://' + arweaveApiConfig.host + '/' + id;
  return url;
};
