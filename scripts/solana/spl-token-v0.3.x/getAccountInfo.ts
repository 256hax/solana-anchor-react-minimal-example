import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export const main = async () => {
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const myWallet = new PublicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg'); // My Wallet
  const mint = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'); // USD Coin Dev
  const randomWallet = Keypair.generate().publicKey;

  const infoMyWallet = await connection.getAccountInfo(myWallet);
  const infoMint = await connection.getAccountInfo(mint);
  const infoRandomWallet = await connection.getAccountInfo(randomWallet);

  console.log('infoMyWallet =>', infoMyWallet);
  console.log('infoMint =>', infoMint);
  console.log("infoRandomWallet(It'll be null if you never use wallet) =>", infoRandomWallet);
};

main();

/*
% ts-node <THIS FILE>
infoMyWallet => {
  data: <Buffer >,
  executable: false,
  lamports: 20698278649,
  owner: PublicKey { _bn: <BN: 0> },
  rentEpoch: 371
}
infoMint => {
  data: <Buffer 01 00 00 00 e9 28 39 55 09 65 ff d4 d6 4a ca af 46 d4 5d f7 31 8e 5b 4f 57 c9 0c 48 7d 60 62 5d 82 9b 83 7b c3 08 97 fa 01 71 59 12 06 01 00 00 00 00 ... 32 more bytes>,
  executable: false,
  lamports: 27003456600,
  owner: PublicKey {
    _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
  },
  rentEpoch: 371
}
infoRandomWallet(It'll be null if you never use wallet) => null
*/