// Ref: https://github.com/metaplex-foundation/js#create
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  mockStorage,
  toBigNumber,
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
  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
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
  // The mint needs to sign the transaction, so we generate a new keypair for it
  const mintKeypair = Keypair.generate();
  console.log('mintKeypair.publicKey =>', mintKeypair.publicKey.toString());

  // Create a transaction builder to create the NFT
  // Ref: builders: https://metaplex-foundation.github.io/js/classes/js.NftClient.html#builders
  const transactionBuilder = await metaplex
    .nfts()
    .builders()
    .create({
      uri: 'https://arweave.net/W-20MpV-N1l6e_vxWxjmGfFnGkiiUDn7GJAsgYmJ6fU',
      name: 'My NFT',
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
      useNewMint: mintKeypair, // we pass our mint in as the new mint to use
    });

  // Convert to transaction
  const latestBlockhash = await connection.getLatestBlockhash()
  const transaction = await transactionBuilder.toTransaction(latestBlockhash)

  console.log('wallet.publicKey =>', wallet.publicKey.toString());

  // Partially sign the transaction, as the shop and the mint
  // The account is also a required signer, but they'll sign it with their wallet after we return it
  // transaction.partialSign(wallet);
  transaction.sign(wallet);

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet, mintKeypair]
  );
  console.log('signature =>', signature);
};

main();
/*
% ts-node <THIS FILE>
mintKeypair.publicKey => 7bF3M1Eb3Bb2bnuCF8Ce4Q889Lm5tsx57QjFdAFM7oFb
wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
signature => 4Bjm4dSksjMg7APHVYKbDFAA3abpKTkqUercpdmcPKX8ZkdCdpSQhzQUmVGm219KFqCzkEu4s3ac1ou2QkENSHhU
*/