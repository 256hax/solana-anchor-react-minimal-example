// Source: https://github.com/solana-labs/solana-program-library/blob/895747f29fd38fc61961ffc1bc5c73dab57bba1a/token/js/examples/create_mint_and_transfer_tokens.ts
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
  getMint,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

export const main = async() => {
  // Connect to cluster
  let connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

  let latestBlockHash = await connection.getLatestBlockhash();

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: fromAirdropSignature,
  });

  // Generate a new wallet to receive newly minted token
  const toWallet = Keypair.generate();
  const randomWallet = Keypair.generate();

  // Create new token mint
  const mint = await createMint(
    connection, // connection
    fromWallet, // payer
    fromWallet.publicKey, // mintAuthority
    null, // freezeAuthority
    9, // decimals
    undefined, // keypair(it will be mint address). undefined: generate random keypair
    {}, // confirmOptions
    TOKEN_PROGRAM_ID, // programId
  );

  // Get the token account of the fromWallet address, and if it does not exist, create it
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    fromWallet, // payer
    mint, // mint
    fromWallet.publicKey, // owner
    false, // allowOwnerOffCurve
    'confirmed', // commitment
    {}, // confirmOptions
    TOKEN_PROGRAM_ID, // programId
    ASSOCIATED_TOKEN_PROGRAM_ID, // associatedTokenProgramId
  );

  // Get the token account of the toWallet address, and if it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection, // connection
    fromWallet, // payer
    mint, // mint
    toWallet.publicKey, // owner
    false, // allowOwnerOffCurve
    'confirmed', // commitment
    {}, // confirmOptions
    TOKEN_PROGRAM_ID, // programId
    ASSOCIATED_TOKEN_PROGRAM_ID, // associatedTokenProgramId
  );

  // Mint 1 new token to the "fromTokenAccount" account we just created
  const signature_mint = await mintTo(
    connection, // connection
    fromWallet, // payer
    mint, // mint
    fromTokenAccount.address, // destination
    fromWallet.publicKey, // authority
    1000000000, // amount
    [], // multiSigners
    {}, // confirmOptions
    TOKEN_PROGRAM_ID, // programId
  );

  const accountInfo = await getAccount(connection, fromTokenAccount.address);
  const mintInfo = await getMint(connection, mint);

  console.log('fromWallet.publicKey     =>', fromWallet.publicKey.toString());
  console.log('toWallet.publicKey       =>', toWallet.publicKey.toString());
  console.log('fromTokenAccount.address =>', fromTokenAccount.address.toString());
  console.log('toTokenAccount.address   =>', toTokenAccount.address.toString());
  console.log('mint address             =>', mint.toString());
  console.log('mint tx                  =>', signature_mint);

  console.log('\n--- Get Account/Mint Info ----------------------------------------');
  console.log('accountInfo              =>', accountInfo);
  console.log('mintInfo                 =>', mintInfo);
};

main();

/*
% ts-node <THIS FILE>
fromWallet.publicKey     => E8ruGTpYznxpDYN1NkJGhu1AqFdLMDdBHfgwkLAEDbgQ
toWallet.publicKey       => Autv5u8xDR5HE5eQvVUaB7EK5tYgEXGhSqTEs2ekbtMc
fromTokenAccount.address => 87i6GeegZipqEgKu5VVUHCCnhoZiQupSANGvtaXMGHQK
toTokenAccount.address   => 2zrGKH8G18RtDdHKESeQmuNwVbBtxTyUPUXT4yPAkRJg
mint address             => 4pBgXj5toMJuQtaoDucK2kNxuQkgF9faTTw5fwrS4rDq
mint tx                  => 5wK51k27m6kL61oGwTdDxc7LpUzD3zadNnhxue3DJqWQTJd4fzAGRx9UMukTN3XEbnsdSN4Fb2piqwgCBT2t6GNB

--- Get Account/Mint Info ----------------------------------------
accountInfo              => {
  address: PublicKey {
    _bn: <BN: e6a95c94ba16def4088856c11a96dae5cd01434b3ff04bd2a175362fc29862c3>
  },
  mint: PublicKey {
    _bn: <BN: 45b4be0c479e9f903a66484d1f2f385b1fdff5a12793dd4f4cdac7322398d75a>
  },
  owner: PublicKey {
    _bn: <BN: ff025d036017797f6fbd200ba3682bd4ac881efbf9f41e6cfe68d8248c57c466>
  },
  amount: 1000000000n,
  delegate: null,
  delegatedAmount: 0n,
  isInitialized: true,
  isFrozen: false,
  isNative: false,
  rentExemptReserve: null,
  closeAuthority: null
}
mintInfo                 => {
  address: PublicKey {
    _bn: <BN: 45b4be0c479e9f903a66484d1f2f385b1fdff5a12793dd4f4cdac7322398d75a>
  },
  mintAuthority: PublicKey {
    _bn: <BN: ff025d036017797f6fbd200ba3682bd4ac881efbf9f41e6cfe68d8248c57c466>
  },
  supply: 1000000000n,
  decimals: 9,
  isInitialized: true,
  freezeAuthority: null
}
*/
