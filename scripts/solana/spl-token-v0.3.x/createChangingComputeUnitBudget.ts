// Docs: https://solanacookbook.com/references/basic-transactions.html#how-to-add-a-memo-to-a-transaction
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const main = async () => {
  const payer = Keypair.generate();
  const toAccount = Keypair.generate().publicKey;

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // Airdrop
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );
  let latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({ 
    units: 1_000_000 
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({ 
    microLamports: 1 
  });

  // Total fee will be 5,001 Lamports for 1M CU
  const transaction = new Transaction()
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount,
        lamports: 10000000,
      })
    );

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ]);
  const result = await connection.getParsedTransaction(signature);

  console.log('signature =>', signature);
  console.log('result =>', result);
};

main();

/*
ts-node createChangingComputeUnitBudget.ts
signature => 32A15mb5rodySmeGjmhQC2fpXAPxueHoy5NHM2eMA1agGRpLUGAd5SR3zxHiBycL5GVmXFQq5mpuB4pMrkHwmQUu
result => {
  blockTime: 1711980118,
  meta: {
    computeUnitsConsumed: 450,
    err: null,
    fee: 5001,
    innerInstructions: [],
    logMessages: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    postBalances: [ 989994999, 10000000, 1, 1 ],
    postTokenBalances: [],
    preBalances: [ 1000000000, 0, 1, 1 ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null },
    loadedAddresses: undefined
  },
  slot: 235,
  transaction: {
    message: {
      accountKeys: [Array],
      instructions: [Array],
      recentBlockhash: '763bSLR31a95LZCzzGT8s4SaHgVqHECiLpQ1XKXFRffv',
      addressTableLookups: undefined
    },
    signatures: [
      '32A15mb5rodySmeGjmhQC2fpXAPxueHoy5NHM2eMA1agGRpLUGAd5SR3zxHiBycL5GVmXFQq5mpuB4pMrkHwmQUu'
    ]
  },
  version: undefined
}
*/