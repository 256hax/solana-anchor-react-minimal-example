export const main = (rpc: string, address: string) => {
  const baseUrl = 'https://solana.fm/address/';

  switch(rpc) {
    case 'Devnet': {
      const url = baseUrl + address + '?cluster=devnet-qn1';
      return url;
    }
    case 'Testnet': {
      const url = baseUrl + address + '?cluster=testnet-qn1';
      return url;
    }
    case 'Mainnet-Beta': {
      const url = baseUrl + address + '?cluster=mainnet-qn1';
      return url
    }
  }
};

console.log(main('Devnet', '5iqm5u2KQ2nGP2wnpFh5RaHKCd2toS8umopq7Dt2UbhZ'));
console.log(main('Mainnet-Beta', 'XtBt31GCF5enFg7YG1YkH33Y5w1SruGMcz7GttUVUpH'));