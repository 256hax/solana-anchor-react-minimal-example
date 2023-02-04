// Ref: https://github.com/metaplex-foundation/js#create
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  mockStorage,
  toBigNumber,
  token,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as fs from 'fs';

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('src/assets/id.json', 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);

  const taker = Keypair.generate();

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  // const wallet = Keypair.generate();

  // let airdropSignature = await connection.requestAirdrop(
  //   wallet.publicKey,
  //   LAMPORTS_PER_SOL,
  // );

  // const latestBlockHash = await connection.getLatestBlockhash();

  // await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature: airdropSignature,
  // });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);

  // ------------------------------------
  //  Make Metaplex
  // ------------------------------------
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // ------------------------------------
  //  Mint NFT
  // ------------------------------------
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: "Normarl NFT Metadata",
      description: "Normal description",
      image: "https://placekitten.com/200/300",
      symbol: "paper",
    });

  // Ref: The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: "Normarl NFT",
      symbol: "paper",
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      // maxSupply: toBigNumber(1),
      maxSupply: toBigNumber(0),
      tokenOwner: wallet.publicKey,
      updateAuthority: wallet,
      creators: [],
    });

  // ------------------------------------
  //  Transfer NFT
  // ------------------------------------
  // Important:
  //  Rmoved send method from @metaplex-foundation/js v0.18.0.
  //  You should not use send method.
  // Ref: https://metaplex-foundation.github.io/js/classes/js.NftClient.html#send
  const signature = await metaplex
    .nfts()
    .send({
      mintAddress: nft.address,
      toOwner: taker.publicKey,
      amount: token(1),
    });

  console.log('wallet.publicKey =>', wallet.publicKey.toString());
  console.log('taker.publicKey =>', taker.publicKey.toString());
  console.log('nft.address =>', nft.address.toString());
  console.log('signature =>', signature);
};

main();
/*
% ts-node <THIS FILE>
wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
taker.publicKey => 7K8uS9LJCAmQGjMCj1Eph2TBP7xTDfYvbPp6MvkPL4pX
nft.address => 32oAzxxVLWQUbfEcF145EAVtNmnK9XC3TmMXFNPf2kFw
signature => {
  response: {
    signature: '5YzGpoN2tcivWSD9Po2GPbxjCxayBBHZxqWcVMmekFdeCvMB7C2w9cA253BCwgzghMDLib3XCHzW2ES6SKAiUL5E',
    confirmResponse: { context: [Object], value: [Object] },
    blockhash: 'BNR7APiWzGkrjwcQBeGh7n61Tr8Qs3Em7BVcF3CaarKX',
    lastValidBlockHeight: 182190783
  }
}
*/