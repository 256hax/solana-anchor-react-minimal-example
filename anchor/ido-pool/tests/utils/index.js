const spl = require("@solana/spl-token");
const anchor = require("@project-serum/anchor");
const serumCmn = require("@project-serum/common");
const TokenInstructions = require("@project-serum/serum").TokenInstructions;

// TODO: remove this constant once @project-serum/serum uses the same version
//       of @solana/web3.js as anchor (or switch packages).
const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
  TokenInstructions.TOKEN_PROGRAM_ID.toString()
);

// Our own sleep function.
function sleep(ms) {
  console.log("Sleeping for", ms / 1000, "seconds");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTokenAccount(provider, addr) {
  return await serumCmn.getTokenAccount(provider, addr);
}

async function createMint(provider, authority) {
  if (authority === undefined) {
    authority = provider.wallet.publicKey;
  }
  // Ref: https://github.com/solana-labs/solana-program-library/blob/78cb32435296eb258ec3de76ee4ee2d391f397ee/token/js/client/token.js#L384
  const mint = await spl.Token.createMint(
    provider.connection, // connection
    provider.wallet.payer, // payer
    authority, // mintAuthority
    null, // freezeAuthority
    6, // decimals
    TOKEN_PROGRAM_ID // programId
  );
  return mint;
}

async function createTokenAccount(provider, mint, owner) {
  const token = new spl.Token(
    provider.connection,
    mint,
    TOKEN_PROGRAM_ID,
    provider.wallet.payer
  );
  let vault = await token.createAccount(owner);
  return vault;
}

module.exports = {
  TOKEN_PROGRAM_ID,
  sleep,
  getTokenAccount,
  createTokenAccount,
  createMint,
};
