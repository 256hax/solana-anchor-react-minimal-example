// Ref: https://solanacookbook.com/references/accounts.html#how-to-create-pdas
import {
  PublicKey,
} from "@solana/web3.js";

export const main = async () => {
  // ------------------------------------------------------------------------
  //  Generate PDA Account(not yet create)
  // ------------------------------------------------------------------------
  // Owned program
  const programId = new PublicKey(
    "G1DCNUQTSGHehwdLCAmRyAG8hf51eCHrLNUqkgGKYASj" // Example
  );

  const seed = 'test';

  // Ref: https://solana-labs.github.io/solana-web3.js/classes/PublicKey.html#findProgramAddressSync
  const [pda, bump] = await PublicKey.findProgramAddressSync(
    [Buffer.from(seed)],
    programId
  );

  console.log('bump =>', bump);
  console.log('pda =>', pda.toString());
};

main();

/*
% ts-node <THIS FILE>
bump => 253
pda => AfEjen5hHkTkEqy2yfyPhDQWq7dc7zbWU2aJmB3h8brU
*/