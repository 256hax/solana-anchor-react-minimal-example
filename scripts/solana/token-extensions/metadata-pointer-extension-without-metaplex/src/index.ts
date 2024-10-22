import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  getMint,
  getMetadataPointerState,
  getTokenMetadata,
  TYPE_SIZE,
  LENGTH_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from '@solana/spl-token';
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  createRemoveKeyInstruction,
  pack,
  TokenMetadata,
} from '@solana/spl-token-metadata';
import dotenv from 'dotenv';
dotenv.config();

// Payer
const payerSecretKey = process.env.PAYER_SECRET_KEY;
if (!payerSecretKey) throw new Error('payerSecretKey not found.');
const secretKey = Uint8Array.from(JSON.parse(payerSecretKey));
const payer = Keypair.fromSecretKey(secretKey);

// Connection to devnet cluster
const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
// const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

let transaction: Transaction;
let transactionSignature: string;

const mintKeypair = Keypair.generate();
const mint = mintKeypair.publicKey;
const decimals = 2;
const mintAuthority = payer.publicKey;
const updateAuthority = payer.publicKey;

// Metadata to store in Mint Account
const metaData: TokenMetadata = {
  updateAuthority: updateAuthority,
  mint: mint,
  name: 'OPOS',
  symbol: 'OPOS',
  uri: 'https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json',
  additionalMetadata: [['description', 'Only Possible On Solana']],
};

// Size of MetadataExtension 2 bytes for type, 2 bytes for length
const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
// Size of metadata
const metadataLen = pack(metaData).length;

// Size of Mint Account with extension
const mintLen = getMintLen([ExtensionType.MetadataPointer]);

// Minimum lamports required for Mint Account
const lamports = await connection.getMinimumBalanceForRentExemption(
  mintLen + metadataExtension + metadataLen
);

// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
  newAccountPubkey: mint, // Address of the account to create
  space: mintLen, // Amount of bytes to allocate to the created account
  lamports, // Amount of lamports transferred to created account
  programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
});

// Instruction to initialize the MetadataPointer Extension
const initializeMetadataPointerInstruction =
  createInitializeMetadataPointerInstruction(
    mint, // Mint Account address
    updateAuthority, // Authority that can set the metadata address
    mint, // Account address that holds the metadata
    TOKEN_2022_PROGRAM_ID
  );

// Instruction to initialize Mint Account data
const initializeMintInstruction = createInitializeMintInstruction(
  mint, // Mint Account Address
  decimals, // Decimals of Mint
  mintAuthority, // Designated Mint Authority
  null, // Optional Freeze Authority
  TOKEN_2022_PROGRAM_ID // Token Extension Program ID
);

// Instruction to initialize Metadata Account data
const initializeMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  metadata: mint, // Account address that holds the metadata
  updateAuthority: updateAuthority, // Authority that can update the metadata
  mint: mint, // Mint Account address
  mintAuthority: mintAuthority, // Designated Mint Authority
  name: metaData.name,
  symbol: metaData.symbol,
  uri: metaData.uri,
});

// Instruction to update metadata, adding custom field
const updateFieldInstruction = createUpdateFieldInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  metadata: mint, // Account address that holds the metadata
  updateAuthority: updateAuthority, // Authority that can update the metadata
  field: metaData.additionalMetadata[0][0], // key
  value: metaData.additionalMetadata[0][1], // value
});

// Add instructions to new transaction
transaction = new Transaction().add(
  createAccountInstruction,
  initializeMetadataPointerInstruction,
  initializeMintInstruction,
  initializeMetadataInstruction,
  updateFieldInstruction
);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, mintKeypair] // Signers
);

console.log('Transaction Signature =>' ,transactionSignature);

// Retrieve mint information
const mintInfo = await getMint(
  connection,
  mint,
  'confirmed',
  TOKEN_2022_PROGRAM_ID
);

// Retrieve and log the metadata pointer state
const metadataPointer = getMetadataPointerState(mintInfo);
console.log('Metadata Pointer =>', JSON.stringify(metadataPointer, null, 2));

// Retrieve and log the metadata state
const metadata = await getTokenMetadata(
  connection,
  mint // Mint Account address
);
console.log('Metadata =>', JSON.stringify(metadata, null, 2));

// Instruction to remove a key from the metadata
const removeKeyInstruction = createRemoveKeyInstruction({
  programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
  metadata: mint, // Address of the metadata
  updateAuthority: updateAuthority, // Authority that can update the metadata
  key: metaData.additionalMetadata[0][0], // Key to remove from the metadata
  idempotent: true, // If the idempotent flag is set to true, then the instruction will not error if the key does not exist
});

// Add instruction to new transaction
transaction = new Transaction().add(removeKeyInstruction);

// Send transaction
transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer]
);

console.log('Remove Additional Metadata Field Transaction Signature =>', transactionSignature);

// Retrieve and log the metadata state
const updatedMetadata = await getTokenMetadata(
  connection,
  mint // Mint Account address
);
console.log('Updated Metadata =>', JSON.stringify(updatedMetadata, null, 2));

console.log('Mint Account =>', mint.toString());

const associatedTokenAccount = await getAssociatedTokenAddress(
  mint,
  payer.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
);

console.log('Associated Token Account =>', associatedTokenAccount.toString());

const destinationTokenAccount = await createAssociatedTokenAccountInstruction(
  payer.publicKey, // Payer to create Token Account
  associatedTokenAccount, // Token Account owner
  payer.publicKey,
  mint, // Mint Account address
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

const mintToInstruction = await createMintToInstruction(
  new PublicKey(mint), // Mint Account address
  associatedTokenAccount, // Destination address
  mintAuthority, // Mint token authority
  100, // Amount (100 for 2 decimal place mint = 1.00 tokens)
  undefined, // Signers if multisig
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

transaction = new Transaction().add(
  destinationTokenAccount, mintToInstruction);

transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer]
);

console.log('Mint Signature =>', transactionSignature.toString());
