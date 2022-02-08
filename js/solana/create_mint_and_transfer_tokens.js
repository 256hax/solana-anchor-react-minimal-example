// Ref: https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/create_mint_and_transfer_tokens.js
// Docs: https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js
const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {
  // Connect to cluster
  const connection = new web3.Connection(
    // web3.clusterApiUrl('devnet'),
    'http://localhost:8899', // for debug
    'confirmed',
  );

  // Generate a new wallet keypair and airdrop SOL
  var fromWallet = web3.Keypair.generate();
  var fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  console.log("fromWallet Publickey -> ", fromWallet.publicKey.toString());
  // Wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);

  // Generate a new wallet to receive newly minted token
  const toWallet = web3.Keypair.generate();
  console.log("toWallet Publickey -> ", toWallet.publicKey.toString());

  // Create new token mint
  // https://github.com/solana-labs/solana-program-library/blob/0655bd7dd19b83d8dffe27fa1cc182b112dc5385/token/js/client/token.js#L384
  const mint = await splToken.Token.createMint(
    connection, // connection
    fromWallet, // payer
    fromWallet.publicKey, // mintAuthority
    null, // freezeAuthority
    9, // decimals
    splToken.TOKEN_PROGRAM_ID, // programId
  );

  // Get the token account of the fromWallet Solana address, if it does not exist, create it
  const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  //get the token account of the toWallet Solana address, if it does not exist, create it
  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey,
  );

  // Minting 1 new token to the "fromTokenAccount" account we just returned/created
  // https://github.com/solana-labs/solana-program-library/blob/0655bd7dd19b83d8dffe27fa1cc182b112dc5385/token/js/client/token.js#L1027
  await mint.mintTo(
    fromTokenAccount.address, // dest
    fromWallet.publicKey, // authority
    [], // multiSigners
    1000000000, // amount
  );

  // Add token transfer instructions to transaction
  // https://github.com/solana-labs/solana-program-library/blob/0655bd7dd19b83d8dffe27fa1cc182b112dc5385/token/js/client/token.js#L1511
  const transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID, // programId
      fromTokenAccount.address, // source
      toTokenAccount.address, // destination
      fromWallet.publicKey, // owner
      [], // multiSigners
      1, // amount
    ),
  );

  // Sign transaction, broadcast, and confirm
  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet],
    {commitment: 'confirmed'},
  );
  console.log('Signature -> ', signature);
})();

/*
% npm add @solana/web3.js @solana/spl-token
% node create_mint_and_transfer_tokens.js
fromWallet Publickey ->  5b14DdMF2HuXEHCpjUQQnupZJW4LtvsUhFL3Vs4LcBHR
toWallet Publickey ->  LzSU5qwoAQd8CJwbcqHgtZqBtpzWsxGPwjc9Y7aj1FY
Signature -> 27bWC2Bdagk1PxczcenPf13fsXxYmJ8ZP3YygAmUPJLe27ySi4XksryJFBfHRE4hYtwrJxzo43BzC4dCMRyzHDAx
*/
