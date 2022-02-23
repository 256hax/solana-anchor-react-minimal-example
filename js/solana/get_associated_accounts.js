// Ref: https://solana-labs.github.io/solana-web3.js/classes/Connection.html
const web3 = require('@solana/web3.js');

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  const ph_ed_address = new web3.PublicKey('HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg');
  const ph_ch_address = new web3.PublicKey('2SN6o2mb4DFBEgSNcDqcdN5HWqa38xyF6F6xtTQ3HRwn');
  const addresses     = [ph_ed_address, ph_ch_address];

  const token_program_id = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const my_token_mint_address = new web3.PublicKey('29W5PHfs5EnQviwSgsZWG9E9hmnz3CXaivMpzPcjxPZ5'); // Mint Authority: ph_ed_address
  const anchor_sample_program_id = new web3.PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'); // Upgrade Authority: ph_ed_address
  const metaplex_token_metadata_program_id = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');


  // [Note] If you want to decode, use JSON.stringify.
  // ex) JSON.stringify(<RESPONSE JSON DATA>, null, 2)

  const getAccountInfo = await connection.getAccountInfo(metaplex_token_metadata_program_id);
  console.log("\n----------------------------------------------------------------------");
  // console.log('getAccountInfo =>', JSON.stringify(getAccountInfo, null, 2));
  console.log('getAccountInfo =>', getAccountInfo);


  const getMultipleAccountsInfo = await connection.getMultipleAccountsInfo(addresses);
  console.log("\n----------------------------------------------------------------------");
  console.log('getMultipleAccountsInfo =>', getMultipleAccountsInfo);


  const getParsedAccountInfo = await connection.getParsedAccountInfo(metaplex_token_metadata_program_id);
  console.log("\n----------------------------------------------------------------------");
  console.log('getParsedAccountInfo =>', getParsedAccountInfo);


  const getParsedProgramAccounts = await connection.getParsedProgramAccounts(anchor_sample_program_id);
  console.log("\n----------------------------------------------------------------------");
  console.log('getParsedProgramAccounts =>', getParsedProgramAccounts);


  // Ref: https://solana-labs.github.io/solana-web3.js/modules.html#TokenAccountsFilter
  const getTABO_TokenAccountsFilter = web3.TokenAccountsFilter = {
    mint: my_token_mint_address
    // or
    // programId: token_program_id
  }
  const getTokenAccountsByOwner = await connection.getTokenAccountsByOwner(ph_ed_address, getTABO_TokenAccountsFilter);
  console.log("\n----------------------------------------------------------------------");
  console.log('getTokenAccountsByOwner =>', getTokenAccountsByOwner);
}

main();

/*
% node <THIS JS FILE>
----------------------------------------------------------------------
getAccountInfo => {
  data: <Buffer 02 00 00 00 05 e0 15 6c a7 d5 d4 e9 c8 42 21 bf 8a 4b d5 b6 bf 5e 54 4a 33 cd 53 cb 20 0b 23 49 3c b4 68 10>,
  executable: true,
  lamports: 1141440,
  owner: PublicKey {
    _bn: <BN: 2a8f6914e88a1b0e210153ef763ae2b00c2b93d16c124d2c0537a1004800000>
  },
  rentEpoch: 139
}

----------------------------------------------------------------------
getMultipleAccountsInfo => [
  {
    data: <Buffer >,
    executable: false,
    lamports: 34799357143,
    owner: PublicKey { _bn: <BN: 0> },
    rentEpoch: 268
  },
  {
    data: <Buffer >,
    executable: false,
    lamports: 34457255446,
    owner: PublicKey { _bn: <BN: 0> },
    rentEpoch: 269
  }
]

----------------------------------------------------------------------
getParsedAccountInfo => {
  context: { slot: 116515059 },
  value: {
    data: { parsed: [Object], program: 'bpf-upgradeable-loader', space: 36 },
    executable: true,
    lamports: 1141440,
    owner: PublicKey {
      _bn: <BN: 2a8f6914e88a1b0e210153ef763ae2b00c2b93d16c124d2c0537a1004800000>
    },
    rentEpoch: 139
  }
}

----------------------------------------------------------------------
getParsedProgramAccounts => [
  {
    account: {
      data: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 206 more bytes>,
      executable: false,
      lamports: 2672640,
      owner: [PublicKey],
      rentEpoch: 269
    },
    pubkey: PublicKey {
      _bn: <BN: 72cb65d306048d50867c8088f4b4226e1d4b2884b4976f4d9c9adeff117263a5>
    }
  },
  {
    account: {
      data: <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 206 more bytes>,
      executable: false,
      lamports: 2672640,
      owner: [PublicKey],
      rentEpoch: 269
    },
    pubkey: PublicKey {
      _bn: <BN: 3ed5f006059647b1cbecaeeea38ad1b5b7b8de396bb3b3c0edab786238582edc>
    }
  }
]

----------------------------------------------------------------------
getTokenAccountsByOwner => {
  context: { slot: 116515059 },
  value: [ { account: [Object], pubkey: [PublicKey] } ]
}
*/
