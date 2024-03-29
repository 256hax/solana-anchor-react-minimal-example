// --- Common ---
import * as anchor from "@coral-xyz/anchor";
import { Connection, clusterApiUrl, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage, mockStorage } from "@metaplex-foundation/js";
import { assert, expect } from 'chai';

// --- Modules ---
import { initializeWallets } from '../app/modules/initializeWallets';
import { airdrop } from '../app/modules/airdrop';
import { createNfts } from '../app/modules/createNfts';
import { mintNfts } from '../app/modules/mintNfts';
import { createPda } from '../app/modules/createPda';
import { updateToOriginalOwner } from '../app/modules/updateToOriginalOwner';
import { setAuthorityEscrow } from '../app/modules/setAuthorityEscrow';
import { revealNft } from '../app/modules/revealNft';
import { eligibleWinner } from '../app/modules/eligibleWinner';
import { pickupWinner } from '../app/modules/pickupWinner';
import { transferReward } from '../app/modules/transferReward';

// // --- [Localnet(Mock)] ---
// import { createNfts as mockCreateNfts } from '../app/modules/mock/createNfts';
// import { mintNfts as mockMintNfts } from '../app/modules/mock/mintNfts';
// import { createPda as mockCreatePda } from '../app/modules/mock/createPda';
// import { updateToOriginalOwner as mockUpdateToOriginalOwner } from '../app/modules/mock/updateToOriginalOwner';
// import { revealNft as mockRevealNft } from '../app/modules/mock/revealNft';


describe("Guess the number", () => {
  // --- Anchor Setting ---
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.Guess;

  // --- Users Setting ---
  // @ts-ignore
  let payer: Keypair = provider.wallet.payer; // HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
  let taker1: Keypair; // BBCkTVFxZbLPar5YpjqBzymPkcZvT7RMuDK59bbaPTd4
  // let taker2: Keypair; // DD83TEq47JeMKKrJqQWzabVmYkQfsof8CHsybQtGJvpo
  // let hacker: Keypair; // TODO

  // --- Metaplex Setting ---
  const connectionMetaplex = new Connection(clusterApiUrl("devnet"));
  const metaplex = Metaplex.make(connectionMetaplex)
    .use(keypairIdentity(payer))
    // [Devnet]
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
    }));
    // [Localnet(Mock)]
    // .use(mockStorage()); 

  // --- NFT Setting ---
  let nftQ: PublicKey;
  let nft1: PublicKey;
  // let nft2: PublicKey;
  const pdaSeed = 'user-answers';
  const correctName = 'Number 1';
  const prize = 0.0001; // SOL
  let winnerNfts: any;
  let winnerPublicKey: PublicKey | null;

  it("Initialize wallets", async () => {
    const taker1SecretKeyPath = './keys/taker1.key.json';
    taker1 = await initializeWallets(taker1SecretKeyPath);

    // [Localnet(Mock)]
    // If you got "too many request", comment out following.
    // await airdrop(connection, taker1.publicKey);

    const payerBalance = await connection.getBalance(payer.publicKey);
    const taker1Balance = await connection.getBalance(taker1.publicKey);

    assert.isAtLeast(payerBalance, LAMPORTS_PER_SOL);
    assert.isAtLeast(taker1Balance, LAMPORTS_PER_SOL);

    console.log('payer =>', payer.publicKey.toString());
    console.log('taker1 =>', taker1.publicKey.toString());
  });

  //--------------------------------------------------
  // Set NFTs by payer
  //--------------------------------------------------
  it("Create NFTs", async () => {
    const metadataQ = {
      name: 'Q',
      description: 'This is secret Q!',
      filePath: './app/assets/images/question.png',
      fileName: 'question.png'
    };

    const metadata1 = {
      name: 'Number 1',
      description: 'This is 1!',
      filePath: './app/assets/images/number_1.png',
      fileName: 'number_1.png'
    };

    // // [Devnet]
    nftQ = await createNfts(metaplex, metadataQ);
    nft1 = await createNfts(metaplex, metadata1);

    // [Localnet(Mock)]
    // nftQ = await mockCreateNfts(connection, payer);
    // nft1 = await mockCreateNfts(connection, payer);

    // assert(nftQ != null);
    assert(nft1 != null);

    console.log('Mint AddressQ =>', nftQ.toString());
    console.log('Mint Address1 =>', nft1.toString());
  });

  //--------------------------------------------------
  // Actions for NFT by payer/taker
  //--------------------------------------------------
  it("Mint NFTs by taker", async () => {
    // [Devnet] Stub
    // nftQ = new PublicKey('CSfsbjH5ZuXbRwAiJMPvZ64NeCEbKcqS3b3mofQyx9Ti');
    // nft1 = new PublicKey('32C56CDq2M5mKTPcjn67YnSMphocuiWztBsVjWUneH1K');

    // [Devnet]
    const signatureNftQ = await mintNfts(connection, payer, payer.publicKey, nftQ);
    const signatureNft1 = await mintNfts(connection, payer, taker1.publicKey, nft1);

    // [Localnet(Mock)]
    // const signatureNftQ = await mockMintNfts(connection, payer, payer.publicKey, nftQ);
    // const signatureNft1 = await mockMintNfts(connection, payer, taker1.publicKey, nft1);

    assert(signatureNftQ != null);
    assert(signatureNft1 != null);

    console.log('signatureNftQ =>', signatureNftQ);
    console.log('signatureNft1 =>', signatureNft1);
  });

  it("Create PDA for deposit NFT", async () => {
    // [Devnet]
    const [signatureTaker1, fetchUserAnswersTaker1, tokenAccountTaker1] = await createPda(
      metaplex,
      connection,
      program,
      taker1,
      nft1,
      pdaSeed,
    );

    // [Localnet(Mock)]
    // const [signatureTaker1, fetchUserAnswersTaker1, tokenAccountTaker1] = await mockCreatePda(
    //   connection,
    //   program,
    //   taker1,
    //   nft1,
    //   pdaSeed,
    // );

    assert.equal(
      fetchUserAnswersTaker1.tokenAccount.toString(),
      tokenAccountTaker1.toString(),
    );

    console.log('signatureTaker1 =>', signatureTaker1);
    console.log('AnswersPdaTaker1.answer =>', fetchUserAnswersTaker1.answer);
  });

  // it("Withdraw taker's NFT", async () => {
  // });

  it("Update NFT to original owner by payer", async () => {
    // [Devnet]
    const taker1OriginalOwner = await updateToOriginalOwner(
      metaplex,
      taker1.publicKey,
      nft1,
    );

    // [Locanet(Mock)]
    // const taker1OriginalOwner = await mockUpdateToOriginalOwner(
    //   taker1.publicKey,
    //   nft1,
    //   payer,
    // );

    assert.equal(taker1OriginalOwner.toString(), taker1.publicKey.toString());
  });

  it("Set Authority for Token Account(NFT) by taker", async () => {
    // [Devnet] and [Locanet(Mock)]
    const [signatureTaker1, tokenAccountOwnerTaker1] = await setAuthorityEscrow(
      connection,
      program,
      taker1,
      nft1,
      payer.publicKey,
      pdaSeed,
    );
  
    assert.equal(
      tokenAccountOwnerTaker1.toString(),
      payer.publicKey.toString(),
    );

    console.log('signatureTaker1 =>', signatureTaker1);
    console.log('tokenAccountInfoTaker1.owner =>', tokenAccountOwnerTaker1.toString());
  });

  //--------------------------------------------------
  // Announcement by payer
  //--------------------------------------------------
  it("Reveal correct an NFT", async () => {
    // [Devnet]
    const attributes = [
      {
        "trait_type": 'Prize(SOL)',
        "value": prize
      }
    ];
    const [nftQName, nftQPrize] = await revealNft(
      metaplex,
      nftQ,
      attributes,
      correctName,
    );

    // [Localnet(Mock)]
    // const [signature, nftQName, nftQPrize] = mockRevealNft();

    assert.equal(nftQName, 'Number 1');
    assert.equal(Number(nftQPrize), prize);
  });

  it("Pickup eligible winner", async () => {
    // [Devnet]
    winnerNfts = await eligibleWinner(
      metaplex,
      payer.publicKey,
      correctName,
    );

    assert(winnerNfts != null);
    console.log('winnerNfts.length =>', winnerNfts.length);
  });

  it("Pickup winner", async () => {
    winnerPublicKey = await pickupWinner(
      payer,
      winnerNfts,
    );

    assert(winnerPublicKey != null);
    console.log('winnerPublicKey =>', winnerPublicKey);
  });

  it("Transfer reward to winner", async () => {
    const signature = await transferReward(
      connection,
      payer,
      winnerPublicKey,
      prize,
    );

    console.log('signature =>', signature);
  });

  //--------------------------------------------------
  // Close by payer
  //--------------------------------------------------
  // it("Burn all of taker's NFT", async () => {
  // });
  //
  // it("Close taker's PDA", async () => {
  // });
});