import { utils } from '@project-serum/anchor';
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const setAnswerCreatePda = async(
  connection: any,
  program: any,
  taker: Keypair,
  mint: PublicKey,
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

  const [userAnswersPDA, _] = await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode('user-answers'),
      taker.publicKey.toBuffer(),
    ],
    program.programId
  );

  const signaturePda = await program.methods
    .createUserAnswers(takerTokenAccount.address, answer)
    .accounts({
      user: taker.publicKey,
      userAnswers: userAnswersPDA,
    })
    .signers([taker])
    .rpc()

  const fetchUserAnswers = await program.account.userAnswers.fetch(userAnswersPDA);

  return [signaturePda, fetchUserAnswers]
};