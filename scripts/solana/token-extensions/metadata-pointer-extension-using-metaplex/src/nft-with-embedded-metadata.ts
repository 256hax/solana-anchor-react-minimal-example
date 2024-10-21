import {
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { CreateNFTInputs } from "./helpers";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  TokenMetadata,
} from "@solana/spl-token-metadata";
import {
  AuthorityType,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  createSetAuthorityInstruction,
  ExtensionType,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  getMintLen,
  getTokenMetadata,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";

export default async function createNFTWithEmbeddedMetadata(
  inputs: CreateNFTInputs,
) {
  const {
    payer,
    connection,
    tokenName,
    tokenSymbol,
    tokenUri,
    tokenAdditionalMetadata,
  } = inputs;

  // 0. Setup Mint
  const mint = Keypair.generate();
  const decimals = 0; // NFT should have 0 decimals
  const supply = 1; // NFTs should have a supply of 1

  // 1. Create the metadata object
  const metadata: TokenMetadata = {
    mint: mint.publicKey,
    name: tokenName,
    symbol: tokenSymbol,
    uri: tokenUri,
    // additionalMetadata: [['customField', 'customValue']],
    additionalMetadata: Object.entries(tokenAdditionalMetadata || []).map(
      ([key, value]) => [key, value],
    ),
  };

  // 2. Allocate the mint
  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen,
  );

  const createMintAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    lamports,
    newAccountPubkey: mint.publicKey,
    programId: TOKEN_2022_PROGRAM_ID,
    space: mintLen,
  });

  // 3. Initialize the metadata-pointer making sure that it points to the mint itself
  const initMetadataPointerInstruction =
    createInitializeMetadataPointerInstruction(
      mint.publicKey,
      payer.publicKey,
      mint.publicKey, // Metadata account - points to itself
      TOKEN_2022_PROGRAM_ID,
    );

  // 4. Initialize the mint
  const initMintInstruction = createInitializeMintInstruction(
    mint.publicKey,
    decimals,
    payer.publicKey,
    payer.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );

  // 5. Initialize the metadata inside the mint
  const initMetadataInstruction = createInitializeInstruction({
    programId: TOKEN_2022_PROGRAM_ID,
    mint: mint.publicKey,
    metadata: mint.publicKey,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    mintAuthority: payer.publicKey,
    updateAuthority: payer.publicKey,
  });

  // 6. Set the additional metadata in the mint
  const setExtraMetadataInstructions: TransactionInstruction[] = [];

  for (const attributes of Object.entries(tokenAdditionalMetadata || [])) {
    setExtraMetadataInstructions.push(
      createUpdateFieldInstruction({
        updateAuthority: payer.publicKey,
        metadata: mint.publicKey,
        field: attributes[0],
        value: attributes[1],
        programId: TOKEN_2022_PROGRAM_ID,
      }),
    );
  }

  // 7. Create the associated token account and mint the NFT to it and remove the mint authority
  const ata = await getAssociatedTokenAddress(
    mint.publicKey,
    payer.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID,
  );
  const createATAInstruction = createAssociatedTokenAccountInstruction(
    payer.publicKey,
    ata,
    payer.publicKey,
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
  );

  const mintInstruction = createMintToCheckedInstruction(
    mint.publicKey,
    ata,
    payer.publicKey,
    supply, // NFTs should have a supply of one
    decimals,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  // NFTs should have no mint authority so no one can mint any more of the same NFT
  const setMintTokenAuthorityInstruction = createSetAuthorityInstruction(
    mint.publicKey,
    payer.publicKey,
    AuthorityType.MintTokens,
    null,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  // 8. Put all of that in one transaction and send it to the network.
  const transaction = new Transaction().add(
    createMintAccountInstruction,
    initMetadataPointerInstruction,
    initMintInstruction,
    initMetadataInstruction,
    ...setExtraMetadataInstructions,
    createATAInstruction,
    mintInstruction,
    setMintTokenAuthorityInstruction,
  );
  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, mint],
  );

  // 9. fetch and print the token account, the mint account, an the metadata to make sure that it is working correctly.
  // Fetching the account
  const accountDetails = await getAccount(
    connection,
    ata,
    "finalized",
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("Associate Token Account =====>", accountDetails);

  // Fetching the mint
  const mintDetails = await getMint(
    connection,
    mint.publicKey,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("Mint =====>", mintDetails);

  // Since the mint stores the metadata in itself, we can just get it like this
  const onChainMetadata = await getTokenMetadata(connection, mint.publicKey);
  // Now we can see the metadata coming with the mint
  console.log("onchain metadata =====>", onChainMetadata);

  // And we can even get the offchain json now
  if (onChainMetadata?.uri) {
    try {
      const response = await fetch(onChainMetadata.uri);
      const offChainMetadata = await response.json();
      console.log("Mint offchain metadata =====>", offChainMetadata);
    } catch (error) {
      console.error("Error fetching or parsing offchain metadata:", error);
    }
  }
}