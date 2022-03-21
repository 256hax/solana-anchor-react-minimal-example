// Source: https://book.anchor-lang.com/chapter_3/PDAs.html
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Game } from '../target/types/game';
import { expect } from 'chai';

describe('game', async() => {

  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Game as Program<Game>;
  let userStatsPDA = null;

  it('Sets name.', async () => {
    const [_userStatsPDA, _bump] = await PublicKey
      .findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode("user-stats"),
          anchor.getProvider().wallet.publicKey.toBuffer()
        ],
        program.programId
      );

    userStatsPDA = _userStatsPDA;

    const set_tx = await program.rpc.createUserStats("brian", {
      accounts: {
        user: anchor.getProvider().wallet.publicKey,
        userStats: userStatsPDA,
        systemProgram: SystemProgram.programId
      }
    });

    const fetchUserStats = await program.account.userStats.fetch(userStatsPDA);
    expect(fetchUserStats.name).to.equal("brian");

    console.log('\n');
    console.log('userStatsPDA   =>', userStatsPDA.toString());
    console.log('_bump          =>', _bump);
    console.log('fetchUserStats =>', fetchUserStats);
    console.log('set_tx         =>', set_tx);
  });

  it('Changes name.', async () => {
    const change_tx = await program.rpc.changeUserName("tom", {
      accounts: {
        user: anchor.getProvider().wallet.publicKey,
        userStats: userStatsPDA
      }
    })

    const fetchNewUserStats = await program.account.userStats.fetch(userStatsPDA);
    expect(fetchNewUserStats.name).to.equal("tom");

    console.log('\n');
    console.log('fetchNewUserStats  =>', fetchNewUserStats);
    console.log('change_tx          =>', change_tx);
  });
});

/*
% anchor test
~~~
game


userStatsPDA   => 6oL8AZ9MeqYFNzdCBQVsbZwFGfZt2DopMfmm5ews8cRr
_bump          => 255
fetchUserStats => { level: 0, name: 'brian', bump: 255 }
set_tx         => 3vsjwtTuhi3S98H39VCZzEaKJbRwRPQf2NxAPgpJyMyWLeD15mMuTbKYZuZ2bFygqiajs4miUr9cx39vnXkb92fC
  ✔ Sets name. (419ms)


fetchNewUserStats  => { level: 0, name: 'tom', bump: 255 }
change_tx          => 2GkLLEus5dYa9Qg6HK5BFgYTHet8UqSzMo8fHkqKqmVxToXTktyCAqZnyDnWRK8xQhxexEHi24ooLfaW7s9MgQm1
  ✔ Changes name. (455ms)


2 passing (880ms)

✨  Done in 6.74s.
*/
