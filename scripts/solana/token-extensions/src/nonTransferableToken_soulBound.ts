// Docs: https://spl.solana.com/token-2022/extensions#non-transferable-tokens
import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createInitializeNonTransferableMintInstruction,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

(async () => {
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const payer = Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
  await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

  const mintAuthority = Keypair.generate();
  const decimals = 9;

  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  const mintLen = getMintLen([ExtensionType.NonTransferable]);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeNonTransferableMintInstruction(mint, TOKEN_2022_PROGRAM_ID),
    createInitializeMintInstruction(mint, decimals, mintAuthority.publicKey, null, TOKEN_2022_PROGRAM_ID)
  );
  const signature = await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair], undefined);
  console.log('signature =>', signature);
})();