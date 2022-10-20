import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';

export const main = async () => {
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');


  // --- Payer -------------------------------------------------------------
  const payer = Keypair.generate();

  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );

  let latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });


  // --- Token -------------------------------------------------------------
  const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // USDC Token in Devnet


  // --- Get ATA -------------------------------------------------------------
  // Ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#getAssociatedTokenAddress
  // Note: Only check ATA(Associated Token Address). It doesn't exist ATA yet.
  const ata = await getAssociatedTokenAddress(
    mint, // mint
    payer.publicKey, // owner
  );

  
  // --- Create ATA Instruction -------------------------------------------------------------
  // Ref: https://solana-labs.github.io/solana-program-library/token/js/modules.html#createAssociatedTokenAccountInstruction
  const ataInstruction = await createAssociatedTokenAccountInstruction(
    payer.publicKey, // payer
    ata, // associatedToken
    payer.publicKey, // owner
    mint, // mint
  );


  // --- Transfer Transaction -------------------------------------------------------------
  const transferTransaction = new Transaction().add(
    ataInstruction
  );
  
  const tx = await sendAndConfirmTransaction(connection, transferTransaction, [payer]);


  console.log('owner =>', payer.publicKey.toString());
  console.log('Associated Token Address =>', ata.toString());
  console.log('ATA Instruction =>', ataInstruction);
  console.log('tx =>', tx);
};

main();

/*
% ts-node <THIS FILE>
owner => BQjp5QPmD5bRQXyFPaRfTT11Jo6jmEFCwTL8D8VsEooL
Associated Token Address => CHKrhgLodpx7T2MGfLSeHBrSq7nXUt26xzKGLnPxGfe8
ATA Instruction => TransactionInstruction {
  keys: [
    { pubkey: [PublicKey], isSigner: true, isWritable: true },
    { pubkey: [PublicKey], isSigner: false, isWritable: true },
    { pubkey: [PublicKey], isSigner: false, isWritable: false },
    { pubkey: [PublicKey], isSigner: false, isWritable: false },
    { pubkey: [PublicKey], isSigner: false, isWritable: false },
    { pubkey: [PublicKey], isSigner: false, isWritable: false }
  ],
  programId: PublicKey {
    _bn: <BN: 8c97258f4e2489f1bb3d1029148e0d830b5a1399daff1084048e7bd8dbe9f859>
  },
  data: <Buffer >
}
tx => 2oiS84mDbcBZqeQjvim3sUS6uhC9segPRzFjmVLvbeuvi6ZoDMkGY2PG2hpvFWc3r4JopfGXfLLzcQkW265urycR
*/