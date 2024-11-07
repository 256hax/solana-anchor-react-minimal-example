// Ref: https://solana-labs.github.io/solana-web3.js/v1.x/classes/Connection.html#getTransaction
import {
  SystemProgram,
  Connection,
  clusterApiUrl,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  LAMPORTS_PER_SOL,
  GetVersionedTransactionConfig,
} from '@solana/web3.js';

export const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // // --------------------------------------------------------
  // //  Wallet
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
  const signature = '2cHg1vsvoM6P2zd6G1Fup3Few7gM9HAZ9bRbf53QzmsRUWxZmeRjS3DFQ7Dw4E9EpBWACK2j3K7iZiz7Ef5ZoCu7';

  const config: GetVersionedTransactionConfig = {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0,
  };
  const getTx = await connection.getTransaction(signature, {
    ...config,
    maxSupportedTransactionVersion: 0,
  });

  console.log('\n--- PublicKey -------------------------------------------------');
  console.log('payer.publicKey =>', getTx?.transaction.message.getAccountKeys().get(0)?.toString());
  console.log('taker.publicKey =>', getTx?.transaction.message.getAccountKeys().get(1)?.toString());

  console.log('\n--- Full Logs -------------------------------------------------');
  console.log('getTx =>', getTx);

  console.log('\n--- Accounts -------------------------------------------------');
  console.log('instructions =>', getTx?.transaction.message);

  console.log('accountKeys =>', getTx?.transaction.message.getAccountKeys());
  console.log('accountKeys[0] =>', getTx?.transaction.message.getAccountKeys().get(0)?.toString());
  console.log('accountKeys[1] =>', getTx?.transaction.message.getAccountKeys().get(1)?.toString());
  console.log('accountKeys[2] =>', getTx?.transaction.message.getAccountKeys().get(2)?.toString());
  // // Ref: https://solana-labs.github.io/solana-web3.js/v1.x/types/ConfirmedTransactionMeta.html
  console.log('postBalances(Current Balance, Sent Amount) =>', getTx?.meta?.postBalances);
};

main();

/*
% ts-node <THIS JS FILE>

--- PublicKey -------------------------------------------------
payer.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
taker.publicKey => CHGy9EMtQjzjHEZUpNCMjtMdajB6a1uFQQCGgVvNWifq

--- Full Logs -------------------------------------------------
getTx => {
  blockTime: 1670509335,
  meta: {
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
  version: 'legacy'
}

--- Accounts -------------------------------------------------
instructions => Message {
  header: {
    numReadonlySignedAccounts: 0,
    numReadonlyUnsignedAccounts: 6,
    numRequiredSignatures: 1
  },
  accountKeys: [
    PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    PublicKey [PublicKey(CHGy9EMtQjzjHEZUpNCMjtMdajB6a1uFQQCGgVvNWifq)] {
      _bn: <BN: a79be777a470f45397e7f93f0de5749346a773a79c2ea17839949fb15b92d008>
    },
    PublicKey [PublicKey(GK34EGz8mAFkv2tRKRT8vzXdigXyK8TXJUV5BaCMpDsa)] {
      _bn: <BN: e37e15333679954434a7980f9780b963e1f81f88edb60e28bc59b33f9055b0dd>
    },
    PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    },
    PublicKey [PublicKey(55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK)] {
      _bn: <BN: 3c800119356b8454be971bfc5288e1398fa5d0bb0b33b15be209a13f50b4d238>
    },
    PublicKey [PublicKey(6f1ay3LhnZBY7QJD9WZmjnRGsagFE2zEaFqP5qXv6e3L)] {
      _bn: <BN: 54072ae42cff08f54180606faa6098706822afef69bdce28913cf2e3f3e5c293>
    },
    PublicKey [PublicKey(ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL)] {
      _bn: <BN: 8c97258f4e2489f1bb3d1029148e0d830b5a1399daff1084048e7bd8dbe9f859>
    },
    PublicKey [PublicKey(FBGhXeBcVbn9FD9sP71fG2Ynv6A5mJSK38TLSDGjYQHV)] {
      _bn: <BN: d2a52cfb3997c1676831123e2b53c3db91638cab78b7d03db9efd653c1209a50>
    },
    PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
      _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
    }
  ],
  recentBlockhash: 'Cb9BTtpVcy2MEk7Wu1bPNS69Z4y1gyHcbWsT1SLPyKWE',
  instructions: [
    {
      accounts: [Array],
      data: '',
      programIdIndex: 6,
      stackHeight: null
    },
    {
      accounts: [Array],
      data: 'g7gn3dpVguJSb',
      programIdIndex: 8,
      stackHeight: null
    }
  ],
  indexToProgramIds: Map(2) {
    6 => PublicKey [PublicKey(ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL)] {
      _bn: <BN: 8c97258f4e2489f1bb3d1029148e0d830b5a1399daff1084048e7bd8dbe9f859>
    },
    8 => PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
      _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
    }
  }
}
accountKeys => MessageAccountKeys {
  staticAccountKeys: [
    PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    PublicKey [PublicKey(CHGy9EMtQjzjHEZUpNCMjtMdajB6a1uFQQCGgVvNWifq)] {
      _bn: <BN: a79be777a470f45397e7f93f0de5749346a773a79c2ea17839949fb15b92d008>
    },
    PublicKey [PublicKey(GK34EGz8mAFkv2tRKRT8vzXdigXyK8TXJUV5BaCMpDsa)] {
      _bn: <BN: e37e15333679954434a7980f9780b963e1f81f88edb60e28bc59b33f9055b0dd>
    },
    PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>
    },
    PublicKey [PublicKey(55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK)] {
      _bn: <BN: 3c800119356b8454be971bfc5288e1398fa5d0bb0b33b15be209a13f50b4d238>
    },
    PublicKey [PublicKey(6f1ay3LhnZBY7QJD9WZmjnRGsagFE2zEaFqP5qXv6e3L)] {
      _bn: <BN: 54072ae42cff08f54180606faa6098706822afef69bdce28913cf2e3f3e5c293>
    },
    PublicKey [PublicKey(ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL)] {
      _bn: <BN: 8c97258f4e2489f1bb3d1029148e0d830b5a1399daff1084048e7bd8dbe9f859>
    },
    PublicKey [PublicKey(FBGhXeBcVbn9FD9sP71fG2Ynv6A5mJSK38TLSDGjYQHV)] {
      _bn: <BN: d2a52cfb3997c1676831123e2b53c3db91638cab78b7d03db9efd653c1209a50>
    },
    PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
      _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
    }
  ],
  accountKeysFromLookups: undefined
}
accountKeys[0] => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
accountKeys[1] => CHGy9EMtQjzjHEZUpNCMjtMdajB6a1uFQQCGgVvNWifq
accountKeys[2] => GK34EGz8mAFkv2tRKRT8vzXdigXyK8TXJUV5BaCMpDsa
postBalances(Current Balance, Sent Amount) => [
  21465077035, 2039280,
      2039280,       1,
   1035875000,       0,
    731913600, 1461600,
    934087680
]
*/
