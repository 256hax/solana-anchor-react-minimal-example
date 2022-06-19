// Source: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getBalance
import * as web3 from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

export const main = async() => {
  let myPubkey = web3.Keypair.generate();
  let connection = new web3.Connection('http://localhost:8899', 'confirmed');

  console.log('myPubkey =>', myPubkey.publicKey.toString());


  let airdropSignature = await connection.requestAirdrop(
      myPubkey.publicKey,
      web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);


  const mint = await createMint(
    connection,
    myPubkey,                 // mint_pubkey: &Pubkey,
    myPubkey.publicKey,       // mint_authority_pubkey: &Pubkey,
    null,                       // freeze_authority_pubkey: Option<&Pubkey>,
    9,                          // decimals: u8,
  );

  //get the token account of the fromWallet Solana address, if it does not exist, create it
  const myTokenPubkey = await getOrCreateAssociatedTokenAccount(
    connection,
    myPubkey,
    mint,
    myPubkey.publicKey
  );

  console.log('\n--- Create Token Account ---');
  console.log('myTokenPubkey =>', myTokenPubkey);


  console.log('\n--- Token Account Balance ---');
  // Ref: https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getTokenAccountBalance
  const myTokenPubkeyBalance = await connection.getTokenAccountBalance(myTokenPubkey.address);
  console.log('myTokenPubkeyBalance.value.amount =>', myTokenPubkeyBalance.value.amount);


  console.log('\n--- Mint token ---');

  const mint_tx = await mintTo(
    connection,
    myPubkey,
    mint,
    myTokenPubkey.address,
    myPubkey.publicKey,
    1000000000,
    []
  );

  console.log('Minted LAMPORTS_PER_SOL tokens!');

  console.log('\n--- Token Account Balance ---');
  const myTokenPubkeyBalanceMinted = await connection.getTokenAccountBalance(myTokenPubkey.address);
  console.log('myTokenPubkeyBalanceMinted.value.amount =>', myTokenPubkeyBalanceMinted.value.amount);
};

main();

/*
% ts-node <THIS JS FILE>
myPubkey => DKpXE8EE9XYP1nesLL8nmNcPiBP3LsYgzUh4Uwct1xfo

--- Create Token Account ---
myTokenPubkey => {
  mint: PublicKey {
    _bn: <BN: e4cdaea68467e1bcdf2f314868858c0333428bb92287d9b610ad56077e714fe8>
  },
  owner: PublicKey {
    _bn: <BN: b71e6e14f26fae8eff8215c7cba7a11997fcf5d83e64796897231629bb60ae96>
  },
  amount: <BN: 0>,
  delegateOption: 0,
  delegate: null,
  state: 1,
  isNativeOption: 0,
  isNative: false,
  delegatedAmount: <BN: 0>,
  closeAuthorityOption: 0,
  closeAuthority: null,
  address: PublicKey {
    _bn: <BN: ea984a07545b2c317c0483eb4e99503dde66b46e35670de29d7287e7bbf9a235>
  },
  isInitialized: true,
  isFrozen: false,
  rentExemptReserve: null
}

--- Token Account Balance ---
myTokenPubkeyBalance.value.amount => 0

--- Mint token ---
Minted LAMPORTS_PER_SOL tokens!

--- Token Account Balance ---
myTokenPubkeyBalanceMinted.value.amount => 1000000000
*/
