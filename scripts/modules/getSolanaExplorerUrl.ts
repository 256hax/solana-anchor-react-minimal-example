export const main = (rpc: string, address: string) => {
  const baseUrl = 'https://explorer.solana.com/address/';

  switch(rpc) {
    case 'Devnet': {
      const url = baseUrl + address + '?cluster=devnet';
      return url;
    }
    case 'Testnet': {
      const url = baseUrl + address + '?cluster=testnet';
      return url;
    }
    case 'Mainnet-Beta': {
      const url = baseUrl + address;
      return url
    }
  }
};

console.log(main('Devnet', '5iqm5u2KQ2nGP2wnpFh5RaHKCd2toS8umopq7Dt2UbhZ'));
console.log(main('Mainnet-Beta', 'CCyPKVS2DJzkQMN6A518NP43Nsdqx9KeaY5JNp4WzbWD'));