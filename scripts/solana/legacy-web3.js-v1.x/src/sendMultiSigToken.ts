// Source: https://spl.solana.com/token#multisig-usage
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  createMultisig,
  createMint,
  mintTo,
  getMint,
} from '@solana/spl-token';

export const main = async () => {
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  // let connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  // -------------------------------------------
  //  Payer
  // -------------------------------------------
  // Airdrop SOL for paying transactions
  const payer = Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // -------------------------------------------
  //  Signers
  // -------------------------------------------
  const signer1 = Keypair.generate();
  const signer2 = Keypair.generate();
  const signer3 = Keypair.generate();

  // -------------------------------------------
  //  Multi Signs
  // -------------------------------------------
  /*
  Quote by Solana Program Library Docs:
  Now the multisig account can be created with the spl-token create-multisig subcommand. Its first positional argument is the minimum number of signers (M) that must sign a transaction affecting a token/mint account that is controlled by this multisig account. The remaining positional arguments are the public keys of all keypairs allowed (N) to sign for the multisig account. This example will use a "2 of 3" multisig account. That is, two of the three allowed keypairs must sign all transactions.

  NOTE: SPL Token Multisig accounts are limited to a signer-set of eleven signers (1 <= N <= 11) and minimum signers must be no more than N (1 <= M <= N)
  */
  const multisigKey = await createMultisig(
    connection, // connection
    payer, // payer
    [ // signers
      signer1.publicKey,
      signer2.publicKey,
      signer3.publicKey,
    ],
    2 // M. minimum number of signers (M) that must sign.
  );

  console.log(`Created 2/3 multisig ${multisigKey.toBase58()}`);

  // ---------------------------------------------------
  //  Create Token
  // ---------------------------------------------------
  const mint = await createMint(
    connection, // connection
    payer, // payer
    multisigKey, // mintAuthority
    multisigKey, // freezeAuthority
    9
  );

  const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    signer1.publicKey
  );

  await mintTo(
    connection, // connection
    payer, // payer
    mint, // mint
    associatedTokenAccount.address, // destination
    multisigKey, // authority
    1, // amount
    [ // multiSigners
      signer1,
      signer2
    ]
  );

  const mintInfo = await getMint(
    connection,
    mint
  );

  console.log(`Minted ${mintInfo.supply} token`);
  // Minted 1 token
};

main();

/*
% ts-node <THIS FILE>
Created 2/3 multisig GS9ZDWtS8tPCQ5ba2ozjyCCyKXwoQWTuu6vhNGPyfXku
Minted 1 token
*/