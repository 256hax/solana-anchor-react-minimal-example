// Source:
//    TS: https://github.com/solana-labs/solana-program-library/blob/%40solana/spl-token%40v0.1.8/token/program/src/instruction.rs
//    JS: https://github.com/solana-labs/solana-program-library/blob/%40solana/spl-token%40v0.1.8/token/js/examples/create_mint_and_transfer_tokens.js
var web3 = require('@solana/web3.js');
var splToken = require('@solana/spl-token');

(async () => {
  // Connect to cluster
  // var connection = new web3.Connection(
  //   web3.clusterApiUrl('devnet'),
  //   'confirmed',
  // );
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  // Generate a new wallet keypair and airdrop SOL
  var fromWallet = web3.Keypair.generate();
  var fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  //wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);

  // Generate a new wallet to receive newly minted token
  var toWallet = web3.Keypair.generate();

  //create new token mint
  // Source?: https://github.com/solana-labs/solana-program-library/blob/50f165ba0359285f3f2f85540aeb8a6d59c7c51a/token/program/src/instruction.rs#L700
  let mint = await splToken.Token.createMint(
    connection,
    fromWallet,                 // mint_pubkey: &Pubkey,
    fromWallet.publicKey,       // mint_authority_pubkey: &Pubkey,
    null,                       // freeze_authority_pubkey: Option<&Pubkey>,
    9,                          // decimals: u8,
    splToken.TOKEN_PROGRAM_ID,  // token_program_id: &Pubkey,
  );

  //get the token account of the fromWallet Solana address, if it does not exist, create it
  let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey,
  );

  //get the token account of the toWallet Solana address, if it does not exist, create it
  var toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey,
  );

  //minting 1 new token to the "fromTokenAccount" account we just returned/created
  // Source?: https://github.com/solana-labs/solana-program-library/blob/50f165ba0359285f3f2f85540aeb8a6d59c7c51a/token/program/src/instruction.rs#L1010
  await mint.mintTo(
    fromTokenAccount.address, // account_pubkey(destination): &Pubkey,
    fromWallet.publicKey,     // owner_pubkey(mint_authority_pubkey): &Pubkey,
    [],                       // signer_pubkeys: &[&Pubkey],
    1000000000,               // amount: u64,
  );

  // Add token transfer instructions to transaction
  // Source: https://github.com/solana-labs/solana-program-library/blob/50f165ba0359285f3f2f85540aeb8a6d59c7c51a/token/program/src/instruction.rs#L889
  var transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,  // token_program_id: &Pubkey,
      fromTokenAccount.address,   // source_pubkey: &Pubkey,
      toTokenAccount.address,     // destination_pubkey: &Pubkey,
      fromWallet.publicKey,       // authority_pubkey: &Pubkey,
      [],                         // signer_pubkeys: &[&Pubkey],
      1,                          // amount: u64,
    ),
  );

  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,                 // connection: Connection,
    transaction,                // transaction: Transaction,
    [fromWallet],               // signers: Signer[],
    {commitment: 'confirmed'},  // options?: ConfirmOptions
  );

  console.log('--- from --------------------------------------------------');
  console.log('fromWallet       =>', fromWallet.publicKey.toString());
  console.log('fromTokenAccount =>', fromTokenAccount.address.toString());
  console.log('\n--- to --------------------------------------------------');
  console.log('toWallet         =>', toWallet.publicKey.toString());
  console.log('toTokenAccount   =>', toTokenAccount.address.toString());
  console.log('\n--- tx --------------------------------------------------');
  console.log('SIGNATURE        =>', signature);
})();

/*
% node <THIS JS FILE>
--- from --------------------------------------------------
fromWallet       => AgjFhM9AntUm1972eAN6NJFLGBh452dXtmhfYMQ2xTMj
fromTokenAccount => 7nzQmUs5fMddsMMNy5LJAaqrX9iMZVJMVpqvrTtu1KEp

--- to --------------------------------------------------
toWallet         => EkfSdFL3rSmyikGBfEhRYKrTsRb3GU5RixepVn2Z2pRs
toTokenAccount   => 3Qsr1VV8hhzALYhtqHx9AzoRzjz433bXpUABHP89j7nF

--- tx --------------------------------------------------
SIGNATURE        => 48dMtH3f9xAm2X4QJi7dys5FVexCYDcXWmpnxeE5fxWNVWJCmAvRtLsGhk926g9iBeMd8kKMDEzWSz9wpaa4X2Cb
*/