// Source: https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/create_mint_and_transfer_tokens.ts
import { clusterApiUrl, Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
// @ts-ignore
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
// import { actions, NodeWallet } from '@metaplex/js';
import { transferNftType } from '../types/solana';
// import { airdrop } from '../helpers/solana';

export const transferNft: transferNftType = async(connection, keypair, mintNftAddress) => {
  const fromWallet = keypair;
  const toWallet = Keypair.generate();
  const mint = new PublicKey(mintNftAddress);

  // airdrop(connection, fromWallet.publicKey);

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet.publicKey
  );

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );

  const signature_tx = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    1,
    []
  );

  //
  // or you can use following instead transfer function.
  // Don't forget import @metaplex/js.
  //
  // const signature_tx = await actions.sendToken({
  //   connection: connection,
  //   wallet: new NodeWallet(fromWallet), // Use Metaplex NodeWallet
  //   source: fromTokenAccount.address,
  //   destination: toWallet.publicKey, // Not TokenAccount here
  //   mint: mint,
  //   amount: 1,
  // });

  console.log('fromWallet.publicKey     =>', fromWallet.publicKey.toString());
  console.log('toWallet.publicKey       =>', toWallet.publicKey.toString());
  console.log('fromTokenAccount.address =>', fromTokenAccount.address.toString());
  console.log('toTokenAccount.address   =>', toTokenAccount.address.toString());
  console.log('mint address             =>', mint.toString());
  console.log('transfer tx              =>', signature_tx);
};
