// Source: https://www.quicknode.com/guides/solana-development/how-to-use-the-solana-memo-program
import {
  Keypair,
  Transaction,
  TransactionInstruction,
  PublicKey,
  Connection,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

async function main (message: string) {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  // ---------------------------------------------------
  // 1. Declare Keypair to sign transaction 
  // ---------------------------------------------------
  const payer = Keypair.generate();

  // --- Airdrop ---
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );
  let latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });
  // --- End Airdrop ---
  
  // ---------------------------------------------------
  // 2. Create Solana Transaction
  // ---------------------------------------------------
  let tx = new Transaction();

  // ---------------------------------------------------
  // 3. Add Memo Instruction
  // ---------------------------------------------------
  await tx.add(
      new TransactionInstruction({
        keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(message, "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
    )
  // ---------------------------------------------------
  // 4. Send Transaction
  // ---------------------------------------------------
  const signature = await sendAndConfirmTransaction(connection, tx, [payer]);

  // ---------------------------------------------------
  // 5. Get Memo
  // ---------------------------------------------------
  // Use getSignaturesForAddress
  const getSignaturesByAddress = await connection.getSignaturesForAddress(payer.publicKey);
  const memoByAddress = getSignaturesByAddress[0].memo; // [0] means get latest transaction signature

  // Use getConfirmedSignaturesForAddress2
  const getConfirmedSignaturesByAddress = await connection.getConfirmedSignaturesForAddress2(payer.publicKey);
  const memoByConfirmedAddress = getConfirmedSignaturesByAddress[0].memo; // [0] means get latest transaction signature


  console.log('signature =>', signature);
  console.log('memoByAddress =>', memoByAddress);
  console.log('memoByConfirmedAddress =>', memoByConfirmedAddress);
}

const memo = 'This is Memo Message';
main(memo);

/*
% ts-node <THIS FILE>
signature => 39dkg6pFdpbnt7SSm5o4bmwcrTwh5e6rjywSP9kCXRFnuR8oiYRq9jKvjH87SD4KfwJ43yHCvy7oue2EfWk9yCPg
memoByAddress => [20] This is Memo Message
memoByConfirmedAddress => [20] This is Memo Message
*/