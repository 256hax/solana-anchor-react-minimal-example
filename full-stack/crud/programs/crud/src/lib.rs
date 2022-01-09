use anchor_lang::prelude::*;

declare_id!("Fepp9QeEjxdqfYkokG8T6wtEZWadvWfwaXSeLThsrmjC");

#[program]
mod crud {
    use super::*;

    pub fn create(ctx: Context<Initialize>, data: u64) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        msg!("data: {}", data);
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = data;
        msg!("data: {}", data);
        Ok(())
    }

    pub fn delete(ctx: Context<Update>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = 0;
        msg!("data: {}", my_account.data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[account]
pub struct MyAccount {
    pub data: u64,
}
