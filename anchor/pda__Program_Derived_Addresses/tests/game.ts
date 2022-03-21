// Source: https://book.anchor-lang.com/chapter_3/PDAs.html
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Game } from '../target/types/game';
import { expect } from 'chai';

describe('game', async() => {

  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Game as Program<Game>;

  it('Sets and changes name!', async () => {
    const [userStatsPDA, _] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("user-stats"),
          anchor.getProvider().wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    await program.rpc.createUserStats("brian", {
      accounts: {
        user: anchor.getProvider().wallet.publicKey,
        userStats: userStatsPDA,
        systemProgram: SystemProgram.programId
      }
    });

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal("brian");

    await program.rpc.changeUserName("tom", {
      accounts: {
        user: anchor.getProvider().wallet.publicKey,
        userStats: userStatsPDA
      }
    })

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal("tom");
  });
});
