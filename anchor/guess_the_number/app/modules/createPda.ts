import { utils } from '@project-serum/anchor';
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, setAuthority, getAccount } from '@solana/spl-token';
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";

export const createPda = async(
  metaplex: Metaplex,
  connection: any,
  program: any,
  taker: Keypair,
  mint: PublicKey,
  pdaSeed: string,
): Promise<[String, any, PublicKey]> => {
  const nft = await metaplex.nfts().findByMint(mint).run();

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
      nft.name, // taker's answer
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

  return [signature, fetchUserAnswers, takerTokenAccount.address];
};