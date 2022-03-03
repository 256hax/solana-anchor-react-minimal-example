const assert = require("assert");
const anchor = require("@project-serum/anchor");
const web3 = require('@solana/web3.js');

describe('sendAndConfirmTransaction', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const payer = anchor.web3.Keypair.generate();
  const toAccount = anchor.web3.Keypair.generate();

  it('airdroped!', async () => {
    const connection = provider.connection;
    let balance = await connection.getBalance(payer.publicKey);
    console.log("balance -> ", balance);

    const airdropSignature = await connection.requestAirdrop(
        payer.publicKey,
        web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
    console.log("Airdrop completed.");

    balance = await connection.getBalance(payer.publicKey);
    console.log("balance -> ", balance);


    const airdropSignatureToAccount = await connection.requestAirdrop(
        toAccount.publicKey,
        web3.LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignatureToAccount);
    console.log("toAccount Airdrop completed.");

    const balanceToAccount = await connection.getBalance(toAccount.publicKey);
    console.log("toAccount balance -> ", balanceToAccount);
  });

  it('has been completed!', async () => {
    const connection = provider.connection;

    const transaction = new anchor.web3.Transaction();
    transaction.add(anchor.web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000,
    }));

    // Ref: https://project-serum.github.io/anchor/ts/modules/web3.html#sendAndConfirmTransaction
    const signature = await anchor.web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [payer], // signers
    );
    console.log('signature -> ', signature);

    const balance = await connection.getBalance(payer.publicKey);
    console.log("balance -> ", balance);
  });
});
