import { Connection, PublicKey } from '@solana/web3.js';

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isConfirmed = async (
  endpoint: string,
  signature: string,
  sleepMSec: number,
  maxRetry: number
): Promise<boolean> => {
  const connection = new Connection(endpoint, 'confirmed');

  let status = await connection.getSignatureStatus(signature, {
    searchTransactionHistory: true,
  });

  for (let i = 0; i < maxRetry; i++) {
    if (
      status.value?.err === null &&
      status.value?.confirmationStatus === 'confirmed'
    ) {
      console.log('Confirmation status is confirmed.');
      return true;
    }
    await sleep(sleepMSec);

    status = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    });
  }

  console.log('Could not find "confirmation status = confirmed".');
  return false;
};
