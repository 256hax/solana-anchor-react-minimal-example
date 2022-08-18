import { utils } from '@project-serum/anchor';
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, setAuthority, getAccount } from '@solana/spl-token';

export const setAuthorityEscrow = async(
  connection: any,
  program: any,
  taker: Keypair,
  mint: PublicKey,
  payerPublicKey: PublicKey,
  pdaSeed: string,
) => {
  const [userAnswersPDA, _] = await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode(pdaSeed),
      taker.publicKey.toBuffer(),
      mint.toBuffer(),
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