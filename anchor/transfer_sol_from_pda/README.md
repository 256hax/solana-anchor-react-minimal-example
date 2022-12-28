# Transfer SOL from PDA
## Run
```
% npm i
% anchor test
```

terminal log:
```
  myanc
provider.wallet.publicKey => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
pda => 7UefELwS4qTqqgdLtg8KAm2F3CFLWxkk921bRnhWg3Jz
bump => 255

--- before transfer ---
balancePda => 1 SOL
randomWallet => 0 SOL
    ✔ Airdrop to PDA (187ms)

--- after transfer ---
balancePda => 0.999 SOL
randomWallet => 0.001 SOL
    ✔ Transfer SOL from PDA (459ms)


  2 passing (649ms)

✨  Done in 2.19s.
```