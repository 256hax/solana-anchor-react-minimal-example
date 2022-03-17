// Source: https://github.com/project-serum/anchor/blob/master/tests/escrow/tests/escrow.ts
import './App.css';
import React from 'react';
import * as anchor from "@project-serum/anchor";
import { Program, BN, IdlAccounts, Provider } from "@project-serum/anchor";
import { PublicKey, Keypair, SystemProgram, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { Escrow } from "../../anchor/target/types/escrow";
import idl from './idl.json';
import { Buffer } from 'buffer';

type EscrowAccount = IdlAccounts<Escrow>["escrowAccount"];
const preflightCommitment = "processed"
const programID = new PublicKey(idl.metadata.address);

// For "Property 'solana' does not exist on type 'Window & typeof globalThis'" error.
interface Window {
  solana: any
}
declare var window: Window

// For "ReferenceError: Buffer is not defined" error.
// @ts-ignore
window.Buffer = Buffer;

function App() {
  let mintA: Token = null;
  let mintB: Token = null;
  let initializerTokenAccountA: PublicKey = null;
  let initializerTokenAccountB: PublicKey = null;
  let takerTokenAccountA: PublicKey = null;
  let takerTokenAccountB: PublicKey = null;
  let pda: PublicKey = null;

  const takerAmount = 1000;
  const initializerAmount = 500;

  const escrowAccount = Keypair.generate();
  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();


  async function connectWallet() {
    try {
        const resp = await window.solana.connect();
        console.log("Connected! Public Key: ", resp.publicKey.toString());
    } catch (err) {
        console.log(err);
        // => { code: 4001, message: 'User rejected the request.' }
    }
  }

  async function disconnectWallet() {
    window.solana.disconnect();
    window.solana.on('disconnect', () => console.log("Disconnected!"));
  }

  async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, preflightCommitment);
    const wallet = window.solana;

    const provider = new Provider(
      connection, wallet, { preflightCommitment }
    );
    return provider;
  }


  async function initializeEscrowState() {
    const provider = await getProvider();

    // Airdropping tokens to a payer.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL * 10),
      "confirmed"
    );
    const payerAirdroppedBalance = await provider.connection.getBalance(payer.publicKey);
    console.log("payerAirdroppedBalance -> ", payerAirdroppedBalance);

    mintA = await Token.createMint(
      provider.connection,      // connection: Connection
      payer,                    // payer: Signer
      mintAuthority.publicKey,  // mintAuthority: PublicKey
      null,                     // freezeAuthority: PublicKey | null
      0,                        // decimals: number
      TOKEN_PROGRAM_ID          // programId = TOKEN_PROGRAM_ID
    );

    mintB = await Token.createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );

    initializerTokenAccountA = await mintA.createAccount(
      provider.wallet.publicKey
    );
    takerTokenAccountA = await mintA.createAccount(provider.wallet.publicKey);

    initializerTokenAccountB = await mintB.createAccount(
      provider.wallet.publicKey
    );
    takerTokenAccountB = await mintB.createAccount(provider.wallet.publicKey);

    await mintA.mintTo(
      initializerTokenAccountA,
      mintAuthority.publicKey,
      [mintAuthority],
      initializerAmount
    );

    await mintB.mintTo(
      takerTokenAccountB,
      mintAuthority.publicKey,
      [mintAuthority],
      takerAmount
    );

    let _initializerTokenAccountA = await mintA.getAccountInfo(
      initializerTokenAccountA
    );
    let _takerTokenAccountB = await mintB.getAccountInfo(takerTokenAccountB);

    console.log('--- initializeEscrowState ---');
    console.log('_initializerTokenAccountA.amount.toNumber() =>', _initializerTokenAccountA.amount.toNumber());
    console.log('_takerTokenAccountB.amount.toNumber() =>', _takerTokenAccountB.amount.toNumber());
  }


  async function initializeEscrow() {
    const provider = await getProvider();
    // @ts-ignore
    const program = new Program(idl, programID, provider);

    await program.rpc.initializeEscrow(
      new BN(initializerAmount),
      new BN(takerAmount),
      {
        accounts: {
          initializer: provider.wallet.publicKey,
          initializerDepositTokenAccount: initializerTokenAccountA,
          initializerReceiveTokenAccount: initializerTokenAccountB,
          escrowAccount: escrowAccount.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers: [escrowAccount],
      }
    );

    // Get the PDA that is assigned authority to token account.
    const [_pda, _nonce] = await PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("escrow"))],
      program.programId
    );

    pda = _pda;

    let _initializerTokenAccountA = await mintA.getAccountInfo(
      initializerTokenAccountA
    );

    // @ts-ignore
    let _escrowAccount: EscrowAccount = await program.account.escrowAccount.fetch(escrowAccount.publicKey);
    // or
    // let _escrowAccount = await program.account.escrowAccount.fetch(escrowAccount.publicKey);

    console.log('--- initializeEscrow ---');
    console.log('Check that the new owner is the PDA.');
    console.log('_initializerTokenAccountA.owner =>', _initializerTokenAccountA.owner.toString());

    console.log('Check that the values in the escrow account match what we expect.');
    console.log('_escrowAccount.initializerKey =>', _escrowAccount.initializerKey.toString());
    console.log('_escrowAccount.initializerAmount.toNumber() =>', _escrowAccount.initializerAmount.toNumber());
    console.log('_escrowAccount.takerAmount.toNumber() =>', _escrowAccount.takerAmount.toNumber());
    console.log('_escrowAccount.initializerDepositTokenAccount =>', _escrowAccount.initializerDepositTokenAccount.toString());
    console.log('_escrowAccount.initializerReceiveTokenAccount =>', _escrowAccount.initializerReceiveTokenAccount.toString());
  }

  async function exchangeEscrow() {
    const provider = await getProvider();
    // @ts-ignore
    const program = new Program(idl, programID, provider);

    await program.rpc.exchange({
      accounts: {
        taker: provider.wallet.publicKey,
        takerDepositTokenAccount: takerTokenAccountB,
        takerReceiveTokenAccount: takerTokenAccountA,
        pdaDepositTokenAccount: initializerTokenAccountA,
        initializerReceiveTokenAccount: initializerTokenAccountB,
        initializerMainAccount: provider.wallet.publicKey,
        escrowAccount: escrowAccount.publicKey,
        pdaAccount: pda,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });

    let _takerTokenAccountA = await mintA.getAccountInfo(takerTokenAccountA);
    let _takerTokenAccountB = await mintB.getAccountInfo(takerTokenAccountB);
    let _initializerTokenAccountA = await mintA.getAccountInfo(
      initializerTokenAccountA
    );
    let _initializerTokenAccountB = await mintB.getAccountInfo(
      initializerTokenAccountB
    );

    console.log('--- exchangeEscrow ---');
    console.log('Check that the initializer gets back ownership of their token account.')
    console.log('_takerTokenAccountA.owner =>', _takerTokenAccountA.owner.toString());

    console.log('_takerTokenAccountA.amount.toNumber() =>', _takerTokenAccountA.amount.toNumber());
    console.log('_initializerTokenAccountA.amount.toNumber() =>', _initializerTokenAccountA.amount.toNumber());
    console.log('_initializerTokenAccountB.amount.toNumber() =>', _initializerTokenAccountB.amount.toNumber());
    console.log('_takerTokenAccountB.amount.toNumber() =>', _takerTokenAccountB.amount.toNumber());
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connectWallet}>Connect to Wallet</button>
        <button onClick={initializeEscrowState}>initializeEscrowState</button>
        <button onClick={initializeEscrow}>initializeEscrow</button>
        <button onClick={exchangeEscrow}>exchangeEscrow</button>
        <button onClick={disconnectWallet}>Disconnect</button>
      </header>
    </div>
  );
}

export default App;
