use anchor_lang::prelude::*;

declare_id!("HbBzDg5NKv6Xr4LoGbhvPSi2F5ivEmPg2DcN1f4JhM83");

#[program]
pub mod initialize {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        msg!("This is lib.rs. Solana x Anchor programs success!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
