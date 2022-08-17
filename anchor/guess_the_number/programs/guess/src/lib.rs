use anchor_lang::prelude::*;

declare_id!("73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep");

#[program]
pub mod guess {
    use super::*;

    pub fn create_user_answers(
        ctx: Context<CreateUserAnswers>,
        token_account: Pubkey,
        mint: Pubkey,
        answer: String,
        bump: u8,
    ) -> Result<()> {
        let user_answers = &mut ctx.accounts.user_answers;
        user_answers.token_account = token_account;
        user_answers.mint = mint;
        user_answers.answer = answer;

        // user_answers.bump = *ctx.bumps.get("user_answers").unwrap();
        // Following code is reducing cpu consumpotion but unsecure.
        user_answers.bump = bump;
        Ok(())
    }
}

#[account]
pub struct UserAnswers {
    token_account: Pubkey, // token account of user(original owner of NFT)
    mint: Pubkey,
    answer: String,
    bump: u8,
}

#[derive(Accounts)]
pub struct CreateUserAnswers<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 32 publickey + 32 publickey + 200 answer + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 200 + 1, seeds = [b"user-answers", user.key().as_ref()], bump
    )]
    pub user_answers: Account<'info, UserAnswers>,
    pub system_program: Program<'info, System>,
}