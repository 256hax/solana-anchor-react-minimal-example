// Ref: https://solanacookbook.com/references/accounts.html#how-to-create-a-system-account
import {
  SystemProgram,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  CreateAccountParams,
} from '@solana/web3.js';

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
  const createAccountParams: CreateAccountParams = {
    fromPubkey: from.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: rentExemptionAmount,
    space: space,
    programId: SystemProgram.programId,
  };

  let transaction = new Transaction();
  // Ref: https://solana-labs.github.io/solana-web3.js/classes/SystemProgram.html#createAccount
  transaction.add(
    SystemProgram.createAccount(createAccountParams)
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
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
from => DiYgDq9Wz1c5ZzeVYEUdNe6RjXvUp2ztAkqVfU5wghau
newAccountPubkey => 4dL4QCzVQb9tkkBA33quboHQm78A9XMd8Beg54a2hWf2
rentExemptionAmount => 0.00158688 SOL
signature => 5UyQ5gwgCMCbdPvt1VtLtNJ3qXJH2YKR7kak8wUme7q2xQsXyxZyWxvEYaWqzRG1iiQGxZKqBRTgJHeUfuwpKt2Z
*/

/*
Solana Explorer =>
  System Program: Create Account
  Program: System Program
  From Address: DiYgDq9Wz1c5ZzeVYEUdNe6RjXvUp2ztAkqVfU5wghau
  New Address: 4dL4QCzVQb9tkkBA33quboHQm78A9XMd8Beg54a2hWf2
  Transfer Amount (SOL): ◎0.00158688
  Allocated Data Size: 100 byte(s)
  Assigned Program Id: System Program
*/