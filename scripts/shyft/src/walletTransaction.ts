import * as dotenv from 'dotenv';
import { ShyftSdk, Network } from '@shyft-to/js';

const walletTransaction = async () => {
  // Config
  dotenv.config();

  const shyftApiKey = process.env.SHYFT_API_KEY;
  if (!shyftApiKey) throw new Error('shyftApiKey not found.');

  const shyft = new ShyftSdk({
    apiKey: shyftApiKey,
    network: Network.Mainnet,
  });

  // Run
  const result = await shyft.wallet.transaction({
    txnSignature:
      '395VH9iryUYk5M7CxQak6giYuMLDTRemj3kraZMJTFqDCpSJTHo3TvE6QNe5b1xhf6LiLrtM3XwqnYTMJc35wmWT',
  });
  console.log(result);
};

walletTransaction();

/*
ts-node src/walletTransaction.ts
{
  blockTime: 1712990185,
  meta: {
    computeUnitsConsumed: 69329,
    err: null,
    fee: 7521,
    innerInstructions: [ [Object] ],
    logMessages: [
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program ComputeBudget111111111111111111111111111111 invoke [1]',
      'Program ComputeBudget111111111111111111111111111111 success',
      'Program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY invoke [1]',
      'Program log: Instruction: MintToCollectionV1',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s invoke [2]',
      'Program log: IX: Bubblegum Program Set Collection Size',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s consumed 17755 of 114061 compute units',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s success',
      'Program noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV invoke [2]',
      'Program noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV consumed 39 of 87857 compute units',
      'Program noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV success',
      'Program cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK invoke [2]',
      'Program log: Instruction: Append',
      'Program noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV invoke [3]',
      'Program noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV consumed 39 of 72792 compute units',
      'Program noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV success',
      'Program cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK consumed 9820 of 82313 compute units',
      'Program cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK success',
      'Program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY consumed 69029 of 139700 compute units',
      'Program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY success'
    ],
    postBalances: [
      1380553999, 3041854080,
         5616720,    1559040,
               1,          0,
         2853600,    1461600,
         1141440,  195358749,
         1141440,          1,
         1141440,    1141440,
               0
    ],
    postTokenBalances: [],
    preBalances: [
      1380561520, 3041854080,
         5616720,    1559040,
               1,          0,
         2853600,    1461600,
         1141440,  195358749,
         1141440,          1,
         1141440,    1141440,
               0
    ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null }
  },
  slot: 259849903,
  transaction: {
    message: {
      accountKeys: [Array],
      instructions: [Array],
      recentBlockhash: '3k9S6ecEbKG7YGpwePLqDoGKAXraMXkvohNCMbmuijvL'
    },
    signatures: [
      '395VH9iryUYk5M7CxQak6giYuMLDTRemj3kraZMJTFqDCpSJTHo3TvE6QNe5b1xhf6LiLrtM3XwqnYTMJc35wmWT'
    ]
  },
  version: 'legacy',
  parsed: {
    timestamp: '2024-04-13T06:36:25.000Z',
    fee: 0.000007521,
    fee_payer: '7Do7DZFmJegFDj99W2AEKyE2gxtNytMppSnQrfD3T753',
    signers: [ '7Do7DZFmJegFDj99W2AEKyE2gxtNytMppSnQrfD3T753' ],
    signatures: [
      '395VH9iryUYk5M7CxQak6giYuMLDTRemj3kraZMJTFqDCpSJTHo3TvE6QNe5b1xhf6LiLrtM3XwqnYTMJc35wmWT'
    ],
    protocol: {
      address: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
      name: 'BUBBLEGUM'
    },
    type: 'COMPRESSED_NFT_MINT',
    status: 'Success',
    actions: [ [Object] ],
    events: []
  }
}
*/
