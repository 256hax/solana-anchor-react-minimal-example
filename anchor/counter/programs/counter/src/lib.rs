use anchor_lang::prelude::*;

declare_id!("73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep");

// Business Logic
#[program]
mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, start: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = *ctx.accounts.authority.key;
        counter.count = start;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }
}

// Validation
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 48)]
    pub counter: Account<'info, Counter>, // <= Create account
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
/*
#[account(init, payer = <target_account>, space = <num_bytes>)]
=>  Creates the account via a CPI to the system program and initializes it (sets its account discriminator).
    https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html
*/

// Validation
#[derive(Accounts)]
pub struct Increment<'info> {
    // has_one = authority means "counter.authority == authority.key()"
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, Counter>, // They should have "counter.authority"
    pub authority: Signer<'info>, // authority.key()
}
/*
#[account(has_one = <target_account>)]
=>  Checks the target_account field on the account matches the key of the target_account field in the Accounts struct.
    Example1:
        #[account(mut, has_one = authority)]
        pub data: Account<'info, MyData>,
        pub authority: Signer<'info>
                        
        In this example has_one checks that data.authority = authority.key()
    https://docs.rs/anchor-lang/latest/anchor_lang/derive.Accounts.html

    Example2:
        #[derive(Accounts)]
        pub struct SetData<'info> {
            #[account(mut)]
            pub my_account: Account<'info, MyAccount>,
            #[account(
                constraint = my_account.mint == token_account.mint,
                has_one = owner
            )]
            pub token_account: Account<'info, TokenAccount>,
            pub owner: Signer<'info>
        }

        We used has_one to check that token_account.owner == owner.key(). 
    https://www.anchor-lang.com/docs/the-accounts-struct
*/

// Data
#[account]
pub struct Counter {
    pub authority: Pubkey, // counter.authority
    pub count: u64, // counter.count
}