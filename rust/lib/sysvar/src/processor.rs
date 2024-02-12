// Source: https://github.com/solana-labs/solana-program-library/tree/2e1286b06a8f96a1f6a5355fd188f11ff34447f8/examples/rust/sysvar)
//! Program instruction processor
use chrono::{Utc, TimeZone};

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    sysvar::{clock::Clock, rent::Rent, Sysvar},
};

/// Instruction processor
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    // Create in iterator to safety reference accounts in the slice
    let account_info_iter = &mut accounts.iter();


    msg!("--- Get the clock sysvar via syscall -----------------------------------------");
    // Get the clock sysvar via syscall
    let clock_via_sysvar = Clock::get()?;
    // Or deserialize the account into a clock struct
    let clock_sysvar_info = next_account_info(account_info_iter)?;
    let clock_via_account = Clock::from_account_info(clock_sysvar_info)?;
    // Both produce the same sysvar
    assert_eq!(clock_via_sysvar, clock_via_account);

    msg!("account_info_iter: {:?}", account_info_iter);
    msg!("clock_via_sysvar: {:?}", clock_via_sysvar);
    // Note: `format!` can be very expensive, use cautiously
    msg!("clock_sysvar_info: {:?}", clock_sysvar_info);

    msg!("epoch_start_timestamp: {:?}", Utc.timestamp(clock_via_sysvar.epoch_start_timestamp, 0).to_string());
    msg!("unix_timestamp: {:?}", Utc.timestamp(clock_via_sysvar.unix_timestamp, 0).to_string());


    msg!("--- Get the rent sysvar via syscall -------------------------------------------");
    // Get the rent sysvar via syscall
    let rent_via_sysvar = Rent::get()?;
    // Or deserialize the account into a rent struct
    let rent_sysvar_info = next_account_info(account_info_iter)?;
    let rent_via_account = Rent::from_account_info(rent_sysvar_info)?;
    // Both produce the same sysvar
    assert_eq!(rent_via_sysvar, rent_via_account);

    msg!("rent_via_sysvar: {:?}", rent_via_sysvar);
    msg!("rent_sysvar_info: {:?}", rent_sysvar_info);
    msg!("rent_via_account: {:?}", rent_via_account);
    // Can't print `exemption_threshold` because BPF does not support printing floats
    msg!(
        "Rent: lamports_per_byte_year => {:?}, burn_percent: {:?}",
        rent_via_sysvar.lamports_per_byte_year,
        rent_via_sysvar.burn_percent
    );

    Ok(())
}
