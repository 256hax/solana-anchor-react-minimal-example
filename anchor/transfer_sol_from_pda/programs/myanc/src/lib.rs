use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke_signed;

declare_id!("9wJcqMZMa1gw1yDP8t7QkFFcF9fiR9XVNhmeFBFTEPfB");

#[program]
pub mod myanc {
    use super::*;

    pub fn transfer_sol(
        ctx: Context<TransferSol>,
        amount: u64,
        bump: u8,
    ) -> Result<()> {
        let ix = system_instruction::transfer(
            ctx.accounts.pda.key, // payer
            ctx.accounts.taker.key, // taker
            amount,
        );

        invoke_signed(
            &ix,
            &[
                ctx.accounts.pda.to_account_info(), // payer
                ctx.accounts.taker.to_account_info(), // taker
                ctx.accounts.system_program.to_account_info(),
            ],
            &[
                &[
                    b"test",
                    &[bump],
                ]
            ],
        )?;

        Ok(())
    } 
}

#[derive(Accounts)]
pub struct TransferSol<'info> {
    #[account(mut)]
    pda: SystemAccount<'info>,
    #[account(mut)]
    taker: SystemAccount<'info>,
    system_program: Program<'info, System>,
}