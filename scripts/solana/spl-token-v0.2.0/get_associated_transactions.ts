// Source: https://solana-labs.github.io/solana-web3.js/classes/Connection.html
import * as web3 from '@solana/web3.js';

export const main = async() => {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  // let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  const nft_mint_signature = '9hDPtgqmAAJHKaDKj4xbEJQz9r32jvStJf2b96pPyqnqDDxXeYXEXgMatMCQcoHZ7fEr1HmfgrYgp45iEP9LtJH';
  const sol_transfer_signature = '5zeWmoxnYQUk1AA5re2cqpvqZsMqvnAapZztfnvdeifLTNFy2utG8fcdrxhmegCaqgdWUNmpC5hWt28JaEpiw2Mv';
  const signatures = [nft_mint_signature, sol_transfer_signature];


  // [Note] If you want to decode, use JSON.stringify.
  // ex) JSON.stringify(<RESPONSE JSON DATA>, null, 2)

  // getTransaction method is almost same result.
  const getParsedTransaction = await connection.getParsedTransaction(nft_mint_signature);
  console.log("\n----------------------------------------------------------------------");
  // console.log('getParsedTransaction =>', JSON.stringify(getParsedTransaction, null, 2));
  console.log('getParsedTransaction =>', getParsedTransaction);


  const getParsedTransactions = await connection.getParsedTransactions(signatures);
  console.log("\n----------------------------------------------------------------------");
  console.log('getParsedTransactions =>', getParsedTransactions);
};

main();

/*
% ts-node <THIS JS FILE>
----------------------------------------------------------------------
getParsedTransaction => {
  blockTime: 1644156365,
  meta: {
    err: null,
    fee: 10000,
    innerInstructions: [ [Object], [Object] ],
    logMessages: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
      'Program log: Instruction: InitializeMint',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2457 of 200000 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]',
      'Program log: Transfer 2039280 lamports to the associated token account',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Allocate space for the associated token account',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Assign the associated token account to the SPL Token program',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Initialize the associated token account',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: InitializeAccount',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3297 of 177047 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 26899 of 200000 compute units',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
      'Program log: Instruction: MintTo',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2611 of 200000 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ invoke [1]',
      'Program log: Instruction: MintNft',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Index is set to 8',
      'Program log: Index actually ends up due to used bools 8',
      'Program log: Before metadata',
      'Program consumption: 179535 units remaining',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s invoke [2]',
      'Program log: (Deprecated as of 1.1.0) Instruction: Create Metadata Accounts',
      'Program log: Transfer 5616720 lamports to the new account',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Allocate space for the account',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Assign the account to the owning program',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s consumed 35494 of 173847 compute units',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s success',
      'Program log: Before master',
      'Program consumption: 138284 units remaining',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s invoke [2]',
      'Program log: (Deprecated as of 1.1.0, please use V3 Create Master Edition)\n' +
        ' V2 Create Master Edition',
      'Program log: Transfer 2853600 lamports to the new account',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Allocate space for the account',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Assign the account to the owning program',
      'Program 11111111111111111111111111111111 invoke [3]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Setting mint authority',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
      'Program log: Instruction: SetAuthority',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1929 of 109543 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program log: Setting freeze authority',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
      'Program log: Instruction: SetAuthority',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1928 of 105051 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program log: Finished setting freeze authority',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s consumed 30973 of 133207 compute units',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s success',
      'Program log: Before update',
      'Program consumption: 102145 units remaining',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s invoke [2]',
      'Program log: (Deprecated as of 1.1.0) Instruction: Update Metadata Accounts',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s consumed 6995 of 99477 compute units',
      'Program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s success',
      'Program log: Before instr check',
      'Program consumption: 92322 units remaining',
      'Program log: At the end',
      'Program consumption: 81659 units remaining',
      'Program cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ consumed 123480 of 200000 compute units',
      'Program cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ success'
    ],
    postBalances: [
      39472136326,   1461600,
          2039280,  22668720,
      12977063530,   5616720,
          2853600,   1009200,
                1, 953185920,
                0,   1141440,
          1169280,  42706560,
                0, 898174080,
          1141440
    ],
    postTokenBalances: [ [Object] ],
    preBalances: [
      40484117526,         0,
                0,  22668720,
      11977063530,         0,
                0,   1009200,
                1, 953185920,
                0,   1141440,
          1169280,  42706560,
                0, 898174080,
          1141440
    ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null }
  },
  slot: 112834378,
  transaction: {
    message: {
      accountKeys: [Array],
      instructions: [Array],
      recentBlockhash: 'BhXsjXiDf7xuM2g9vaAtJqQvSAapmWv7kWFSqKHXX2Rz'
    },
    signatures: [
      '9hDPtgqmAAJHKaDKj4xbEJQz9r32jvStJf2b96pPyqnqDDxXeYXEXgMatMCQcoHZ7fEr1HmfgrYgp45iEP9LtJH',
      '38CULqv4kt5xpY1o2sWC6egmTtnRZX9RinTh56bx6NW7vtdfGfL16zrzHT71GgbUhU8jZfrgNRCS7iSKzwhUwsNP'
    ]
  }
}

----------------------------------------------------------------------
getParsedTransactions => [
  {
    blockTime: 1644156365,
    meta: {
      err: null,
      fee: 10000,
      innerInstructions: [Array],
      logMessages: [Array],
      postBalances: [Array],
      postTokenBalances: [Array],
      preBalances: [Array],
      preTokenBalances: [],
      rewards: [],
      status: [Object]
    },
    slot: 112834378,
    transaction: { message: [Object], signatures: [Array] }
  },
  {
    blockTime: 1644143702,
    meta: {
      err: null,
      fee: 5000,
      innerInstructions: [],
      logMessages: [Array],
      postBalances: [Array],
      postTokenBalances: [],
      preBalances: [Array],
      preTokenBalances: [],
      rewards: [],
      status: [Object]
    },
    slot: 112801914,
    transaction: { message: [Object], signatures: [Array] }
  }
]
*/
