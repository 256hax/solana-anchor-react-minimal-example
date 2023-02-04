// Ref: https://github.com/metaplex-foundation/js#create
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  mockStorage,
  toBigNumber,
} from '@metaplex-foundation/js';
import {
  Connection,
  clusterApiUrl,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as fs from 'fs';

const main = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));

  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync('src/assets/id.json', 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);

  // ------------------------------------
  //  Airdrop
  // ------------------------------------
  // const wallet = Keypair.generate();

  // let airdropSignature = await connection.requestAirdrop(
  //   wallet.publicKey,
  //   LAMPORTS_PER_SOL,
  // );

  // const latestBlockHash = await connection.getLatestBlockhash();

  // await connection.confirmTransaction({
  //   blockhash: latestBlockHash.blockhash,
  //   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  //   signature: airdropSignature,
  // });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);

  // ------------------------------------
  //  Make Metaplex
  // ------------------------------------
  // Ref: bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  // ------------------------------------
  //  Mint NFT
  // ------------------------------------
  // The mint needs to sign the transaction, so we generate a new keypair for it
  const mintKeypair = Keypair.generate();

  // Create a transaction builder to create the NFT
  // Ref: builders: https://metaplex-foundation.github.io/js/classes/js.NftClient.html#builders
  const transactionBuilder = await metaplex
    .nfts()
    .builders()
    .create({
      uri: 'https://arweave.net/W-20MpV-N1l6e_vxWxjmGfFnGkiiUDn7GJAsgYmJ6fU',
      name: 'My NFT',
      sellerFeeBasisPoints: 500, // Represents 5.00%.
      maxSupply: toBigNumber(1),
      useNewMint: mintKeypair, // we pass our mint in as the new mint to use
    });

  // Convert to transaction
  const latestBlockhash = await connection.getLatestBlockhash()
  const transaction = await transactionBuilder.toTransaction(latestBlockhash)


  // Partially sign the transaction, as the shop and the mint
  // The account is also a required signer, but they'll sign it with their wallet after we return it
  // transaction.partialSign(wallet);
  transaction.sign(wallet);

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [wallet, mintKeypair]
  );

  console.log('mintKeypair.publicKey =>', mintKeypair.publicKey.toString());
  console.log('transactionBuilder =>', transactionBuilder);
  console.log('wallet.publicKey =>', wallet.publicKey.toString());
  console.log('signature =>', signature);
};

main();
/*
% ts-node <THIS FILE>
mintKeypair.publicKey => E2Q5oBRhTBSJEAaqUgfhrzoF22zPEQYXtiXMALZJD4ze
transactionBuilder => TransactionBuilder {
  records: [
    {
      instruction: [TransactionInstruction],
      signers: [Array],
      key: 'createAccount'
    },
    {
      instruction: [TransactionInstruction],
      signers: [Array],
      key: 'initializeMint'
    },
    {
      instruction: [TransactionInstruction],
      signers: [Array],
      key: 'createAssociatedTokenAccount'
    },
    {
      instruction: [TransactionInstruction],
      signers: [Array],
      key: 'mintTokens'
    },
    {
      instruction: [TransactionInstruction],
      signers: [Array],
      key: 'createMetadata'
    },
    {
      instruction: [TransactionInstruction],
      signers: [Array],
      key: 'createMasterEdition'
    }
  ],
  feePayer: IdentityClient {
    _driver: KeypairIdentityDriver {
      keypair: [Keypair],
      publicKey: [PublicKey],
      secretKey: [Uint8Array]
    }
  },
  context: {
    mintAddress: PublicKey {
      _bn: <BN: c1839c4c1678dde1efcb610dc56f07279bc6a5d62801340a1161920a55f891ab>
    },
    metadataAddress: Pda {
      _bn: <BN: b1f15c8c26dcc1f5c64c1d581cd9d1a3ac168adef29ea7a7af81f394211b07c>,
      bump: 255
    },
    masterEditionAddress: Pda {
      _bn: <BN: 33ef0c5613bbbc318e698ff0511b05a1881b0f655d2581e03b9163ce248e31de>,
      bump: 255
    },
    tokenAddress: Pda {
      _bn: <BN: cceeae77ee44c8e1f5eeb106ca4bd1fff82feb3f8fb35b68e0439a80da6b794e>,
      bump: 255
    }
  },
  transactionOptions: {}
}
wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
signature => 3vQiCQeR9JvbRxXyw9KysBZf9PcMLg4J3eCXDgMxm2pn5WFwAcCZ6j6J1kY3Fw8As92hV2NpYqT7SbnNR1YyJNCA
*/