use anchor_lang::prelude::*;

declare_id!("4LyLo2Jc8LAwBB67Tv2LBVLSizNTNpCEwSv5rAhHPSj6");

#[program]
pub mod initialize {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        msg!("This is lib.rs. Solana x Anchor programs success!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
