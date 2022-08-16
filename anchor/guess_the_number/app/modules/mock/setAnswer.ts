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
    ],
    program.programId
  );

  const signature = await program.methods
    .createUserAnswers(
      takerTokenAccount.address, // taker's token account(NFT)
      answer, // taker's answer
      bump // bump of PDA
    )
    .accounts({
      user: taker.publicKey,
      userAnswers: userAnswersPDA,
    })
    .signers([taker])
    .rpc()

  const fetchUserAnswers = await program.account.userAnswers.fetch(userAnswersPDA);
  const tokenAccountInfo = await getAccount(connection, fetchUserAnswers.tokenAccount);

  return [signature, fetchUserAnswers, takerTokenAccount]
};


export const setAuthorityEscrow = async(
  connection: any,
  program: any,
  taker: Keypair,
  payerPublicKey: PublicKey,
  pdaSeed: string,
) => {
  const [userAnswersPDA, _] = await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode(pdaSeed),
      taker.publicKey.toBuffer(),
    ],
    program.programId
  );

  const fetchUserAnswers = await program.account.userAnswers.fetch(userAnswersPDA);

  const signature = await setAuthority(
    connection, // connection
    taker, // payer
    fetchUserAnswers.tokenAccount, // account
    taker.publicKey, // currentAuthority
    2, // authorityType. MintTokens = 0, FreezeAccount = 1, AccountOwner = 2, CloseAccount = 3
    payerPublicKey, // newAuthority
    [taker], // multiSigners
    {}, // (Optional) confirmOptions
    TOKEN_PROGRAM_ID, // ProgramId
  );

  const tokenAccountInfo = await getAccount(connection, fetchUserAnswers.tokenAccount);

  return [signature, tokenAccountInfo];
};