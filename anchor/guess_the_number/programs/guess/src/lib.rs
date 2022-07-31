use anchor_lang::prelude::*;

declare_id!("73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep");

#[program]
pub mod guess {
    use super::*;

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.level = 0;
        if name.as_bytes().len() > 200 {
            panic!();
        }
        user_stats.name = name;
        user_stats.bump = *ctx.bumps.get("user_stats").unwrap();
        Ok(())
    }

    pub fn change_user_name(ctx: Context<ChangeUserName>, new_name: String) -> Result<()> {
        if new_name.as_bytes().len() > 200 {
            panic!();
        }
        ctx.accounts.user_stats.name = new_name;
        Ok(())
    }
}

#[account]
pub struct UserStats {
    level: u16,
    name: String,
    bump: u8,
}

#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"user-stats", user.key().as_ref()], bump
    )]
    pub user_stats: Account<'info, UserStats>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeUserName<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"user-stats", user.key().as_ref()], bump = user_stats.bump)]
    pub user_stats: Account<'info, UserStats>,
}