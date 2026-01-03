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

import { getStakeActivation } from '@anza-xyz/solana-rpc-get-stake-activation';

export const main = async () => {
  // Fund a key to create transactions
  const fromPublicKey = Keypair.generate();
  let connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  //   const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


  // Increase the airdrop amount
  const airdropSignature = await connection.requestAirdrop(
    fromPublicKey.publicKey,
    2 * LAMPORTS_PER_SOL, // Increase to 2 SOL
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });


  // Create Account
  const stakeAccount = Keypair.generate();

  const authorizedAccount = Keypair.generate();
  /* Note: This is the minimum amount for a stake account -- Add additional Lamports for staking
      For example, we add 50 lamports as part of the stake */
  const lamportsForStakeAccount = (await connection.getMinimumBalanceForRentExemption(StakeProgram.space)) + LAMPORTS_PER_SOL; // Increase to 1 SOL
  const getMinimumBalanceForRentExemption_web3_StakeProgram_space = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);

  const createAccountTransaction = StakeProgram.createAccount({
    fromPubkey: fromPublicKey.publicKey,
    authorized: new Authorized(authorizedAccount.publicKey, authorizedAccount.publicKey),
    lamports: lamportsForStakeAccount,
    lockup: new Lockup(0, 0, fromPublicKey.publicKey),
    stakePubkey: stakeAccount.publicKey
  });
  const create_new_stake_account_tx = await sendAndConfirmTransaction(connection, createAccountTransaction, [fromPublicKey, stakeAccount]);


  // Check that stake is available
  const stakeBalance = await connection.getBalance(stakeAccount.publicKey);
  // Stake balance: 2282930

  // We can verify the state of our stake. This may take some time to become active
  const stakeState = await getStakeActivation(connection, stakeAccount.publicKey);
  // Stake State: inactive

  // To delegate our stake, we get the current vote accounts and choose the first
  const voteAccounts = await connection.getVoteAccounts();
  const voteAccount = voteAccounts.current.concat(
    voteAccounts.delinquent,
  )[0];
  const votePubkey = new PublicKey(voteAccount.votePubkey);

  // We can then delegate our stake to the voteAccount
  const delegateTransaction = StakeProgram.delegate({
    stakePubkey: stakeAccount.publicKey,
    authorizedPubkey: authorizedAccount.publicKey,
    votePubkey: votePubkey,
  });
  const delegateTransaction_tx = await sendAndConfirmTransaction(connection, delegateTransaction, [fromPublicKey, authorizedAccount]);

  // To withdraw our funds, we first have to deactivate the stake
  const deactivateTransaction = StakeProgram.deactivate({
    stakePubkey: stakeAccount.publicKey,
    authorizedPubkey: authorizedAccount.publicKey,
  });
  const deactivateTransaction_tx = await sendAndConfirmTransaction(connection, deactivateTransaction, [fromPublicKey, authorizedAccount]);

  // Once deactivated, we can withdraw our funds
  const withdrawTransaction = StakeProgram.withdraw({
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
  console.log('Add lamports for stake   =>', LAMPORTS_PER_SOL);
  console.log(`Stake balance            => ${stakeBalance}`)
  console.log(`Stake State              => ${stakeState.status}`);
  console.log('votePubkey               =>', votePubkey.toString());
  console.log('delegateTransaction_tx   =>', delegateTransaction_tx);
  console.log('deactivateTransaction_tx =>', deactivateTransaction_tx);
  console.log('withdrawTransaction_tx   =>', withdrawTransaction_tx);
};

main();

/*
stakeAccount             => 7ZSwa9x6Q2XiYw98xpvWX4rfdd8TZjTBKg5aYQLH654N
authorizedAccount        => Cw7H7p6XPUH3NdsjJ2WH4BdC6aNZmzW81QaQcppcgTTW
create_account_tx        => 5o7e9MZqwBMBAqcdZWjyt7EWn12hazuJtvtN2cnFgEcwNrDJmkMkVx6cB7A4p8kvDre3NJJcRk7B68PGQhzDGYeR
StakeProgram_space       => 2282880
Add lamports for stake   => 1000000000
Stake balance            => 1002282880
Stake State              => inactive
votePubkey               => JFft3U1p53b3BJusb3gK4Nfzmfu1JgKRHdtXvLassCh
delegateTransaction_tx   => 4MC4mzeph3e1HTnftYHwZetXtRQV2vHC8p8C9rrsoVvtGmLAgsXNbYuB3WAHnfNN3GqDHNNajXv63HdW5oMAoAv8
deactivateTransaction_tx => 3XsQ8dMFy3zR6zufuA8qVHtwjoDCnQQcDcj5itQqt5LuWMP4xGz8YiCEqVUwRm9KeEdyyDpVVXy4XcMF1ajRabPc
withdrawTransaction_tx   => 5yicR3Z4XtttkNCPU88XxMamait7zNAjWuFCjhQbNQRF9TSegPa1Q9bbFYhQy6UzhgkBxqcqy9a6LtRML2gNfMDU
*/
