use metaboss_lib::decode::{
    decode_edition_from_mint, decode_master_edition_from_mint, decode_metadata_from_mint,
};
use solana_client::rpc_client::RpcClient;

fn main() {
    // let url = "http://localhost:8899".to_string();
    let url = "https://api.devnet.solana.com".to_string();
    let client = RpcClient::new(url);

    // Ref: https://docs.rs/metaboss_lib/0.0.4/metaboss_lib/decode/index.html
    let mint_address = "7fKSeoH1a6oTFetgrBNuxZKg5ow4Pf5VAioRosQTzTCs";

    // Ref: https://docs.rs/metaboss_lib/0.0.4/metaboss_lib/decode/fn.decode_edition_from_mint.html
    let edition = decode_edition_from_mint(&client, &mint_address);
    // Ref: https://docs.rs/metaplex-token-metadata/0.0.1/metaplex_token_metadata/state/struct.Edition.html
    let _e = edition.map(|e| {
        println!("\n--- Decode Edition ---");
        println!("key => {:?}", e.key);
        println!("parent => {:?}", e.parent);
        println!("edition => {:?}", e.edition);
    });


    // Ref: https://docs.rs/metaboss_lib/0.0.4/metaboss_lib/decode/fn.decode_master_edition_from_mint.html
    let master_edition = decode_master_edition_from_mint(&client, &mint_address);
    // Ref: https://docs.rs/metaplex-token-metadata/0.0.1/metaplex_token_metadata/state/struct.MasterEditionV2.html
    let _me = master_edition.map(|m| {
        println!("\n--- Decode Master Edition ---");
        println!("key => {:?}", m.key);
        println!("supply => {:?}", m.supply);
        println!("max_supply => {:?}", m.max_supply);
    });


    // Ref: https://docs.rs/metaboss_lib/0.0.4/metaboss_lib/decode/fn.decode_metadata_from_mint.html
    let metadata = decode_metadata_from_mint(&client, &mint_address);
    // Ref: https://docs.rs/metaplex-token-metadata/0.0.1/metaplex_token_metadata/state/struct.Metadata.html
    let _mt = metadata.map(|mt| {
        println!("\n--- Decode Metadata ---");
        println!("key => {:?}", mt.key);
        println!("update_authority => {:?}", mt.update_authority);
        println!("mint => {:?}", mt.mint);
        println!("data => {:?}", mt.data);
    });
}

/*
% cargo run

--- Decode Edition ---
key => MasterEditionV2
parent => 4uQeVj5tqViW2C8TTXkTmHvFdVW71G4oxPzBr9er3a7
edition => 0

--- Decode Master Edition ---
key => MasterEditionV2
supply => 1
max_supply => Some(2)

--- Decode Metadata ---
key => MetadataV1
update_authority => 7i1FBCcx9v6KM8Hy1AWffm42KFXh1C8FbSXBUMPpuCZ5
mint => 7fKSeoH1a6oTFetgrBNuxZKg5ow4Pf5VAioRosQTzTCs
data => Data { name: "My NFT\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0", symbol: "\0\0\0\0\0\0\0\0\0\0", uri: "https://arweave.net/2FOp1hD3PdpBMLjtTB8JAZ6M9LpW7-6CdlTkWbcU_AI\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0", seller_fee_basis_points: 500, creators: Some([Creator { address: 7i1FBCcx9v6KM8Hy1AWffm42KFXh1C8FbSXBUMPpuCZ5, verified: true, share: 100 }]) }
*/