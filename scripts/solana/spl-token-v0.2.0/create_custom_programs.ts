// Source: https://docs.solana.com/developing/clients/javascript-api#interacting-with-custom-programs
import {struct,u32, ns64} from "@solana/buffer-layout";
import {Buffer} from 'buffer';
import web3 from "@solana/web3.js";

async function main() {
  let keypair = web3.Keypair.generate();
  let payer = web3.Keypair.generate();

  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  let airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(airdropSignature);

  let allocateTransaction = new web3.Transaction({
    feePayer: payer.publicKey
  });
  let keys = [{pubkey: keypair.publicKey, isSigner: true, isWritable: true}];
  let params = { space: 100 };

  let allocateStruct = {
    index: 8,
    layout: struct([
      u32('instruction'),
      ns64('space'),
    ] as any)
  };

  let data = Buffer.alloc(allocateStruct.layout.span);
  let layoutFields = Object.assign({instruction: allocateStruct.index}, params);
  allocateStruct.layout.encode(layoutFields, data);

  allocateTransaction.add(new web3.TransactionInstruction({
    keys,
    programId: web3.SystemProgram.programId,
    data,
  }));

  let signature = await web3.sendAndConfirmTransaction(connection, allocateTransaction, [payer, keypair]);

  console.log('From => ', keypair.publicKey.toString());
  console.log('To => ', payer.publicKey.toString());
  console.log('Signature => ', signature);
}

main();
/*
% node <THIS JS FILE>
From =>  FLjBZzd7qEmodu4WrTyiTXCaLsGUjjPRHRCMYAgZkp2c
To =>  FNxQPD9aFpUVFEWkqfF6rwdNWQZhLXUehuvVGGc83DKX
Signature => 5MhJWsX8Ru2CKe1tUH8KpPgDXUVRonYKT9aNYAUegw7fp152AKJKxjE878PB2C99crXPsPVG5368kfmyf6BMgzrF
*/
