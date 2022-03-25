use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod crud {
    use super::*;

    pub fn create(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let crud_account = &mut ctx.accounts.crud_account;
        crud_account.data = data;
        msg!("data: {}", data);
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> Result<()> {
        let crud_account = &mut ctx.accounts.crud_account;
        crud_account.data = data;
        msg!("data: {}", data);
        Ok(())
    }

    pub fn delete(ctx: Context<Update>) -> Result<()> {
        let crud_account = &mut ctx.accounts.crud_account;
        crud_account.data = 0;
        msg!("data: {}", crud_account.data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub crud_account: Account<'info, CrudAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub crud_account: Account<'info, CrudAccount>,
}

#[account]
pub struct CrudAccount {
    pub data: u64,
}
