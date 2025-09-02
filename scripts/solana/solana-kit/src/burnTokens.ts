import {
  airdropFactory,
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  lamports,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';
import { getCreateAccountInstruction } from '@solana-program/system';
import {
  getCreateAssociatedTokenInstructionAsync,
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
  getMintToInstruction,
  getBurnCheckedInstruction,
  fetchToken,
} from '@solana-program/token';

// Create Connection, local validator in this example
const rpc = createSolanaRpc('http://localhost:8899');
const rpcSubscriptions = createSolanaRpcSubscriptions('ws://localhost:8900');

// Generate keypairs for fee payer (also serves as mint authority)
const feePayer = await generateKeyPairSigner();
// Generate keypair for mint authority (separate from feePayer)
const mintAuthority = await generateKeyPairSigner();

// Fund fee payer
await airdropFactory({ rpc, rpcSubscriptions })({
  recipientAddress: feePayer.address,
  lamports: lamports(1_000_000_000n),
  commitment: 'confirmed',
});

// Generate keypair to use as address of mint
const mint = await generateKeyPairSigner();

// Get default mint account size (in bytes), no extensions enabled
const space = BigInt(getMintSize());

// Get minimum balance for rent exemption
const rent = await rpc.getMinimumBalanceForRentExemption(space).send();

// Get latest blockhash to include in transaction
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

// Instruction to create new account for mint (token program)
// Invokes the system program
const createAccountInstruction = getCreateAccountInstruction({
  payer: feePayer,
  newAccount: mint,
  lamports: rent,
  space,
  programAddress: TOKEN_PROGRAM_ADDRESS,
});

// Instruction to initialize mint account data
// Invokes the token program
const initializeMintInstruction = getInitializeMintInstruction({
  mint: mint.address,
  decimals: 9,
  mintAuthority: mintAuthority.address,
});

// Use findAssociatedTokenPda to derive the ATA address
const [associatedTokenAddress] = await findAssociatedTokenPda({
  mint: mint.address,
  owner: feePayer.address,
  tokenProgram: TOKEN_PROGRAM_ADDRESS,
});

// Create instruction to create the associated token account
const createAtaInstruction = await getCreateAssociatedTokenInstructionAsync({
  payer: feePayer,
  mint: mint.address,
  owner: feePayer.address,
});

// Create instruction to mint tokens
const mintToInstruction = getMintToInstruction({
  mint: mint.address,
  token: associatedTokenAddress,
  mintAuthority: mintAuthority, // Pass the signer, not just the address
  amount: 1000_000_000_000n, // 1000.0 tokens with 9 decimals
});

const instructions = [
  createAccountInstruction,
  initializeMintInstruction,
  createAtaInstruction,
  mintToInstruction,
];

// Create transaction message
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions(instructions, tx)
);

// Sign transaction message with all required signers
const signedTransaction = await signTransactionMessageWithSigners(
  transactionMessage
);

// Send and confirm transaction
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedTransaction,
  { commitment: 'confirmed' }
);

// Get transaction signature
const transactionSignature = getSignatureFromTransaction(signedTransaction);

console.log('Mint Address:', mint.address.toString());
console.log(
  'Associated Token Account Address:',
  associatedTokenAddress.toString()
);
console.log('Transaction Signature:', transactionSignature);
console.log('Successfully minted 1000.0 tokens');

// Fetch token account to check balance before burn
const tokenAccountBefore = await fetchToken(rpc, associatedTokenAddress);
console.log(
  '\nToken balance before burn:',
  tokenAccountBefore.data.amount / 10n ** 9n,
  'tokens'
);

// Get a fresh blockhash for the burn transaction
const { value: burnBlockhash } = await rpc.getLatestBlockhash().send();

// Create instruction to burn tokens
const burnInstruction = getBurnCheckedInstruction({
  account: associatedTokenAddress,
  mint: mint.address,
  authority: feePayer.address,
  amount: 10_000_000_000n, // 10.0 tokens with 9 decimals
  decimals: 9,
});

// Create transaction message for burning
const burnTxMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(burnBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([burnInstruction], tx)
);

// Sign transaction message with all required signers
const signedBurnTx = await signTransactionMessageWithSigners(burnTxMessage);

// Send and confirm transaction
await sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions })(
  signedBurnTx,
  { commitment: 'confirmed' }
);

// Get transaction signature
const transactionSignature2 = getSignatureFromTransaction(signedBurnTx);

// Fetch token account to check balance after burn
const tokenAccountAfter = await fetchToken(rpc, associatedTokenAddress);
console.log(
  'Token balance after burn:',
  tokenAccountAfter.data.amount / 10n ** 9n,
  'tokens'
);

console.log('\nSuccessfully burned 10.0 tokens');
console.log('Transaction Signature:', transactionSignature2);

/*
Mint Address: Cip5MzTSWax9LjpCHPKK5ske9FBz3NBUNtSHzgpUetfj
Associated Token Account Address: FAZCjwvkQLT1SSN77Wz61s293txz6CuBT3daTTT84aCS
Transaction Signature: 2TAU8KGSFZNXv74gBem47KU7JZTavYvSEdySt7RfAm1vYRdFvkDacQKY1HjhEGJRK3ForGpSFstDfqo4RFQcDawq
Successfully minted 1000.0 tokens

Token balance before burn: 1000n tokens
Token balance after burn: 990n tokens

Successfully burned 10.0 tokens
Transaction Signature: tUsDUpRsPUGWReGtCVUrymSa9bKFuMWgV381Ltc9Bk8pwxcmYooDNUKz6C478CG7KAiJVh4PVyNdmXJVff7cdXQ
*/
