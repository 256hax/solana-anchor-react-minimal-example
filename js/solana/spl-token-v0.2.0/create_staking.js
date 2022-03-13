// Source: https://docs.solana.com/developing/clients/javascript-reference#stakeprogram
const web3 = require("@solana/web3.js");

async function main() {
  // Fund a key to create transactions
  let fromPublicKey = web3.Keypair.generate();
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');


  let airdropSignature = await connection.requestAirdrop(
      fromPublicKey.publicKey,
      web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);


  // Create Account
  let stakeAccount = web3.Keypair.generate();

  let authorizedAccount = web3.Keypair.generate();
  /* Note: This is the minimum amount for a stake account -- Add additional Lamports for staking
      For example, we add 50 lamports as part of the stake */
  let lamportsForStakeAccount = (await connection.getMinimumBalanceForRentExemption(web3.StakeProgram.space)) + 50;
  const getMinimumBalanceForRentExemption_web3_StakeProgram_space = await connection.getMinimumBalanceForRentExemption(web3.StakeProgram.space);

  let createAccountTransaction = web3.StakeProgram.createAccount({
      fromPubkey: fromPublicKey.publicKey,
      authorized: new web3.Authorized(authorizedAccount.publicKey, authorizedAccount.publicKey),
      lamports: lamportsForStakeAccount,
      lockup: new web3.Lockup(0, 0, fromPublicKey.publicKey),
      stakePubkey: stakeAccount.publicKey
  });
  const create_new_stake_account_tx = await web3.sendAndConfirmTransaction(connection, createAccountTransaction, [fromPublicKey, stakeAccount]);


  // Check that stake is available
  let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
  // Stake balance: 2282930

  // We can verify the state of our stake. This may take some time to become active
  let stakeState = await connection.getStakeActivation(stakeAccount.publicKey);
  // Stake State: inactive

  // To delegate our stake, we get the current vote accounts and choose the first
  let voteAccounts = await connection.getVoteAccounts();
  let voteAccount = voteAccounts.current.concat(
      voteAccounts.delinquent,
  )[0];
  let votePubkey = new web3.PublicKey(voteAccount.votePubkey);

  // We can then delegate our stake to the voteAccount
  let delegateTransaction = web3.StakeProgram.delegate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: authorizedAccount.publicKey,
      votePubkey: votePubkey,
  });
  const delegateTransaction_tx = await web3.sendAndConfirmTransaction(connection, delegateTransaction, [fromPublicKey, authorizedAccount]);

  // To withdraw our funds, we first have to deactivate the stake
  let deactivateTransaction = web3.StakeProgram.deactivate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: authorizedAccount.publicKey,
  });
  const deactivateTransaction_tx = await web3.sendAndConfirmTransaction(connection, deactivateTransaction, [fromPublicKey, authorizedAccount]);

  // Once deactivated, we can withdraw our funds
  let withdrawTransaction = web3.StakeProgram.withdraw({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: authorizedAccount.publicKey,
      toPubkey: fromPublicKey.publicKey,
      lamports: stakeBalance,
  });

  const withdrawTransaction_tx = await web3.sendAndConfirmTransaction(connection, withdrawTransaction, [fromPublicKey, authorizedAccount]);


  console.log('stakeAccount             =>', stakeAccount.publicKey.toString());
  console.log('authorizedAccount        =>', authorizedAccount.publicKey.toString());
  console.log('create_account_tx        =>', create_new_stake_account_tx);
  console.log('StakeProgram_space       =>', getMinimumBalanceForRentExemption_web3_StakeProgram_space);
  console.log('Add lamports for stake   =>', 50);
  console.log(`Stake balance            => ${stakeBalance}`)
  console.log(`Stake State              => ${stakeState.state}`);
  console.log('votePubkey               =>', votePubkey.toString());
  console.log('delegateTransaction_tx   =>', delegateTransaction_tx);
  console.log('deactivateTransaction_tx =>', deactivateTransaction_tx);
  console.log('withdrawTransaction_tx   =>', withdrawTransaction_tx);
}

main();

/*
% node <THIS JS FILE>
stakeAccount             => 3Xjk6pDDzDUdYj4THKaFsUZibvsBbMsHT2SEf9h8h6Ct
authorizedAccount        => 7zJrrAxV2WGFuqXCVnfeN3o6cCYAmP5mBRApr3k5Btfm
create_account_tx        => 4nHU9u9ohdKBi1aek9Qrnp15FAwc3gVDP3eKTRPzbGxCMV24BF8ZAL2yq7uUUoJ4ewhMmG19K9thxbWVUYDcNX3k
StakeProgram_space       => 2282880
Add lamports for stake   => 50
Stake balance            => 2282930
Stake State              => inactive
votePubkey               => 7fA78DUbi72jmBB3hkkRnYZa76aNfM71BV4jgFa1dFjQ
delegateTransaction_tx   => 2bJnheZeb5BasVueRJicDrVRHYeTHDq9bqgmdVcS2JBsSewWyFm8xGdn3JJnVtgkHhTpYWPsRXRYCtja49ciSht8
deactivateTransaction_tx => YLVTP4sLbCfYYFDomj52hkWZuZoJqtYCpoLA1uohEpQZ1miCAknwW9pG6Ggqoe6qvEBg5jCxVWTTKavspacGxsL
withdrawTransaction_tx   => 4XKgdzsnQ9SrA95jUN86ddDa5rmqE7dgKPMPHGoKesU6LejbwLWoBtQYRjcfmDZDKpWijV14QyWGAaNbrTY2cGEF
*/
