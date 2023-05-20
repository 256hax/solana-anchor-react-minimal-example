import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// ---------------------------------------------------
//  Get Confirmation Status on Transaction repeatedly
//  untill target status.
// ---------------------------------------------------
export const watchSignatureStatus = async (
  connection: Connection,
  retry: number,
  closeStatus: string,
  publickey: PublicKey,
) => {
  const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let signatureInfo;
  let confirmationStatus;

  for (let i = 0; i < retry; i++) {
    console.count('Checking for Confirmation Status...');
    signatureInfo = await connection.getSignaturesForAddress(publickey);

    if (signatureInfo[0]) {
      confirmationStatus = signatureInfo[0].confirmationStatus;

      if (signatureInfo[0].confirmationStatus == closeStatus) {
        console.log('Status =>', confirmationStatus);
        console.log('Wacthing close.');

        return;
      }
    }

    await sleep(10);
  }
};

const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  const payer = Keypair.generate();
  const reference = Keypair.generate();
  const taker = Keypair.generate();

  // ------------------------------------
  //  Airdrop to Fee Payer
  // ------------------------------------
  const latestBlockhash = await connection.getLatestBlockhash();
  const signatureAirdrop = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: signatureAirdrop,
  });

  // ------------------------------------
  //  Transfer
  // ------------------------------------
  let tx = new Transaction();
  const blockHash = await connection.getLatestBlockhash();

  let txInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  txInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  tx.add(txInstruction);

  tx.recentBlockhash = blockHash.blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  await connection.sendRawTransaction(tx.serialize());

  await watchSignatureStatus(
    connection,  // connection
    200, // retry
    'confirmed', // close status
    reference.publicKey, // publickey
  );
};

main();