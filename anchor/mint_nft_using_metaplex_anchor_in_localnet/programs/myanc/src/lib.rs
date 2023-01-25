use anchor_lang::prelude::*;

declare_id!("d6Xe6XPw2LPUm8QsLQc8ekopiyt1tCEypRJTRDb1jKy");

#[program]
pub mod myanc {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
