// Source: https://docs.solana.com/developing/clients/javascript-reference#stakeprogram
import {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  StakeProgram,
  Authorized,
  Lockup,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export const main = async() => {
  // Fund a key to create transactions
  let fromPublicKey = Keypair.generate();
  let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // let connection = new Connection('http://localhost:8899', 'confirmed');


  let airdropSignature = await connection.requestAirdrop(
      fromPublicKey.publicKey,
      LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);


  // Create Account
  let stakeAccount = Keypair.generate();

  let authorizedAccount = Keypair.generate();
  /* Note: This is the minimum amount for a stake account -- Add additional Lamports for staking
      For example, we add 50 lamports as part of the stake */
  let lamportsForStakeAccount = (await connection.getMinimumBalanceForRentExemption(StakeProgram.space)) + 50;
  const getMinimumBalanceForRentExemption_web3_StakeProgram_space = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);

  let createAccountTransaction = StakeProgram.createAccount({
      fromPubkey: fromPublicKey.publicKey,
      authorized: new Authorized(authorizedAccount.publicKey, authorizedAccount.publicKey),
      lamports: lamportsForStakeAccount,
      lockup: new Lockup(0, 0, fromPublicKey.publicKey),
      stakePubkey: stakeAccount.publicKey
  });
  const create_new_stake_account_tx = await sendAndConfirmTransaction(connection, createAccountTransaction, [fromPublicKey, stakeAccount]);


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
  let votePubkey = new PublicKey(voteAccount.votePubkey);

  // We can then delegate our stake to the voteAccount
  let delegateTransaction = StakeProgram.delegate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: authorizedAccount.publicKey,
      votePubkey: votePubkey,
  });
  const delegateTransaction_tx = await sendAndConfirmTransaction(connection, delegateTransaction, [fromPublicKey, authorizedAccount]);

  // To withdraw our funds, we first have to deactivate the stake
  let deactivateTransaction = StakeProgram.deactivate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: authorizedAccount.publicKey,
  });
  const deactivateTransaction_tx = await sendAndConfirmTransaction(connection, deactivateTransaction, [fromPublicKey, authorizedAccount]);

  // Once deactivated, we can withdraw our funds
  let withdrawTransaction = StakeProgram.withdraw({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: authorizedAccount.publicKey,
      toPubkey: fromPublicKey.publicKey,
      lamports: stakeBalance,
  });

  const withdrawTransaction_tx = await sendAndConfirmTransaction(connection, withdrawTransaction, [fromPublicKey, authorizedAccount]);


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
};

main();

/*
% % ts-node <THIS FILE>
stakeAccount             => GjpM5DZ24UCzQTHwcaNQikD4x92QZN732TbzEVFL7s9x
authorizedAccount        => Chcgef3qVUFtAgG7q7H8Xa5L4mJeLUMWUUYyqaYYpAD2
create_account_tx        => 32LGEoo9yZ2Vg4woLbNonmHybyTvZ9x2ZL3cmXSzQvwByTRD3iA9FfHCGJFLUzyjoix14ZUQ9rRfh2jAWGymeFB6
StakeProgram_space       => 2282880
Add lamports for stake   => 50
Stake balance            => 2282930
Stake State              => inactive
votePubkey               => F95vVhuyAjAtmXbg2EnNVWKkD5yQsDS5S83Uw1TUDcZm
delegateTransaction_tx   => 2kvoc3j6QAMdFwWzzLUyA4TeW8Z574J7kwJ6XPRmoa5Y9Vf57vPQT1YSPQN6B814SBsiQyyokGyrmevA4QdaGFT7
deactivateTransaction_tx => 4pDG8bpqvkp32xTfockSgnCy3xUFJZvugV8aA3hA3myK25d3xcC9Jrrcm5ZcUkxDBfTRdxPmgHB22uax53rYC8FY
withdrawTransaction_tx   => 3BBCzb7KGmduH4PZPYQ8jbeRMeLfMaJ7oZPp9vQeFSFna7AB9X6HCVaAoMUDjNueKQQoEHBpSNaFFNSEUPk8irVR
*/