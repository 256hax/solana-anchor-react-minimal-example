use anchor_lang::prelude::*;

declare_id!("Fepp9QeEjxdqfYkokG8T6wtEZWadvWfwaXSeLThsrmjC");

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
