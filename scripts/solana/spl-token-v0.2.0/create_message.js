// Source: https://docs.solana.com/developing/clients/javascript-reference#message
const {Buffer} = require("buffer");
const bs58 = require('bs58');
const web3 = require('@solana/web3.js');

async function main() {
  let toPublicKey = web3.Keypair.generate().publicKey;
  let fromPublicKey = web3.Keypair.generate();

  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  let airdropSignature = await connection.requestAirdrop(
      fromPublicKey.publicKey,
      web3.LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  let type = web3.SYSTEM_INSTRUCTION_LAYOUTS.Transfer;
  let data = Buffer.alloc(type.layout.span);
  let layoutFields = Object.assign({instruction: type.index});
  type.layout.encode(layoutFields, data);

  let recentBlockhash = await connection.getRecentBlockhash();

  let messageParams = {
      accountKeys: [
          fromPublicKey.publicKey.toString(),
          toPublicKey.toString(),
          web3.SystemProgram.programId.toString()
      ],
      header: {
          numReadonlySignedAccounts: 0,
          numReadonlyUnsignedAccounts: 1,
          numRequiredSignatures: 1,
      },
      instructions: [
          {
          accounts: [0, 1],
          data: bs58.encode(data),
          programIdIndex: 2,
          },
      ],
      recentBlockhash,
  };

  let message = new web3.Message(messageParams);

  let transaction = web3.Transaction.populate(
      message,
      [fromPublicKey.publicKey.toString()]
  );

  let signature = await web3.sendAndConfirmTransaction(connection, transaction, [fromPublicKey])

  console.log('From => ', fromPublicKey.publicKey.toString());
  console.log('To => ', toPublicKey.toString());
  console.log('Signature => ', signature);
  console.log('messageParams => ', messageParams);
  console.log('Message => ', message);
  console.log('Transaction.populate => ', transaction);
}

main();
/*
% node <THIS JS FILE>
From =>  Dy8XGcZyiXwtQ7WfZ8M9RytzCn96CWPBHdwErPFgZ6bH
To =>  TFzkL3deka2RprWuxkiRZZXvyrcsmuH7YEpQsg3HHNB
Signature =>  21h23fkVmHftGDEKUdaacQySTx8vmV4dFC9XMuBSASyUvE26fMSGijV4HggGURUKB77ZGx6ErcrMFtWsEWHuuepE
messageParams =>  {
  accountKeys: [
    'Dy8XGcZyiXwtQ7WfZ8M9RytzCn96CWPBHdwErPFgZ6bH',
    'TFzkL3deka2RprWuxkiRZZXvyrcsmuH7YEpQsg3HHNB',
    '11111111111111111111111111111111'
  ],
  header: {
    numReadonlySignedAccounts: 0,
    numReadonlyUnsignedAccounts: 1,
    numRequiredSignatures: 1
  },
  instructions: [
    { accounts: [Array], data: '3Bxs3zrfFUZbEPqZ', programIdIndex: 2 }
  ],
  recentBlockhash: {
    blockhash: 'GRWbY9QAFPTVmKppBRYnLFkmyhyRKGC1VoX6Po4UrfUB',
    feeCalculator: { lamportsPerSignature: 5000 }
  }
}
Message =>  Message {
  header: {
    numReadonlySignedAccounts: 0,
    numReadonlyUnsignedAccounts: 1,
    numRequiredSignatures: 1
  },
  accountKeys: [
    PublicKey {
      _bn: <BN: c0ad460071780555e12b7568aaa1e26821cf161673dfeff7bcfc145eff785fa8>
    },
    PublicKey {
      _bn: <BN: 6ba0e812dc237da22839b1a2a1788b5c1b18f26748adb407acfead96bb5d60c>
    },
    PublicKey { _bn: <BN: 0> }
  ],
  recentBlockhash: {
    blockhash: 'GRWbY9QAFPTVmKppBRYnLFkmyhyRKGC1VoX6Po4UrfUB',
    feeCalculator: { lamportsPerSignature: 5000 }
  },
  instructions: [
    { accounts: [Array], data: '3Bxs3zrfFUZbEPqZ', programIdIndex: 2 }
  ],
  indexToProgramIds: Map(1) { 2 => PublicKey { _bn: <BN: 0> } }
}
Transaction.populate ->  Transaction {
  signatures: [
    {
      signature: <Buffer 32 9c ab f6 e3 3b 1e 0b 42 8a 10 e7 43 16 cd ea 38 64 8d 1d 51 f8 f3 88 f5 db af 00 d8 fb 09 a0 ea 6a 05 9f e8 db 13 f3 9c b1 e3 39 cf e6 02 b2 a5 26 ... 14 more bytes>,
      publicKey: [PublicKey]
    }
  ],
  feePayer: PublicKey {
    _bn: <BN: c0ad460071780555e12b7568aaa1e26821cf161673dfeff7bcfc145eff785fa8>
  },
  instructions: [
    TransactionInstruction {
      keys: [Array],
      programId: [PublicKey],
      data: <Buffer 02 00 00 00 00 00 00 00 00 00 00 00>
    }
  ],
  recentBlockhash: '2QAfZwsaLsU3wjxKGMf2CRxLNa4m6vpN8yZiddAstPe1',
  nonceInfo: undefined
}
*/
