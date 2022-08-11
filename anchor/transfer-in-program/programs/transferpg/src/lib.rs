use anchor_lang::prelude::*;

declare_id!("73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep");

#[program]
pub mod transferpg {
    // use anchor_lang::solana_program::{program::invoke, system_instruction};
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.vault.authority = ctx.accounts.authority.key();
        ctx.accounts.vault.bump = *ctx.bumps.get("vault").unwrap();
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let from = &ctx.accounts.vault.to_account_info();
        let to = &ctx.accounts.wallet.to_account_info();
        transfer_service_fee_lamports(
            from,
            to,
            amount
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// CHECK:
    #[account(
        init, 
        payer = authority, 
        space = 8 + 8 + 32 + 1,
        seeds = [
            b"vault".as_ref()
        ],
        bump
    )]
    vault: Account<'info, Vault>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = authority, seeds = [b"vault".as_ref()], bump)]
    vault: Account<'info, Vault>,
    #[account(mut)]
    authority: Signer<'info>,
    /// CHECK:
    wallet: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

#[account]
pub struct Vault {
    authority: Pubkey,
    bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("insufficient funds for transaction.")]
    InsufficientFundsForTransaction,
}

fn transfer_service_fee_lamports(
    from_account: &AccountInfo,
    to_account: &AccountInfo,
    amount_of_lamports: u64,
) -> Result<()> {
    // Does the from account have enough lamports to transfer?
    if **from_account.try_borrow_lamports()? < amount_of_lamports {
        return Err(ErrorCode::InsufficientFundsForTransaction.into());
    }
    // Debit from_account and credit to_account
    **from_account.try_borrow_mut_lamports()? -= amount_of_lamports;
    **to_account.try_borrow_mut_lamports()? += amount_of_lamports;
    Ok(())
}