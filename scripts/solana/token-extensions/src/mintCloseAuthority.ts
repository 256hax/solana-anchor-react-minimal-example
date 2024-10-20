// Docs: https://spl.solana.com/token-2022/extensions#mint-close-authority
import {
  closeAccount,
  createInitializeMintInstruction,
  createInitializeMintCloseAuthorityInstruction,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

(async () => {
  const payer = Keypair.generate();

  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const mintAuthority = Keypair.generate();
  const freezeAuthority = Keypair.generate();
  const closeAuthority = Keypair.generate();

  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

  const extensions = [ExtensionType.MintCloseAuthority];
  const mintLen = getMintLen(extensions);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMintCloseAuthorityInstruction(mint, closeAuthority.publicKey, TOKEN_2022_PROGRAM_ID),
    createInitializeMintInstruction(
      mint,
      9,
      mintAuthority.publicKey,
      freezeAuthority.publicKey,
      TOKEN_2022_PROGRAM_ID
    )
  );
  const signature = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair], undefined);
  console.log('signature =>', signature);
})();