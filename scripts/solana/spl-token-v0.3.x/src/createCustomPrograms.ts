// Source: https://docs.solana.com/developing/clients/javascript-api#interacting-with-custom-programs
import {
  struct,
  u32,
  ns64
} from '@solana/buffer-layout';
import { Buffer } from 'buffer';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionBlockhashCtor,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

export const main = async () => {
  // let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // ------------------------------------------
  //  Wallet
  // ------------------------------------------
  const keypair = Keypair.generate();
  const payer = Keypair.generate();

  // ------------------------------------------
  //  Airdrop
  // ------------------------------------------
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL,
  );

  let latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // ------------------------------------------
  //  Transaction
  // ------------------------------------------
  const options: TransactionBlockhashCtor = {
    feePayer: payer.publicKey,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  };

  const allocateTransaction = new Transaction(options);
  const keys = [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }];
  const params = { space: 100 };

  const allocateStruct = {
    index: 8,
    layout: struct([
      u32('instruction'),
      ns64('space'),
    ] as any)
  };

  const data = Buffer.alloc(allocateStruct.layout.span);
  const layoutFields = Object.assign({ instruction: allocateStruct.index }, params);
  allocateStruct.layout.encode(layoutFields, data);

  allocateTransaction.add(new TransactionInstruction({
    keys,
    programId: SystemProgram.programId,
    data,
  }));

  const signature = await sendAndConfirmTransaction(connection, allocateTransaction, [payer, keypair]);

  console.log('From => ', keypair.publicKey.toString());
  console.log('To => ', payer.publicKey.toString());
  console.log('Signature => ', signature);
};

main();

/*
% ts-node <THIS JS FILE>
From =>  FLjBZzd7qEmodu4WrTyiTXCaLsGUjjPRHRCMYAgZkp2c
To =>  FNxQPD9aFpUVFEWkqfF6rwdNWQZhLXUehuvVGGc83DKX
Signature => 5MhJWsX8Ru2CKe1tUH8KpPgDXUVRonYKT9aNYAUegw7fp152AKJKxjE878PB2C99crXPsPVG5368kfmyf6BMgzrF
*/