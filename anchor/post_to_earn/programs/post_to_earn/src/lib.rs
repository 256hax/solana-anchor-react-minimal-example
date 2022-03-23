use anchor_lang::prelude::*;

declare_id!("Fepp9QeEjxdqfYkokG8T6wtEZWadvWfwaXSeLThsrmjC");

#[program]
pub mod post_to_earn {
    use super::*;
    // handler function
    pub fn create(ctx: Context<Create>, authority: Pubkey) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = authority;
        counter.bump = *ctx.bumps.get("counter").unwrap();
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

#[account]
pub struct Counter {
    authority: Pubkey,
    bump: u8,
    count: u8,
}

// validation struct
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"counter", user.key().as_ref()], bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

// validation struct
#[derive(Accounts)]
pub struct Increment<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()], bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
}
