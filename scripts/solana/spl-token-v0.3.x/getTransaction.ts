// Ref: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getTransaction
import {
  SystemProgram,
  Connection,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // // --------------------------------------------------------
  // //  Create Account
  // // --------------------------------------------------------
  // const payer = Keypair.generate();
  // const taker = Keypair.generate();

  // console.log('\n--- PublicKey -------------------------------------------------');
  // console.log('payer.publicKey =>', payer.publicKey.toString());
  // console.log('taker.publicKey =>', taker.publicKey.toString());

  // // --------------------------------------------------------
  // //  Airdrop
  // // --------------------------------------------------------
  // const airdropSignature = await connection.requestAirdrop(
  //   payer.publicKey,
  //   LAMPORTS_PER_SOL
  // );

  // let latestBlockhash = await connection.getLatestBlockhash();

  // await connection.confirmTransaction({
  //   blockhash: latestBlockhash.blockhash,
  //   lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  //   signature: airdropSignature,
  // });

  // // --------------------------------------------------------
  // //  Create Transfer Transaction
  // // --------------------------------------------------------
  // let transaction = new Transaction();

  // transaction.add(SystemProgram.transfer({
  //   fromPubkey: payer.publicKey,
  //   toPubkey: taker.publicKey,
  //   lamports: LAMPORTS_PER_SOL * 0.00123,
  // }));

  // const tx = await sendAndConfirmTransaction(
  //   connection,
  //   transaction,
  //   [payer]
  // );

  // [Devnet] Send SOL using createTransfer @sonana/pay (same as normal transfer
  // const tx = '4GE4Qy39bepnrobtD1aKn7FDFPx175fNkiYYFYschLygP14r3WHiWjHR14zLx2HwQyxpiVf1xVS2fwaSJqoump5c';

  // [Devnet] Send NFT using createTransfer @sonana/pay
  const tx = '2cHg1vsvoM6P2zd6G1Fup3Few7gM9HAZ9bRbf53QzmsRUWxZmeRjS3DFQ7Dw4E9EpBWACK2j3K7iZiz7Ef5ZoCu7';

  const getTx = await connection.getTransaction(tx, { commitment: "confirmed" });
  
  console.log('\n--- Full Logs -------------------------------------------------');
  console.log('getTx =>', getTx);

  console.log('\n--- Accounts -------------------------------------------------');
  console.log('instructions =>', getTx?.transaction.message.instructions);
  console.log('accountKeys =>', getTx?.transaction.message.accountKeys);
  console.log('accountKeys[0] =>', getTx?.transaction.message.accountKeys[0].toString());
  console.log('accountKeys[1] =>', getTx?.transaction.message.accountKeys[1].toString());
  console.log('accountKeys[2] =>', getTx?.transaction.message.accountKeys[2]?.toString());
  console.log('accountKeys[3] =>', getTx?.transaction.message.accountKeys[3]?.toString());
  console.log('accountKeys[4] =>', getTx?.transaction.message.accountKeys[4]?.toString());
  console.log('accountKeys[5] =>', getTx?.transaction.message.accountKeys[5]?.toString());
  console.log('accountKeys[6] =>', getTx?.transaction.message.accountKeys[6]?.toString());
  console.log('accountKeys[7] =>', getTx?.transaction.message.accountKeys[7]?.toString());
  console.log('accountKeys[8] =>', getTx?.transaction.message.accountKeys[8]?.toString());
  // Ref: https://solana-labs.github.io/solana-web3.js/types/ConfirmedTransactionMeta.html
  console.log('postBalances(Current Balance, Sent Amount) =>', getTx?.meta?.postBalances);
};

main();

/*
--------------------------------------------------------------------
Case1: Send SOL using createTransfer @sonana/pay
--------------------------------------------------------------------
% ts-node <THIS JS FILE>

--- PublicKey -------------------------------------------------
payer.publicKey => 8ijxWVKyB9ZVRLBPNoE8XhHiGXQarANFkmqBkqp4KeG5
taker.publicKey => D4puxsXsmzXhTLGmwzfCkVcirZvndTDiyCedKwVNi6F6

--- Full Logs -------------------------------------------------
getTx => {
  blockTime: 1670552938,
  meta: {
    computeUnitsConsumed: 0,
    err: null,
    fee: 5000,
    innerInstructions: [],
    loadedAddresses: { readonly: [], writable: [] },
    logMessages: [
      'Program 11111111111111111111111111111111 invoke [1]',
      'Program 11111111111111111111111111111111 success'
    ],
    postBalances: [ 998765000, 1230000, 1 ],
    postTokenBalances: [],
    preBalances: [ 1000000000, 0, 1 ],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null }
  },
  slot: 180876261,
  transaction: {
    message: Message {
      header: [Object],
      accountKeys: [Array],
      recentBlockhash: '87kvdLPn4KvAyRUBiW1EB8L6o3mQjEkoNseX7fZHFhvn',
      instructions: [Array],
      indexToProgramIds: [Map]
    },
    signatures: [
      '67493rzNkUNgG9NDBgCLDoeVG3zrnNRxYJHbT7qdTW1FmM3CV4dHtCY9fL3XwPZbrKnmTUjyf3hJR7qGinVZ4emk'
    ]
  },
  version: undefined
}

--- Accounts -------------------------------------------------
instructions => [ { accounts: [ 0, 1 ], data: '3Bxs4WRWb56sMtVV', programIdIndex: 2 } ]
accountKeys => [
  PublicKey {
    _bn: <BN: 72b3317ea17aeb2d9a42041b7d6335ae0ae106d626d9573f6629532ffe68017e>
  },
  PublicKey {
    _bn: <BN: b347293f9668859c3d928733726c5631b901c50626d1556a76de6037f470159d>
  },
  PublicKey { _bn: <BN: 0> }
]
accountKeys[0] => 8ijxWVKyB9ZVRLBPNoE8XhHiGXQarANFkmqBkqp4KeG5
accountKeys[1] => D4puxsXsmzXhTLGmwzfCkVcirZvndTDiyCedKwVNi6F6
accountKeys[2] => 11111111111111111111111111111111
accountKeys[3] => undefined
accountKeys[4] => undefined
accountKeys[5] => undefined
accountKeys[6] => undefined
accountKeys[7] => undefined
accountKeys[8] => undefined
postBalances(Current Balance, Sent Amount) => [ 998765000, 1230000, 1 ]
*/


/*
--------------------------------------------------------------------
Case2: Send NFT using createTransfer @sonana/pay
--------------------------------------------------------------------
% ts-node <THIS JS FILE>

--- Full Logs -------------------------------------------------
getTx => {
  blockTime: 1670509335,
  meta: {
    computeUnitsConsumed: 26744,
    err: null,
    fee: 5000,
    innerInstructions: [ [Object] ],
    loadedAddresses: { readonly: [], writable: [] },
    logMessages: [
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]',
      'Program log: Create',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: GetAccountDataSize',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1622 of 394555 compute units',
      'Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program 11111111111111111111111111111111 invoke [2]',
      'Program 11111111111111111111111111111111 success',
      'Program log: Initialize the associated token account',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: InitializeImmutableOwner',
      'Program log: Please upgrade to SPL Token 2022 for immutable owner support',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 388065 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
      'Program log: Instruction: InitializeAccount3',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4241 of 384181 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 20364 of 400000 compute units',
      'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]',
      'Program log: Instruction: TransferChecked',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6380 of 379636 compute units',
      'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success'
    ],
    postBalances: [
      21465077035, 2039280,
          2039280,       1,
       1035875000,       0,
        731913600, 1461600,
        934087680
    ],
    postTokenBalances: [ [Object], [Object] ],
    preBalances: [
      21467121315, 2039280,
                0,       1,
       1035875000,       0,
        731913600, 1461600,
        934087680
    ],
    preTokenBalances: [ [Object] ],
    rewards: [],
    status: { Ok: null }
  },
  slot: 180765350,
  transaction: {
    message: Message {
      header: [Object],
      accountKeys: [Array],
      recentBlockhash: 'Cb9BTtpVcy2MEk7Wu1bPNS69Z4y1gyHcbWsT1SLPyKWE',
      instructions: [Array],
      indexToProgramIds: [Map]
    },
    signatures: [
      '2cHg1vsvoM6P2zd6G1Fup3Few7gM9HAZ9bRbf53QzmsRUWxZmeRjS3DFQ7Dw4E9EpBWACK2j3K7iZiz7Ef5ZoCu7'
    ]
  },
  version: undefined
}

--- Accounts -------------------------------------------------
instructions => [
  { accounts: [ 0, 2, 4, 7, 3, 8 ], data: '', programIdIndex: 6 },
  {
    accounts: [ 1, 7, 2, 0, 5 ],
    data: 'g7gn3dpVguJSb',
    programIdIndex: 8
  }
]
accountKeys => [
  PublicKey {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  PublicKey {
    _bn: <BN: a79be777a470f45397e7f93f0de5749346a773a79c2ea17839949fb15b92d008>
  },
  PublicKey {
    _bn: <BN: e37e15333679954434a7980f9780b963e1f81f88edb60e28bc59b33f9055b0dd>
  },
  PublicKey { _bn: <BN: 0> },
  PublicKey {
    _bn: <BN: 3c800119356b8454be971bfc5288e1398fa5d0bb0b33b15be209a13f50b4d238>
  },
  PublicKey {
    _bn: <BN: 54072ae42cff08f54180606faa6098706822afef69bdce28913cf2e3f3e5c293>
  },
  PublicKey {
    _bn: <BN: 8c97258f4e2489f1bb3d1029148e0d830b5a1399daff1084048e7bd8dbe9f859>
  },
  PublicKey {
    _bn: <BN: d2a52cfb3997c1676831123e2b53c3db91638cab78b7d03db9efd653c1209a50>
  },
  PublicKey {
    _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
  }
]
accountKeys[0] => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
accountKeys[1] => CHGy9EMtQjzjHEZUpNCMjtMdajB6a1uFQQCGgVvNWifq
accountKeys[2] => GK34EGz8mAFkv2tRKRT8vzXdigXyK8TXJUV5BaCMpDsa
accountKeys[3] => 11111111111111111111111111111111
accountKeys[4] => 55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK
accountKeys[5] => 6f1ay3LhnZBY7QJD9WZmjnRGsagFE2zEaFqP5qXv6e3L
accountKeys[6] => ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL
accountKeys[7] => FBGhXeBcVbn9FD9sP71fG2Ynv6A5mJSK38TLSDGjYQHV
accountKeys[8] => TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
postBalances(Current Balance, Sent Amount) => [
  21465077035, 2039280,
      2039280,       1,
   1035875000,       0,
    731913600, 1461600,
    934087680
]
*/