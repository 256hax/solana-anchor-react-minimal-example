use {
    solana_program::{
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
        sysvar::{self},
    },
    solana_program_test::*,
    solana_sdk::{signature::Signer, transaction::Transaction},
    spl_example_sysvar::processor::process_instruction,
    std::str::FromStr,
};

#[tokio::test]
async fn test_sysvar() {
    let program_id = Pubkey::from_str("Sysvar1111111111111111111111111111111111111").unwrap();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "spl_example_sysvar",
        program_id,
        processor!(process_instruction),
    )
    .start()
    .await;

    let mut transaction = Transaction::new_with_payer(
        &[Instruction::new_with_bincode(
            program_id,
            &(),
            vec![
                AccountMeta::new(sysvar::clock::id(), false),
                AccountMeta::new(sysvar::rent::id(), false),
            ],
        )],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[&payer], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();
}

/*
% cargo test
    Finished test [unoptimized + debuginfo] target(s) in 0.44s
     Running unittests (target/debug/deps/spl_example_sysvar-5c3bf11f55811f53)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/functional.rs (target/debug/deps/functional-3008a973e783b1f7)

running 1 test
[2022-02-27T06:19:28.404114000Z INFO  solana_program_test] "spl_example_sysvar" program loaded as native code
[2022-02-27T06:19:28.584957000Z DEBUG solana_runtime::message_processor::stable_log] Program Sysvar1111111111111111111111111111111111111 invoke [1]
[2022-02-27T06:19:28.585106000Z DEBUG solana_runtime::message_processor::stable_log] Program log: --- Get the clock sysvar via syscall -----------------------------------------
[2022-02-27T06:19:28.585245000Z DEBUG solana_runtime::message_processor::stable_log] Program log: account_info_iter: Iter([AccountInfo { key: SysvarRent111111111111111111111111111111111, owner: Sysvar1111111111111111111111111111111111111, is_signer: false, is_writable: false, executable: false, rent_epoch: 0, lamports: 1009200, data.len: 17, data: 980d000000000000000000000000004032, .. }])
[2022-02-27T06:19:28.585279000Z DEBUG solana_runtime::message_processor::stable_log] Program log: clock_via_sysvar: Clock { slot: 1, epoch_start_timestamp: 1645942768, epoch: 0, leader_schedule_epoch: 1, unix_timestamp: 1645942768 }
[2022-02-27T06:19:28.585374000Z DEBUG solana_runtime::message_processor::stable_log] Program log: clock_sysvar_info: AccountInfo { key: SysvarC1ock11111111111111111111111111111111, owner: Sysvar1111111111111111111111111111111111111, is_signer: false, is_writable: false, executable: false, rent_epoch: 0, lamports: 1169280, data.len: 40, data: 0100000000000000f0171b620000000000000000000000000100000000000000f0171b6200000000, .. }
[2022-02-27T06:19:28.585428000Z DEBUG solana_runtime::message_processor::stable_log] Program log: epoch_start_timestamp: "2022-02-27 06:19:28 UTC"
[2022-02-27T06:19:28.585452000Z DEBUG solana_runtime::message_processor::stable_log] Program log: unix_timestamp: "2022-02-27 06:19:28 UTC"
[2022-02-27T06:19:28.585466000Z DEBUG solana_runtime::message_processor::stable_log] Program log: --- Get the rent sysvar via syscall -------------------------------------------
[2022-02-27T06:19:28.585495000Z DEBUG solana_runtime::message_processor::stable_log] Program log: rent_via_sysvar: Rent { lamports_per_byte_year: 3480, exemption_threshold: 2.0, burn_percent: 50 }
[2022-02-27T06:19:28.585588000Z DEBUG solana_runtime::message_processor::stable_log] Program log: rent_sysvar_info: AccountInfo { key: SysvarRent111111111111111111111111111111111, owner: Sysvar1111111111111111111111111111111111111, is_signer: false, is_writable: false, executable: false, rent_epoch: 0, lamports: 1009200, data.len: 17, data: 980d000000000000000000000000004032, .. }
[2022-02-27T06:19:28.585614000Z DEBUG solana_runtime::message_processor::stable_log] Program log: rent_via_account: Rent { lamports_per_byte_year: 3480, exemption_threshold: 2.0, burn_percent: 50 }
[2022-02-27T06:19:28.585631000Z DEBUG solana_runtime::message_processor::stable_log] Program log: Rent: lamports_per_byte_year => 3480, burn_percent: 50
[2022-02-27T06:19:28.585647000Z DEBUG solana_runtime::message_processor::stable_log] Program Sysvar1111111111111111111111111111111111111 success
test test_sysvar ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.18s

   Doc-tests spl-example-sysvar

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
*/
