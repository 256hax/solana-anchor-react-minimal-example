use anchor_lang::prelude::*;

declare_id!("Fepp9QeEjxdqfYkokG8T6wtEZWadvWfwaXSeLThsrmjC");

#[program]
pub mod post_to_earn {
    use super::*;

    pub fn create_counter(ctx: Context<CreateCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.bump = *ctx.bumps.get("counter").unwrap();
        counter.count = 0;
        Ok(())
    }

    pub fn increment_counter(ctx: Context<IncrementCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }

    pub fn create_payment(ctx: Context<CreatePayment>) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        payment.bump = *ctx.bumps.get("payment").unwrap();
        payment.count = 0;
        Ok(())
    }

    pub fn update_payment(ctx: Context<UpdatePayment>) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        let counter = &mut ctx.accounts.counter;
        payment.count += counter.count - payment.count;
        Ok(())
    }
}

/* -----------------------------------------------------------------
    Counter
   -----------------------------------------------------------------*/
#[account]
pub struct Counter {
    bump: u8,
    count: u8,
}

// validation struct
#[derive(Accounts)]
pub struct CreateCounter<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // Space Reference: https://book.anchor-lang.com/chapter_5/space.html
    // space: 8 discriminator + 1 bump + 1 count
    #[account(
        init,
        payer = user,
        space = 8 + 1 + 1, seeds = [b"counter", user.key().as_ref()], bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

// validation struct
#[derive(Accounts)]
pub struct IncrementCounter<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()], bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
}

/* -----------------------------------------------------------------
    Payment
   -----------------------------------------------------------------*/
#[account]
pub struct Payment {
    bump: u8,
    count: u8,
}

// validation struct
#[derive(Accounts)]
pub struct CreatePayment<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 1 bump + 1 count
    #[account(
        init,
        payer = user,
        space = 8 + 1 + 1, seeds = [b"payment", user.key().as_ref()], bump
    )]
    pub payment: Account<'info, Payment>,
    pub system_program: Program<'info, System>,
}

// validation struct
#[derive(Accounts)]
pub struct UpdatePayment<'info> {
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"payment", user.key().as_ref()], bump = payment.bump
    )]
    pub payment: Account<'info, Payment>,
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()], bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
}
