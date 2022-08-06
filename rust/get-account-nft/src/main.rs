use std::str::FromStr;
use solana_program::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};
use mpl_token_metadata::pda::{
  // find_edition_account,
  find_metadata_account,
  find_use_authority_account,
  find_master_edition_account,
  find_collection_authority_account,
};

fn main() {
  // Ref: https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-generate-a-new-keypair
  
  //
  // --- Create Keypair ---
  //
  let wallet = Keypair::new();
  println!("Created keypair => {:?}", wallet);


  //
  // --- Create Keypair from Secret Key ---
  //
  let secret_key: [u8; 64] = [
      174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56, 222, 53, 138,
      189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246, 15, 185, 186, 82, 177, 240,
      148, 69, 241, 227, 167, 80, 141, 89, 240, 121, 121, 35, 172, 247, 68, 251, 226, 218, 48,
      63, 176, 109, 168, 89, 238, 135,
  ];
  if let Ok(wallet) = Keypair::from_bytes(&secret_key) {
      let pubkey = Signer::pubkey(&wallet);
      println!("Created keypair from Secret Key => {:?}", pubkey)
  }


  //
  // --- Find Account using mpl-token-metadata ---
  //
  // Mint Address(NFT): https://solscan.io/token/CCyPKVS2DJzkQMN6A518NP43Nsdqx9KeaY5JNp4WzbWD
  let mint_address = Pubkey::from_str("CCyPKVS2DJzkQMN6A518NP43Nsdqx9KeaY5JNp4WzbWD").unwrap();
  let mint_authority = Pubkey::from_str("9fPy23EmMFmWdUEK2UosFCWSVVcGiJeM36AAhrZpUxr6").unwrap();
  let update_authority = Pubkey::from_str("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd").unwrap();

  println!("\n--- NFT Oddkey Case1 --------------------------------");

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_edition_account.html
  // let edition_account = find_edition_account(mint, edition_number);

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_metadata_account.html
  let metadata_account = find_metadata_account(&mint_address);
  println!("metadata_account => {:?}", metadata_account);

  let use_authority = find_use_authority_account(&mint_address, &mint_authority);
  println!("use_authority => {:?}", use_authority);

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_master_edition_account.html
  let master_edition = find_master_edition_account(&mint_address);
  println!("master_edition => {:?}", master_edition);

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_collection_authority_account.html
  let collection_authority = find_collection_authority_account(&mint_address, &update_authority);
  println!("collection_authority => {:?}", collection_authority);


  //
  // --- Find Account using mpl-token-metadata ---
  //
  // Mint Address(NFT): https://solscan.io/token/3qDv5gUtmbr5FcHhxsQfBRbhQ2KEzkKT3sd1GU8Cg8SA
  let mint_address2 = Pubkey::from_str("3qDv5gUtmbr5FcHhxsQfBRbhQ2KEzkKT3sd1GU8Cg8SA").unwrap();
  let mint_authority2 = Pubkey::from_str("S1KumbmZukQyxJdcUMrfveduDFbLrEiW2CDtiixjfZk").unwrap();
  let update_authority2 = Pubkey::from_str("3sEbhF2jnNs5RB2ohFunmCiywFgHZokLWwSxGGAsmWMd").unwrap();

  println!("\n--- NFT Oddkey Case2 --------------------------------");

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_edition_account.html
  // let edition_account = find_edition_account(mint, edition_number);

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_metadata_account.html
  let metadata_account2 = find_metadata_account(&mint_address2);
  println!("metadata_account => {:?}", metadata_account2);

  let use_authority2 = find_use_authority_account(&mint_address2, &mint_authority2);
  println!("use_authority => {:?}", use_authority2);

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_master_edition_account.html
  let master_edition2 = find_master_edition_account(&mint_address2);
  println!("master_edition => {:?}", master_edition2);

  // Ref: https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/pda/fn.find_collection_authority_account.html
  let collection_authority2 = find_collection_authority_account(&mint_address2, &update_authority2);
  println!("collection_authority => {:?}", collection_authority2);
}

/*
% cargo run <THIS FILE>

Created keypair => Keypair(Keypair { secret: SecretKey: [163, 9, 32, 119, 9, 27, 181, 251, 192, 215, 237, 4, 199, 225, 101, 111, 119, 203, 31, 161, 82, 23, 223, 153, 60, 207, 41, 240, 99, 80, 50, 249], public: PublicKey(CompressedEdwardsY: [200, 21, 13, 68, 223, 236, 7, 126, 109, 86, 34, 100, 57, 112, 221, 239, 241, 107, 119, 88, 14, 109, 52, 196, 32, 39, 171, 80, 234, 32, 84, 99]), EdwardsPoint{
        X: FieldElement51([1057808283006706, 1654940672916126, 674372574114074, 1013423664454601, 2246096356385214]),
        Y: FieldElement51([99585211946643, 2118961468309973, 104300325523908, 156824974151797, 2143922441439969]),
        Z: FieldElement51([2069037298672942, 877468235060967, 774825223210534, 56281529772507, 763439151536846]),
        T: FieldElement51([271872142944530, 2034756576184704, 2126483956374119, 426469407557760, 618561847408669])
}) })
Created keypair from Secret Key => 24PNhTaNtomHhoy3fTRaMhAFCRj4uHqhZEEoWrKDbR5p

--- NFT Oddkey Case1 --------------------------------
metadata_account => (2LKRcJ7BCHgEZx5xgZ7w74dYrWGQtCVQ6F6Kk7DBAeN7, 255)
use_authority => (GNjxHw58sNRedSdfmzFNxATbK5EyXFW5EXoEnfPxWrdV, 254)
master_edition => (9fPy23EmMFmWdUEK2UosFCWSVVcGiJeM36AAhrZpUxr6, 249)
collection_authority => (uCs7dYGy6vLomkBrd5UHokPWVQzo9Dk2eb2Dq5doH5R, 255)

--- NFT Oddkey Case1 --------------------------------
metadata_account => (ApWQF6jHQkxqpaZV5ir9aADDhFfCAFCKTx8EYPMRB3c9, 253)
use_authority => (7w1RaE5owfXKPpLUjs9tzgJBwJtKSeS6YY47eWMRWKzZ, 255)
master_edition => (S1KumbmZukQyxJdcUMrfveduDFbLrEiW2CDtiixjfZk, 255)
collection_authority => (48pfJ1yn79i5V5zqSpp72qCuxxkgQZRfA1GdVKTCHvPG, 253)
*/