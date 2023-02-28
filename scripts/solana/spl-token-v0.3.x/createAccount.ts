// Ref: https://solanacookbook.com/references/accounts.html#how-to-create-a-system-account
import {
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // ------------------------------------------------------------------------
  //  Create Account
  // ------------------------------------------------------------------------
  const from = Keypair.generate();

  // ------------------------------------------------------------------------
  //  Airdrop
  // ------------------------------------------------------------------------
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdropAlice = await connection.requestAirdrop(from.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdropAlice,
  });

  // ------------------------------------------------------------------------
  //  Create System Account
  // ------------------------------------------------------------------------
  // amount of space to reserve for the account
  const space = 0;

  // Seed the created account with lamports for rent exemption
  const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);

  const newAccount = Keypair.generate();
  const createAccountParams = {
    fromPubkey: from.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: rentExemptionAmount,
    space,
    programId: SystemProgram.programId,
  };

  const createAccountTransaction = new Transaction().add(
    SystemProgram.createAccount(createAccountParams)
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    createAccountTransaction,
    [from, newAccount]
  );

  console.log('from =>', from.publicKey.toString());
  console.log('newAccountPubkey =>', newAccount.publicKey.toString());
  console.log('rentExemptionAmount =>', rentExemptionAmount / LAMPORTS_PER_SOL, 'SOL');
  console.log('signature =>', signature);
};

main();

/*
% ts-node <THIS FILE>
from => 7T9vSZ2W6BWrc2VPHMyGMaC932fcw4Ghia3YAXBE5369
newAccountPubkey => HuxicXJYS5PKZrWa42rUhrNW7N2B6w9h6bkSzYCaGyq9
rentExemptionAmount => 0.00089088 SOL
signature => 3TzUTV4AMQtZh2vfwyqEN4W82jxtexQE1sBHMZyNiWP8yUXYx2fU89PVRTKt3Vmzg5tyfhsMwNoBQ9Re7rBkWFiB
*/