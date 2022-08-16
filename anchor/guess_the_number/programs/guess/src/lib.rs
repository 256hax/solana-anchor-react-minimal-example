use anchor_lang::prelude::*;

declare_id!("73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep");

#[program]
pub mod guess {
    use super::*;

    pub fn create_user_answers(
        ctx: Context<CreateUserAnswers>,
        token_account: Pubkey,
        answer: String,
    ) -> Result<()> {
        let user_answers = &mut ctx.accounts.user_answers;
        user_answers.token_account = token_account;
        user_answers.answer = answer;
        user_answers.bump = *ctx.bumps.get("user_answers").unwrap();
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub enum AuthorityType {
    /// Authority to mint new tokens
    MintTokens,
    /// Authority to freeze any account associated with the Mint
    FreezeAccount,
    /// Owner of a given token account
    AccountOwner,
    /// Authority to close a token account
    CloseAccount,
}

#[account]
pub struct UserAnswers {
    token_account: Pubkey, // Token Account of User(Original Owner)
    answer: String,
    bump: u8,
}

#[derive(Accounts)]
pub struct CreateUserAnswers<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 32 publickey + 200 answer + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 200 + 1, seeds = [b"user-answers", user.key().as_ref()], bump
    )]
    pub user_answers: Account<'info, UserAnswers>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetAuthorityEscrow<'info> {
    #[account(signer)]
    /// CHECK:
    pub current_authority: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK:
    pub account_or_mint: AccountInfo<'info>,
    /// CHECK:
    pub token_program: AccountInfo<'info>,
}