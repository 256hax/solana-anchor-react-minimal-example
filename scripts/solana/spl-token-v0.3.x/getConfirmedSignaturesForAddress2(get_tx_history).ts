// Ref: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getConfirmedSignaturesForAddress2
// Returns confirmed signatures for transactions involving an address backwards in time from the provided signature or most recent confirmed block
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
// const connection = new web3.Connection('http://127.0.0.1:8899', 'confirmed');
  
export const main = async() => {
  const publicKey = new PublicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');
  const history = await connection.getConfirmedSignaturesForAddress2(
    publicKey,
    { limit: 10 }
  );

  console.log(history);
};

main();

/*
% ts-node <THIS FILE>
[
  {
    blockTime: 1665659747,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '3mWjtXP3X9a5eVs9q5oFHXHw17gdaY2sYbJy4JfPNnNFPRCt2eo7HEQZMvfgfZPmUnvYGTyK4DiEKE7CUCLxAjAW',
    slot: 168511927
  },
  {
    blockTime: 1665657440,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '4HvmyDtNieFydgfyiMCmGPtHrof8HAHrn4akqXhTvNRjLypwjibyXCz3rktB2YXKohaUQmRWtr7GAPHGx6gtiDxr',
    slot: 168506079
  },
  {
    blockTime: 1665657426,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5WHvyYLJnvDonCgjo9C4sKZwE8WVcbZXafDbWKQf43sgdo2j9w3kNUftb2bJvhyeTwh6fC94WP3LpVFEqHHR7ypK',
    slot: 168506047
  },
  {
    blockTime: 1665655966,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '3kcZcWUWPg5jsGFn3S1YrrrNzCfuQA39ut9azm9ttc8Pa3aRSzVTG1e6Y8zJJC7KwMMq6ZVkgZ1v93dfmfXheSgn',
    slot: 168502312
  },
  {
    blockTime: 1665631214,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5HqDpSPq9w6c9aBYpuydN6YfTRMqnerqd6iEEV1StWLXSRVC9x4yptfpHjtAmrN73a89tx6bojSNK82DiVwPJBwM',
    slot: 168438855
  },
  {
    blockTime: 1665631203,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '64PRHZdfRxMDtYNkRgAVT5iJQKwHt6mLBvHaMucMDaq2ZFhNk1gsSH8AYssPVa18UZP9YV9bYpwgCjV2a2vWMZD5',
    slot: 168438824
  },
  {
    blockTime: 1665631190,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5Kf5E7PDnFqJLaVEUQ23wHVbwzbSHcrqav4ByRhXtPR2rKFCXG12UreA3wPSKEYtVTGnVAbR6cZjwBsUqJD3jses',
    slot: 168438792
  },
  {
    blockTime: 1665631103,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: 'jaM8xJg838qci1KCAgnGhYmaNe9rDQFSmCNJuDSc4ULnMHVxW1vujxehcCLYqXGUzvTrSSZ7mLWyoh9QXZh6RZV',
    slot: 168438574
  },
  {
    blockTime: 1665631085,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: 'PhyFbhP2vGfo3b2Qt5jz5rC8FogcyBwoAenasft36z8oUxzucyo3TDApqUqyFf26PntAnAH9wF6dfqSuCSLerWw',
    slot: 168438528
  },
  {
    blockTime: 1665631079,
    confirmationStatus: 'finalized',
    err: null,
    memo: null,
    signature: '5LF8vLkPbvCcSwn72rrspfoHkoqxz4w3jfe6pDJT4nGnozzrifYBU2xFmccBuH5mpZNWufmg2oD5h5tQP2QWTmUv',
    slot: 168438512
  }
]
*/