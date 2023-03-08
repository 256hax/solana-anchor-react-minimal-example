// Ref: https://solanacookbook.com/references/accounts.html#how-to-create-pdas
import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";

export const main = async () => {
  // ------------------------------------------------------------------------
  //  Find PDA Account
  // ------------------------------------------------------------------------
  // Owned Program ID
  const programId = new PublicKey(
    "G1DCNUQTSGHehwdLCAmRyAG8hf51eCHrLNUqkgGKYASj" // Example
  );

  const seed = 'test';
  const myPublicKey = new PublicKey('4Zhbi9RNNb8zeFesJysW9F7G1sNHyfQrimHQHSSNavFw');

  // Ref: https://solana-labs.github.io/solana-web3.js/classes/PublicKey.html#findProgramAddressSync
  const [pda, bump] = await PublicKey.findProgramAddressSync(
    // [Buffer.from(seed)],
    [Buffer.from(seed), myPublicKey.toBuffer()],
    programId, // Create PDA from this Program ID
  );
  // IMPORTANT:
  // findProgramAddressSync is only getting address. Not created yet.
  // If you need activate PDA, send some rent fee(e.g. 0.001 SOL) to PDA or
  // use SystemProgram.createAccount.

  console.log('bump =>', bump);
  console.log('pda =>', pda.toString());
};

main();

/*
% ts-node <THIS FILE>
bump => 253
pda => GwgoAT2x9EosuxgmBJdhUp2n4dZDegqAPBnqN3uRMsQD
*/