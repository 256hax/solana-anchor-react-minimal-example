import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionBlockhashCtor,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export const main = async () => {
  // let connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // ------------------------------------------
  //  Wallet
  // ------------------------------------------
  const payer = Keypair.generate();
  const reference = Keypair.generate();
  const taker = Keypair.generate();

  // ------------------------------------------
  //  Airdrop
  // ------------------------------------------
  let airdropSignature = await connection.requestAirdrop(
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
  //  Create Transaction Instruction
  // ------------------------------------------
  let transaction = new Transaction();

  let transferInstruction = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: taker.publicKey,
    lamports: LAMPORTS_PER_SOL * 0.001,
  });

  // Ref: https://solana-labs.github.io/solana-web3.js/classes/TransactionInstruction.html
  // Add read-only publickey for search.
  transferInstruction.keys.push(
    { pubkey: reference.publicKey, isWritable: false, isSigner: false },
  );

  transaction.add(transferInstruction);

  // ------------------------------------------
  //  Execute Transaction
  // ------------------------------------------
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  console.log('payer => ', payer.publicKey.toString());
  console.log('reference => ', reference.publicKey.toString());
  console.log('taker => ', taker.publicKey.toString());
  console.log('transferInstruction =>',  transferInstruction);
  console.log('Signature => ', signature);
};

main();

/*
% ts-node <THIS JS FILE>
payer =>  28CneegKU1BiR2ArpoWtCykVJT1Sscd2yESZwpRQermG
reference =>  8soaoi7xSwQDn4JbUv9Drz959j2qv1h6p9oZ1TPjnvtQ
taker =>  CYWTbrxrAx8yUCqqZ8bdxxreWwR7qzr1yeHtnSW3ceNj
transferInstruction => TransactionInstruction {
  keys: [
    {
      pubkey: [PublicKey [PublicKey(28CneegKU1BiR2ArpoWtCykVJT1Sscd2yESZwpRQermG)]],
      isSigner: true,
      isWritable: true
    },
    {
      pubkey: [PublicKey [PublicKey(CYWTbrxrAx8yUCqqZ8bdxxreWwR7qzr1yeHtnSW3ceNj)]],
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: [PublicKey [PublicKey(8soaoi7xSwQDn4JbUv9Drz959j2qv1h6p9oZ1TPjnvtQ)]],
      isWritable: false,
      isSigner: false
    }
  ],
  programId: PublicKey [PublicKey(11111111111111111111111111111111)] {
    _bn: <BN: 0>
  },
  data: <Buffer 02 00 00 00 40 42 0f 00 00 00 00 00>
}
Signature =>  3iK8vQiefcdy7GHW7yykkmtZc2yy1PKSvsiBiZRx9BV5VH6NzfmRRvCibyGJezfjYQRLcXDsRAx3UG3R9sU3z4Ab
*/