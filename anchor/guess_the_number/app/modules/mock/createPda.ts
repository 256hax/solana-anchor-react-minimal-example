import { utils } from '@project-serum/anchor';
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, setAuthority, getAccount } from '@solana/spl-token';

export const createPda = async(
  connection: any,
  program: any,
  taker: Keypair,
  mint: PublicKey,
  pdaSeed: string,
) => {
  const takerPublicKeyString = taker.publicKey.toString();

  let answer: string;
  switch(takerPublicKeyString) {
    case 'BBCkTVFxZbLPar5YpjqBzymPkcZvT7RMuDK59bbaPTd4':
      answer = 'Number 1';
      break;
    case 'DD83TEq47JeMKKrJqQWzabVmYkQfsof8CHsybQtGJvpo':
      answer = 'Number 2';
      break;
  }

  const takerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    taker, // payer
    mint, // mint address
    taker.publicKey // owner
  );

  const [userAnswersPDA, bump] = await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode(pdaSeed),
      taker.publicKey.toBuffer(),
      mint.toBuffer(),
    ],
    program.programId
  );

  const signature = await program.methods
    .createUserAnswers(
      takerTokenAccount.address,
      mint, // taker's token account(NFT)
      answer, // taker's answer
      bump // bump of PDA
    )
    .accounts({
      user: taker.publicKey,
      mint: mint,
      userAnswers: userAnswersPDA,
    })
    .signers([taker])
    .rpc()

  const fetchUserAnswers = await program.account.userAnswers.fetch(userAnswersPDA);

  return [signature, fetchUserAnswers, takerTokenAccount]
};